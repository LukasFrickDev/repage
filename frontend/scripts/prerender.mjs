import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(frontendRoot, 'dist');
const ssrRoot = join(frontendRoot, '.ssr');

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function metadataTags(metadata, indexingEnabled) {
  const robots = indexingEnabled ? metadata.robots : 'noindex, nofollow';
  const tags = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
  ];
  if (metadata.canonical) tags.push(`<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`);
  if (metadata.path) {
    const social = metadata.socialImage;
    tags.push(
      `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
      `<meta property="og:url" content="${escapeHtml(metadata.canonical)}" />`,
      `<meta property="og:type" content="${metadata.openGraph.type}" />`,
      '<meta property="og:site_name" content="Repage" />',
      '<meta property="og:locale" content="pt_BR" />',
      `<meta property="og:image" content="${escapeHtml(social.url)}" />`,
      `<meta property="og:image:width" content="${social.width}" />`,
      `<meta property="og:image:height" content="${social.height}" />`,
      `<meta property="og:image:alt" content="${escapeHtml(social.alt)}" />`,
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
      `<meta name="twitter:image" content="${escapeHtml(social.url)}" />`,
      `<meta name="twitter:image:alt" content="${escapeHtml(social.alt)}" />`,
    );
  }
  return tags.join('\n    ');
}

function stripRuntimeMetadata(template) {
  return template
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/i, '')
    .replace(/\s*<meta\s+name="robots"[^>]*>/i, '')
    .replace(/\s*<link\s+rel="canonical"[^>]*>/i, '')
    .replace(/\s*<meta\s+(?:name|property)="(?:og|twitter):[^>]*>/gi, '');
}

function removeRuntimeScripts(template) {
  const scripts = template.match(/\s*<script\b[^>]*>[\s\S]*?<\/script>/gi) ?? [];
  return { template: template.replace(/\s*<script\b[^>]*>[\s\S]*?<\/script>/gi, ''), scripts: scripts.join('\n') };
}

function outputPath(pathname) {
  if (pathname === '/__404__') return join(distRoot, '404.html');
  if (pathname === '/') return join(distRoot, 'index.html');
  return join(distRoot, pathname.slice(1), 'index.html');
}

export function assertOutput(html, pathname, metadata, indexingEnabled) {
  if (!html.includes('<div id="root">')) throw new Error(`Output sem root: ${pathname}`);
  if (/<div id="root">\s*<\/div>/.test(html)) throw new Error(`Root vazio: ${pathname}`);
  if (!/<h1\b/i.test(html)) throw new Error(`Heading ausente: ${pathname}`);
  if (html.includes('Carregando página')) throw new Error(`Fallback de Suspense permaneceu no output: ${pathname}`);
  for (const required of [`<title>${escapeHtml(metadata.title)}</title>`, `name="description"`, `name="robots"`]) {
    if (!html.includes(required)) throw new Error(`Metadata ausente (${required}) em ${pathname}`);
  }
  const expectedRobots = indexingEnabled ? metadata.robots : 'noindex, nofollow';
  if (!html.includes(`name="robots" content="${expectedRobots}"`)) throw new Error(`Robots incorreto: ${pathname}`);
  if (pathname === '/__404__') {
    if (html.includes('rel="canonical"')) throw new Error('404 não pode possuir canonical.');
  } else if (!metadata.canonical || !html.includes(`rel="canonical" href="${metadata.canonical}"`)) {
    throw new Error(`Canonical ausente: ${pathname}`);
  }
}

async function main() {
  const server = await import(pathToFileURL(join(ssrRoot, 'entry-server.js')).href);
  const rawTemplate = await readFile(join(distRoot, 'index.html'), 'utf8');
  const { template: templateWithoutScripts, scripts } = removeRuntimeScripts(rawTemplate);
  const template = stripRuntimeMetadata(templateWithoutScripts);
  const indexingEnabled = server.isSiteIndexingEnabled?.() ?? false;
  const routes = server.listPrerenderRoutes();
  if (new Set(routes).size !== routes.length) throw new Error('Rotas duplicadas no prerender.');

  for (const pathname of routes) {
    const rendered = await server.renderPathname(pathname);
    const html = template
      .replace('</head>', `    ${rendered.styles}\n    ${metadataTags(rendered.metadata, indexingEnabled)}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${rendered.markup}</div>`)
      .replace('</body>', `${scripts}\n  </body>`);
    assertOutput(html, pathname, rendered.metadata, indexingEnabled);
    const destination = outputPath(pathname);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, html);
  }
  console.log(`Prerendered ${routes.length} routes.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } finally {
    await rm(ssrRoot, { recursive: true, force: true });
  }
}
