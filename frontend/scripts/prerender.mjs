import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(frontendRoot, 'dist');
const ssrRoot = join(frontendRoot, '.ssr');

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function metadataTags(metadata) {
  const tags = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="robots" content="${metadata.robots}" />`,
  ];
  if (metadata.canonical) tags.push(`<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`);
  Object.entries(metadata.openGraph).forEach(([name, content]) => tags.push(`<meta property="${name}" content="${escapeHtml(content)}" />`));
  Object.entries(metadata.twitter).forEach(([name, content]) => tags.push(`<meta name="${name}" content="${escapeHtml(content)}" />`));
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

export function assertOutput(html, pathname, metadata) {
  if (!html.includes('<div id="root">')) throw new Error(`Output sem root: ${pathname}`);
  if (/<div id="root">\s*<\/div>/.test(html)) throw new Error(`Root vazio: ${pathname}`);
  if (!/<h1\b/i.test(html)) throw new Error(`Heading ausente: ${pathname}`);
  if (html.includes('Carregando página')) throw new Error(`Fallback de Suspense permaneceu no output: ${pathname}`);
  for (const required of [`<title>${escapeHtml(metadata.title)}</title>`, `name="description"`, `name="robots"`]) {
    if (!html.includes(required)) throw new Error(`Metadata ausente (${required}) em ${pathname}`);
  }
  if (!html.includes(`name="robots" content="${metadata.robots}"`)) throw new Error(`Robots incorreto: ${pathname}`);
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
  const routes = server.listPrerenderRoutes();
  if (new Set(routes).size !== routes.length) throw new Error('Rotas duplicadas no prerender.');

  for (const pathname of routes) {
    const rendered = await server.renderPathname(pathname);
    const html = template
      .replace('</head>', `    ${rendered.styles}\n    ${metadataTags(rendered.metadata)}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${rendered.markup}</div>`)
      .replace('</body>', `${scripts}\n  </body>`);
    assertOutput(html, pathname, rendered.metadata);
    const destination = outputPath(pathname);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, html);
  }
  await writeFile(join(distRoot, 'sitemap.xml'), server.generateSitemapXml(), 'utf8');
  await writeFile(join(distRoot, 'robots.txt'), server.generateRobotsTxt(), 'utf8');
  console.log(`Prerendered ${routes.length} routes.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } finally {
    await rm(ssrRoot, { recursive: true, force: true });
  }
}
