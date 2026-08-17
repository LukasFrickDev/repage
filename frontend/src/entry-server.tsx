import { prerenderToNodeStream } from 'react-dom/static.node';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { AppContent } from './App';
import { getRouteMetadata, resolveRouteMetadata, serializeStructuredData, type EffectiveRouteMetadata } from './app/routeMetadata';
import { generateRobotsTxt, generateSitemapXml, listSitemapUrls } from './app/seoFiles';
import { isSiteIndexingEnabled } from './config/site';
import { listPrerenderRoutes } from './prerenderRoutes';

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  for await (const chunk of stream as AsyncIterable<Uint8Array | string>) {
    chunks.push(typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true }));
  }
  chunks.push(decoder.decode());
  return chunks.join('');
}

export async function renderPathname(pathname: string): Promise<{ markup: string; styles: string; metadata: EffectiveRouteMetadata }> {
  const sheet = new ServerStyleSheet();
  try {
    const element = sheet.collectStyles(
      <StaticRouter location={pathname}>
        <AppContent prerender />
      </StaticRouter>,
    );
    const { prelude } = await prerenderToNodeStream(element, { onError: (error) => { throw error; } });
    const metadata = getRouteMetadata(pathname);
    return { markup: await streamToString(prelude), styles: sheet.getStyleTags(), metadata: resolveRouteMetadata(metadata) };
  } finally {
    sheet.seal();
  }
}

export { listPrerenderRoutes };
export { isSiteIndexingEnabled };
export { generateRobotsTxt, generateSitemapXml, listSitemapUrls };
export { serializeStructuredData };
