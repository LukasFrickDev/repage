import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findProjectBySlug, projects } from '.';
import {
  findDuplicateReadinessSlugs,
  findReadinessBySlug,
  listRegisteredProjectMediaPaths,
  projectReadinessManifest,
  validateProjectReadinessManifest,
} from './projectReadiness';
import type { ProjectReadiness } from './projectReadiness';

const publicDirectory = resolve(import.meta.dirname, '../../../public');
const intentionallyExcludedPaths = [
  'projects/dev-schedule/devschedule-admin-appointments-desktop.png',
  'projects/dev-schedule/devschedule-admin-appointments-mobile.png',
  'projects/alicerce-da-alma/alicerce-author-desktop.png',
  'projects/alicerce-da-alma/alicerce-author-mobile.png',
  'projects/alicerce-da-alma/alicerce-cta-desktop.png',
  'projects/alicerce-da-alma/alicerce-cta-mobile.png',
];

function listFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function readPngDimensions(path: string): { width: number; height: number } {
  const buffer = readFileSync(path);
  const signature = '89504e470d0a1a0a';

  expect(buffer.subarray(0, 8).toString('hex')).toBe(signature);
  expect(buffer.subarray(12, 16).toString('ascii')).toBe('IHDR');

  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

type EbmlElement = { id: number; contentStart: number; contentEnd: number };

function readEbmlId(buffer: Buffer, offset: number): { length: number; value: number } | null {
  const first = buffer[offset];
  if (first === undefined) return null;

  let length = 1;
  let mask = 0x80;
  while (length <= 4 && !(first & mask)) {
    length += 1;
    mask >>= 1;
  }
  if (length > 4 || offset + length > buffer.length) return null;

  let value = 0;
  for (let index = 0; index < length; index += 1) value = value * 256 + buffer[offset + index];
  return { length, value };
}

function readEbmlSize(buffer: Buffer, offset: number): { length: number; value: number; unknown: boolean } | null {
  const first = buffer[offset];
  if (first === undefined) return null;

  let length = 1;
  let mask = 0x80;
  while (length <= 8 && !(first & mask)) {
    length += 1;
    mask >>= 1;
  }
  if (length > 8 || offset + length > buffer.length) return null;

  let value = first & (mask - 1);
  let unknown = value === mask - 1;
  for (let index = 1; index < length; index += 1) {
    value = value * 256 + buffer[offset + index];
    unknown &&= buffer[offset + index] === 0xff;
  }
  return { length, value, unknown };
}

function eachEbmlElement(buffer: Buffer, start: number, end: number, visit: (element: EbmlElement) => void): void {
  let cursor = start;
  while (cursor < end) {
    const id = readEbmlId(buffer, cursor);
    if (!id) return;
    const size = readEbmlSize(buffer, cursor + id.length);
    if (!size) return;

    const contentStart = cursor + id.length + size.length;
    const contentEnd = size.unknown ? end : Math.min(contentStart + size.value, end);
    if (contentStart > end) return;

    visit({ id: id.value, contentStart, contentEnd });
    if (contentEnd <= cursor) return;
    cursor = contentEnd;
  }
}

function readUnsignedInteger(buffer: Buffer, start: number, end: number): number {
  let value = 0;
  for (let index = start; index < end; index += 1) value = value * 256 + buffer[index];
  return value;
}

function readFloat(buffer: Buffer, start: number, end: number): number | null {
  if (end - start === 4) return buffer.readFloatBE(start);
  if (end - start === 8) return buffer.readDoubleBE(start);
  return null;
}

function readWebmMetadata(path: string): { width: number | null; height: number | null; durationSeconds: number | null; codec: string | null; hasAudio: boolean } {
  const buffer = readFileSync(path);
  let scale = 1_000_000;
  let duration: number | null = null;
  let width: number | null = null;
  let height: number | null = null;
  let codec: string | null = null;
  let hasAudio = false;

  const containers = new Set([0x18538067, 0x1549a966, 0x1654ae6b, 0xae, 0xe0, 0x1f43b675]);
  const walk = (start: number, end: number): void => {
    eachEbmlElement(buffer, start, end, (element) => {
      if (element.id === 0x2ad7b1) scale = readUnsignedInteger(buffer, element.contentStart, element.contentEnd);
      if (element.id === 0x4489) duration = readFloat(buffer, element.contentStart, element.contentEnd);
      if (element.id === 0xb0) width = readUnsignedInteger(buffer, element.contentStart, element.contentEnd);
      if (element.id === 0xba) height = readUnsignedInteger(buffer, element.contentStart, element.contentEnd);
      if (element.id === 0x86) codec = buffer.subarray(element.contentStart, element.contentEnd).toString('utf8');
      if (element.id === 0xe1) hasAudio = true;
      if (containers.has(element.id)) walk(element.contentStart, element.contentEnd);
    });
  };

  walk(0, buffer.length);
  return {
    width,
    height,
    durationSeconds: duration === null ? null : Number((duration * scale / 1_000_000_000).toFixed(2)),
    codec,
    hasAudio,
  };
}

describe('project readiness manifest', () => {
  it('covers every project with coherent readiness states', () => {
    expect(projectReadinessManifest).toHaveLength(6);
    expect(validateProjectReadinessManifest()).toEqual([]);
    expect(projects.every((project) => project.publicationStatus === 'published')).toBe(true);
  });

  it('resolves known slugs and rejects unknown slugs', () => {
    expect(findReadinessBySlug('dev-schedule')?.linkStatus).toBe('verified');
    expect(findReadinessBySlug('unknown-project')).toBeUndefined();
    expect(findProjectBySlug('unknown-project')).toBeUndefined();
  });

  it('detects duplicated slugs and missing paid-media authorization', () => {
    const duplicate = { ...projectReadinessManifest[0] } satisfies ProjectReadiness;
    const invalidPaidMedia: ProjectReadiness = {
      ...projectReadinessManifest[0],
      authorizationStatus: 'pending',
      authorizationSource: null,
      assets: projectReadinessManifest[0].assets.map((asset) => ({ ...asset, authorizationStatus: 'pending' })),
    };

    expect(findDuplicateReadinessSlugs([projectReadinessManifest[0], duplicate])).toEqual(['echo-cosmic-energia']);
    expect(validateProjectReadinessManifest([invalidPaidMedia, ...projectReadinessManifest.slice(1)])).toContain(
      'Projeto pago sem autorização confirmada: echo-cosmic-energia.',
    );
  });

  it('registers every screenshot and video with matching files and bytes', () => {
    const assets = projectReadinessManifest.flatMap((record) => record.assets);
    const videos = assets.filter((asset) => asset.kind === 'video');

    expect(assets).toHaveLength(61);
    expect(assets.filter((asset) => asset.kind === 'screenshot')).toHaveLength(47);
    expect(videos).toHaveLength(14);
    expect(assets.filter((asset) => asset.roles.includes('social'))).toHaveLength(6);

    assets.forEach((asset) => {
      const absolutePath = resolve(publicDirectory, asset.path.replace(/^\//, ''));
      expect(existsSync(absolutePath), asset.path).toBe(true);
      expect(statSync(absolutePath).size, asset.path).toBe(asset.bytes);

      if (asset.kind === 'screenshot') {
        expect(readPngDimensions(absolutePath), asset.path).toEqual({ width: asset.width, height: asset.height });
      } else {
        const metadata = readWebmMetadata(absolutePath);
        expect(metadata.width, asset.path).toBe(asset.width);
        expect(metadata.height, asset.path).toBe(asset.height);
        expect(metadata.durationSeconds, asset.path).toBe(asset.durationSeconds);
        expect(metadata.codec, asset.path).toBe(asset.codec);
        expect(metadata.hasAudio, asset.path).toBe(asset.hasAudio);
      }
    });
    videos.forEach((asset) => {
      expect(asset.format).toBe('webm');
      expect(asset.codec).toBe('V_VP8');
      expect(asset.hasAudio).toBe(false);
      expect(asset.durationSeconds).toBeGreaterThan(0);
      expect(asset.posterPath).toBeTruthy();
      expect(asset.fallbackPath).toBeTruthy();
    });
  });

  it('keeps projects próprios e desafios apart from clients and gives every blocker a next step', () => {
    expect(findReadinessBySlug('dev-schedule')?.authorizationStatus).toBe('not-required');
    expect(findReadinessBySlug('green-tweet')?.authorizationStatus).toBe('not-required');
    projectReadinessManifest.forEach((record) => {
      expect(record.blockers).toHaveLength(record.nextSteps.length);
    });
  });

  it('does not mark media with pending privacy review as ready', () => {
    const prematurelyReady: ProjectReadiness = {
      ...projectReadinessManifest[0],
      mediaStatus: 'ready',
      assets: projectReadinessManifest[0].assets.map((asset, index) => (
        index === 0 ? { ...asset, privacyReview: 'pending' } : asset
      )),
    };

    expect(validateProjectReadinessManifest([prematurelyReady, ...projectReadinessManifest.slice(1)])).toContain(
      'Mídia pronta sem revisão de privacidade aprovada: /projects/echo-cosmic-energia/echo-social.png.',
    );
  });

  it('has no unregistered media files and keeps intentionally excluded screenshots absent', () => {
    const registeredPaths = new Set(listRegisteredProjectMediaPaths().map((path) => path.replace(/^\//, '')));
    const actualPaths = listFiles(resolve(publicDirectory, 'projects'))
      .map((path) => path.replace(/\\/g, '/'))
      .map((path) => path.slice(path.indexOf('/projects/') + 1));

    expect([...actualPaths].sort()).toEqual([...registeredPaths].sort());
    intentionallyExcludedPaths.forEach((path) => expect(existsSync(resolve(publicDirectory, path)), path).toBe(false));
  });
});
