import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const htaccess = readFileSync(resolve(process.cwd(), 'public/.htaccess'), 'utf8');

describe('static hosting route normalization', () => {
  it('redirects prerendered route directories to their no-slash canonical path', () => {
    expect(htaccess).toContain('RewriteCond %{REQUEST_FILENAME} -d');
    expect(htaccess).toContain('RewriteCond %{REQUEST_URI} !^/$');
    expect(htaccess).toContain('RewriteCond %{REQUEST_URI} /$');
    expect(htaccess).toContain('RewriteRule ^(.+)/$ /$1 [R=301,L,NE]');
  });

  it('serves no-slash prerendered route directories as index.html', () => {
    expect(htaccess).toContain('RewriteCond %{REQUEST_URI} !/$');
    expect(htaccess).toContain('RewriteRule ^(.+)$ $1/index.html [L]');
  });

  it('leaves the root and static asset directories outside route normalization', () => {
    expect(htaccess).toContain('RewriteCond %{REQUEST_URI} !^/$');
    expect(htaccess).toContain('RewriteCond %{REQUEST_URI} !^/(?:assets|brands|fonts|projects|seo)(?:/|$) [NC]');
    expect(htaccess).toContain('ErrorDocument 404 /404.html');
  });
});
