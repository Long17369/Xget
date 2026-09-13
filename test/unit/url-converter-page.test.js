import { describe, expect, it } from 'vitest';

import { PLATFORM_CATALOG } from '../../src/config/platform-catalog.js';
import worker from '../../src/index.js';
import {
  createPlatformSourceResponse,
  renderPlatformSource
} from '../../src/response/platform-source.js';
import { createUrlConverterResponse } from '../../src/response/url-converter-page.js';

/** @type {ExecutionContext} */
const executionContext = {
  waitUntil() {},
  passThroughOnException() {}
};

describe('Restored URL converter page', () => {
  it('serves the archived markup with the deployment origin filled in', async () => {
    const response = createUrlConverterResponse({ origin: 'https://xget.example' });
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/html');
    expect(body).toContain('Xget URL Converter');
    expect(body).toContain('https://xget.example/Xget.png');
    expect(body).toContain('https://xget.example/zh-hans.html');
  });

  it('drops Cloudflare injections and restores the contact links', async () => {
    const response = createUrlConverterResponse({ origin: 'https://xget.example' });
    const body = await response.text();

    expect(body).not.toContain('cdn-cgi');
    expect(body).not.toContain('cloudflareinsights');
    expect(body).not.toContain('xuc.xi-xu.me');
    expect(body).toContain('mailto:i@xi-xu.me?subject=Xget%20Business%20Inquiry');
  });

  it('loads every asset from the site root and keeps the page policy', async () => {
    const response = createUrlConverterResponse({ origin: 'https://xget.example' });
    const body = await response.text();
    const policy = response.headers.get('Content-Security-Policy') || '';

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).toContain("connect-src 'self'");
    expect(body).toContain('href="style.css"');
    expect(body).toContain('src="i18n.js"');
    expect(body).toContain('src="script.js"');
    expect(body).toContain('href="Xget.ico"');
  });

  it('renders the platform list in the shape the page parses', () => {
    const source = renderPlatformSource();
    const entries = source.split('\n').filter(line => line.includes("': '"));

    expect(source.startsWith('export const PLATFORMS = {')).toBe(true);
    expect(source.trimEnd().endsWith('};')).toBe(true);
    expect(entries.length).toBe(Object.keys(PLATFORM_CATALOG).length);
    expect(source).toContain("'gh': 'https://github.com'");

    const response = createPlatformSourceResponse();
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('application/javascript');
  });

  it('serves the page, its locale paths and the platform endpoint', async () => {
    const page = await worker.fetch(new Request('https://example.com/'), {}, executionContext);
    const pageBody = await page.text();

    expect(page.status).toBe(200);
    expect(page.headers.get('Content-Type')).toContain('text/html');
    expect(page.headers.get('Content-Security-Policy')).toContain(
      "script-src 'self' 'unsafe-inline'"
    );
    expect(pageBody).toContain('https://example.com/Xget.png');

    for (const path of ['/index.html', '/zh-hans.html', '/zh-hant.html', '/404.html']) {
      const locale = await worker.fetch(
        new Request(`https://example.com${path}`),
        {},
        executionContext
      );
      expect(locale.status).toBe(200);
      expect(await locale.text()).toContain('Xget URL Converter');
    }

    const platforms = await worker.fetch(
      new Request('https://example.com/platforms.js'),
      {},
      executionContext
    );
    expect(platforms.status).toBe(200);
    expect(await platforms.text()).toContain('export const PLATFORMS = {');
  });
});
