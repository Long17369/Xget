/**
 * Xget - High-performance acceleration engine for developer resources
 * Copyright (C) Xi Xu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Homepage URL converter.
 *
 * Upstream links used to redirect to the project repository, which no longer
 * exists. The homepage now renders a small converter that turns a supported
 * upstream URL into its Xget equivalent, next to the list of supported
 * platforms. It is rendered server side and works without JavaScript.
 */

import { PLATFORM_CATALOG } from '../config/platform-catalog.js';
import { getPlatformPathPrefix } from '../routing/platform-index.js';

/**
 * Content Security Policy for the homepage.
 *
 * The page inlines its own styles, so `style-src` allows inline styles while
 * scripts stay disabled.
 */
const HOME_PAGE_CSP =
  "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'self'";

/** Cache lifetime for the converted homepage response, in seconds. */
const HOME_PAGE_CACHE_SECONDS = 300;

/**
 * Platform catalog entries keyed by host and path, longest match first.
 * @type {{ baseUrl: string, hostPath: string, key: string }[]}
 */
const SORTED_CATALOG = Object.entries(PLATFORM_CATALOG)
  .map(([key, baseUrl]) => {
    const parsed = new URL(baseUrl);
    return {
      baseUrl,
      hostPath: `${stripWww(parsed.host)}${parsed.pathname.replace(/\/$/, '')}`,
      key
    };
  })
  .sort((a, b) => b.hostPath.length - a.hostPath.length);

/**
 * Removes a leading `www.` label from a host.
 * @param {string} host
 * @returns {string} Host without the `www.` prefix.
 */
function stripWww(host) {
  return host.startsWith('www.') ? host.slice(4) : host;
}

/**
 * Escapes a value for interpolation into HTML text or attributes.
 * @param {string} value
 * @returns {string} Escaped value.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Converts an upstream URL into its Xget equivalent.
 * @param {string | null | undefined} input - Upstream URL entered by the user
 * @param {string} origin - Origin of the current Xget deployment
 * @returns {{ ok: true, converted: string, platform: string, prefix: string } | { ok: false, error: string }} Conversion result.
 */
export function convertToXgetUrl(input, origin) {
  const trimmed = String(input ?? '').trim();
  if (!trimmed) {
    return { ok: false, error: '请输入需要转换的 URL。' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: 'URL 格式不正确，请包含 http(s):// 前缀。' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: '仅支持 http / https 链接。' };
  }

  const targetPath = `${stripWww(parsed.host)}${parsed.pathname}`;
  const entry = SORTED_CATALOG.find(
    candidate =>
      targetPath === candidate.hostPath || targetPath.startsWith(`${candidate.hostPath}/`)
  );

  if (!entry) {
    return { ok: false, error: '暂不支持该地址，请对照页面下方的平台列表确认。' };
  }

  const remainder = targetPath.slice(entry.hostPath.length);

  return {
    converted: `${origin}${getPlatformPathPrefix(entry.key).replace(/\/$/, '')}${remainder}${parsed.search}`,
    ok: true,
    platform: entry.key,
    prefix: getPlatformPathPrefix(entry.key)
  };
}

/**
 * Renders the platform list as table rows.
 * @returns {string} Table rows for every supported platform.
 */
function renderPlatformRows() {
  return Object.entries(PLATFORM_CATALOG)
    .map(
      ([key, baseUrl]) =>
        `<tr><td><code>${escapeHtml(getPlatformPathPrefix(key))}</code></td><td><code>${escapeHtml(key)}</code></td><td><code>${escapeHtml(baseUrl)}</code></td></tr>`
    )
    .join('\n');
}

/**
 * Renders the conversion result block when the visitor submitted a URL.
 * @param {ReturnType<typeof convertToXgetUrl>} result
 * @param {string} origin
 * @returns {string} Result markup.
 */
function renderResult(result, origin) {
  if (result.ok) {
    return `<p class="ok">转换结果（平台 <code>${escapeHtml(result.platform)}</code>）：</p>
      <p><input class="result" type="text" readonly value="${escapeHtml(result.converted)}"></p>
      <p class="hint">可直接复制到 <code>git clone</code> / <code>wget</code> / <code>aria2c</code>，或 <a href="${escapeHtml(result.converted)}">点此访问</a>。</p>`;
  }

  if (result.error) {
    return `<p class="error">${escapeHtml(result.error)}</p>`;
  }

  return `<p class="hint">示例：<code>${escapeHtml(`${origin}/gh/torvalds/linux/archive/refs/heads/master.zip`)}</code></p>`;
}

/**
 * Builds the homepage HTML document.
 * @param {{ input?: string | null, notice?: string | null, origin: string }} options
 * @returns {string} Complete HTML document.
 */
function renderHomePage({ input, notice, origin }) {
  const result = convertToXgetUrl(input, origin);
  const noticeMarkup = notice ? `<p class="notice">${escapeHtml(notice)}</p>` : '';

  return `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Xget · URL 转换器</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; line-height: 1.6; margin: 0 auto; max-width: 56rem; padding: 2rem 1.25rem 4rem; }
  h1 { font-size: 1.6rem; margin: 0 0 .25rem; }
  p.sub { color: #6b7280; margin: 0 0 1.5rem; }
  form { display: flex; gap: .5rem; flex-wrap: wrap; margin: 0 0 1rem; }
  input[type=text] { flex: 1 1 22rem; padding: .6rem .75rem; font-size: 1rem; border: 1px solid #9ca3af; border-radius: .5rem; }
  input.result { width: 100%; background: rgba(127,127,127,.12); }
  button { padding: .6rem 1.25rem; font-size: 1rem; border: 0; border-radius: .5rem; background: #2563eb; color: #fff; cursor: pointer; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .92em; }
  table { border-collapse: collapse; width: 100%; font-size: .9rem; }
  th, td { border-bottom: 1px solid rgba(127,127,127,.3); padding: .35rem .5rem; text-align: left; }
  .ok { color: #15803d; margin: .5rem 0; }
  .error { color: #b91c1c; margin: .5rem 0; }
  .notice { background: rgba(37,99,235,.12); border-radius: .5rem; padding: .5rem .75rem; }
  .hint { color: #6b7280; font-size: .92rem; }
  details { margin-top: 2rem; }
  summary { cursor: pointer; font-weight: 600; }
  ul { padding-left: 1.25rem; }
</style>
</head>
<body>
<h1>Xget · URL 转换器</h1>
<p class="sub">把受支持的上游地址转换成经 Xget 加速的地址。</p>
${noticeMarkup}
<form method="get" action="">
  <input type="text" name="url" value="${escapeHtml(input ?? '')}" placeholder="https://github.com/torvalds/linux/archive/refs/heads/master.zip" autofocus>
  <button type="submit">转换</button>
</form>
${renderResult(result, origin)}
<details>
  <summary>常用姿势</summary>
  <ul>
    <li>Git 仓库：<code>git clone ${escapeHtml(`${origin}/gh/owner/repo.git`)}</code></li>
    <li>断点续传：<code>wget -c ${escapeHtml(`${origin}/hf/owner/model/resolve/main/model.safetensors`)}</code></li>
    <li>多线程：<code>aria2c -x16 ${escapeHtml(`${origin}/gh/owner/repo/archive/refs/heads/main.zip`)}</code></li>
    <li>Hugging Face 客户端：<code>export HF_ENDPOINT=${escapeHtml(`${origin}/hf`)}</code></li>
  </ul>
</details>
<details>
  <summary>支持的平台（${Object.keys(PLATFORM_CATALOG).length} 个）</summary>
  <table>
    <thead><tr><th>前缀</th><th>平台</th><th>上游</th></tr></thead>
    <tbody>
${renderPlatformRows()}
    </tbody>
  </table>
</details>
</body>
</html>`;
}

/**
 * Creates the homepage response.
 * @param {{ input?: string | null, notice?: string | null, origin: string }} options
 * @returns {Response} HTML response with page specific security headers.
 */
export function createHomePageResponse({ input = null, notice = null, origin }) {
  const headers = new Headers({
    'Content-Security-Policy': HOME_PAGE_CSP,
    'Content-Type': 'text/html; charset=utf-8'
  });

  headers.set('Cache-Control', `public, max-age=${HOME_PAGE_CACHE_SECONDS}`);

  return new Response(renderHomePage({ input, notice, origin }), { headers, status: 200 });
}
