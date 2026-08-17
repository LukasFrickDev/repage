import { prerenderToNodeStream } from 'react-dom/static.node';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import { AppContent } from './App';
import { getRouteMetadata, type RouteMetadata } from './app/routeMetadata';
import { isSiteIndexingEnabled } from './config/site';
import { listPrerenderRoutes } from './prerenderRoutes';

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream as AsyncIterable<Uint8Array | string>) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function renderPathname(pathname: string): Promise<{ markup: string; styles: string; metadata: RouteMetadata }> {
  const sheet = new ServerStyleSheet();
  try {
    const element = sheet.collectStyles(
      <StaticRouter location={pathname}>
        <AppContent prerender />
      </StaticRouter>,
    );
    const { prelude } = await prerenderToNodeStream(element, { onError: (error) => { throw error; } });
    return { markup: await streamToString(prelude), styles: sheet.getStyleTags(), metadata: getRouteMetadata(pathname) };
  } finally {
    sheet.seal();
  }
}

export { listPrerenderRoutes };
export { isSiteIndexingEnabled };
