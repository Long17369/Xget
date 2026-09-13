import { describe, expect, it } from 'vitest';

import { PLATFORM_CATALOG } from '../../src/config/platform-catalog.js';
import worker from '../../src/index.js';
import { convertToXgetUrl, createHomePageResponse } from '../../src/response/home-page.js';

/** @type {ExecutionContext} */
const executionContext = {
  waitUntil() {},
  passThroughOnException() {}
};

/**
 * Converts an upstream URL or throws when the converter rejects it.
 * @param {string} input
 * @returns {string} Converted Xget URL.
 */
function convert(input) {
  const result = convertToXgetUrl(input, 'https://xget.example');
  if (!result.ok) {
    throw new Error(`converter rejected the URL: ${result.error}`);
  }
  return result.converted;
}

describe('Homepage URL converter', () => {
  it('converts supported upstream URLs into Xget URLs', () => {
    expect(
      convertToXgetUrl(
        'https://github.com/torvalds/linux/archive/refs/heads/master.zip',
        'https://xget.example'
      )
    ).toEqual({
      converted: 'https://xget.example/gh/torvalds/linux/archive/refs/heads/master.zip',
      ok: true,
      platform: 'gh',
      prefix: '/gh/'
    });

    expect(convert('https://huggingface.co/openai/whisper-tiny/resolve/main/config.json')).toBe(
      'https://xget.example/hf/openai/whisper-tiny/resolve/main/config.json'
    );

    expect(convert('https://registry.npmjs.org/react')).toBe('https://xget.example/npm/react');
  });

  it('keeps path style platform prefixes and query strings intact', () => {
    expect(convert('https://api.openai.com/v1/chat/completions')).toBe(
      'https://xget.example/ip/openai/v1/chat/completions'
    );

    expect(convert('https://formulae.brew.sh/api/formula/git.json')).toBe(
      'https://xget.example/homebrew/api/formula/git.json'
    );

    expect(convert('https://crates.io/serde?q=1')).toBe('https://xget.example/crates/serde?q=1');
  });

  it('accepts http links and www hosts', () => {
    expect(convert('http://github.com/a/b')).toBe('https://xget.example/gh/a/b');

    expect(convert('https://www.cpan.org/authors/id/T/TI/TIMB')).toBe(
      'https://xget.example/cpan/authors/id/T/TI/TIMB'
    );
  });

  it('reports unsupported or malformed input', () => {
    expect(convertToXgetUrl('https://example.invalid/file', 'https://xget.example')).toEqual({
      error: '暂不支持该地址，请对照页面下方的平台列表确认。',
      ok: false
    });

    expect(convertToXgetUrl('not-a-url', 'https://xget.example')).toEqual({
      error: 'URL 格式不正确，请包含 http(s):// 前缀。',
      ok: false
    });

    expect(convertToXgetUrl('   ', 'https://xget.example')).toEqual({
      error: '请输入需要转换的 URL。',
      ok: false
    });
  });

  it('renders every supported platform in the homepage table', async () => {
    const response = createHomePageResponse({ origin: 'https://xget.example' });
    const body = await response.text();
    const rows = body.match(/<tr><td>/g) || [];

    expect(rows.length).toBe(Object.keys(PLATFORM_CATALOG).length);
    expect(body).toContain('<code>/ip/openai/</code>');
    expect(body).toContain('<code>https://registry.npmjs.org</code>');
  });

  it('escapes submitted input and keeps scripts disabled', async () => {
    const response = createHomePageResponse({
      input: '"><script>alert(1)</script>',
      origin: 'https://xget.example'
    });
    const body = await response.text();
    const policy = response.headers.get('Content-Security-Policy') || '';

    expect(body).not.toContain('<script>');
    expect(body).toContain('&quot;&gt;&lt;script&gt;');
    expect(policy).toContain("default-src 'none'");
    expect(policy).toContain("style-src 'unsafe-inline'");
    expect(policy).not.toContain("script-src 'unsafe-inline'");
  });

  it('serves the converter on the root path and keeps the page policy through the worker', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/?url=https%3A%2F%2Fgithub.com%2Ftorvalds%2Flinux'),
      {},
      executionContext
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/html');
    expect(response.headers.get('Content-Security-Policy')).toContain("style-src 'unsafe-inline'");
    expect(body).toContain('https://example.com/gh/torvalds/linux');
  });
});
