import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/theme';

type ProjectPhoneFrameProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
  kind?: 'image' | 'video';
  poster?: string;
  fallbackSrc?: string;
  onExpand?: (event: MouseEvent<HTMLButtonElement>) => void;
  expandLabel?: string;
};

const Frame = styled.span`
  position: relative;
  width: 100%;
  display: block;
  overflow: hidden;
  padding: 0.75rem 0.5rem 0.6rem;
  background: linear-gradient(135deg, #263246 0%, ${colors.inkDeep} 44%, #111927 100%);
  border: 1px solid rgba(7, 12, 22, 0.92);
  border-radius: 1.5rem;
  box-shadow: 0 1.25rem 2.5rem rgba(16, 24, 39, 0.22), inset 0 0 0 1px rgba(245, 242, 236, 0.16);

  &::before,
  &::after {
    position: absolute;
    left: -0.16rem;
    width: 0.14rem;
    border-radius: 999px 0 0 999px;
    background: #0b1019;
    content: '';
  }

  &::before { top: 20%; height: 11%; }
  &::after { top: 35%; height: 18%; }
`;

const DeviceChrome = styled.span`
  position: absolute;
  top: 0.25rem;
  left: 50%;
  width: 3.15rem;
  height: 0.44rem;
  margin: 0;
  display: block;
  border-radius: 999px;
  background: #070c14;
  box-shadow: inset 0 1px 1px rgba(245, 242, 236, 0.12);
  transform: translateX(-50%);
`;

const Screen = styled.span`
  display: block;
  overflow: hidden;
  aspect-ratio: 195 / 422;
  border: 1px solid rgba(245, 242, 236, 0.14);
  border-radius: 1rem;
  background: #fff;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: top center;
`;

const Fallback = styled.span`
  width: 100%;
  height: 100%;
  min-height: 12rem;
  display: grid;
  place-items: center;
  background: ${colors.inkRaised};
  color: ${colors.textSecondary};
  font-size: 0.75rem;
  text-align: center;
`;

const ExpandButton = styled.button`
  position: absolute;
  z-index: 2;
  top: 0.22rem;
  right: 0.35rem;
  min-width: 1.8rem;
  min-height: 1.8rem;
  padding: 0.2rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(245, 242, 236, 0.28);
  border-radius: 0.35rem;
  background: rgba(16, 24, 39, 0.72);
  color: ${colors.paper};
  cursor: pointer;
  &:hover, &:focus-visible { background: rgba(108, 99, 255, 0.84); }
`;

export function ProjectPhoneFrame({ src, alt, width, height, loading = 'lazy', kind = 'image', poster, fallbackSrc, onExpand, expandLabel = 'Abrir mídia no viewer' }: ProjectPhoneFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <Frame data-project-phone-frame>
      <DeviceChrome aria-hidden="true" />
      {onExpand ? <ExpandButton type="button" onClick={onExpand} aria-label={expandLabel}><Maximize2 size={14} aria-hidden="true" /></ExpandButton> : null}
      <Screen>
        {failed ? (
          fallbackSrc ? <Image src={fallbackSrc} alt={alt} width={width} height={height} loading="lazy" /> : <Fallback role="img" aria-label={`${alt} — mídia indisponível`}>Mídia indisponível</Fallback>
        ) : kind === 'video' ? (
          <Video
            src={src}
            poster={poster}
            width={width}
            height={height}
            controls
            playsInline
            preload="none"
            aria-label={alt}
            data-project-video="true"
            onError={() => setFailed(true)}
          />
        ) : (
          <Image src={src} alt={alt} width={width} height={height} loading={loading} onError={() => setFailed(true)} />
        )}
      </Screen>
    </Frame>
  );
}
