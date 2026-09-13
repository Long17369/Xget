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
 * Keeps HTTP range semantics intact when the Cloudflare edge cache interferes.
 *
 * Range requests are normally forwarded upstream as-is, but the edge cache used
 * by `cf.cacheEverything` can collapse them into full-object responses:
 *
 * - objects larger than the per-object limit cannot be stored, so the cache
 *   fill response (a full `200`) is returned instead of the requested slice;
 * - objects already stored in the edge cache can be returned in full instead of
 *   being sliced into a `206`.
 *
 * Both cases silently break resume (`wget -c`) and multi-connection downloads,
 * so this module detects them from the upstream response, remembers the affected
 * targets, and retries without edge caching.
 */

/**
 * Maximum object size stored by the Cloudflare edge cache per object.
 *
 * Objects larger than this limit cannot be cached, which means range requests
 * have to bypass the edge cache to keep their `206` semantics.
 */
export const EDGE_CACHE_MAX_OBJECT_BYTES = 512 * 1024 * 1024;

/** Synthetic path used to remember targets that must skip the edge cache. */
const HINT_PATH = '/__xget/range-hint';

/**
 * Reads a response `Content-Length` header as a number.
 * @param {Response} response - Upstream response
 * @returns {number | null} Parsed content length, or null when absent or invalid.
 */
function readContentLength(response) {
  try {
    const raw = response.headers.get('Content-Length');
    if (!raw) {
      return null;
    }

    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  } catch (headerError) {
    console.warn('Could not read upstream content length:', headerError);
    return null;
  }
}

/**
 * Checks whether a response body exceeds the edge cache per-object limit.
 * @param {Response} response - Upstream response
 * @returns {boolean} True when the object is too large to be cached by the edge.
 */
export function isOversizedResponse(response) {
  const contentLength = readContentLength(response);
  return contentLength !== null && contentLength > EDGE_CACHE_MAX_OBJECT_BYTES;
}

/**
 * Checks whether a response actually satisfies a range request.
 * @param {Response} response - Upstream response
 * @returns {boolean} True when the response is a `206` or carries `Content-Range`.
 */
export function isRangeSatisfied(response) {
  if (response.status === 206) {
    return true;
  }

  try {
    return response.headers.has('Content-Range');
  } catch (headerError) {
    console.warn('Could not read upstream content range:', headerError);
    return false;
  }
}

/**
 * Builds the cache key used to remember a target that must skip the edge cache.
 * @param {string} origin - Origin of the incoming request
 * @param {string} targetUrl - Upstream target URL
 * @returns {Request} Synthetic cache key request
 */
function buildHintKey(origin, targetUrl) {
  return new Request(`${origin}${HINT_PATH}?u=${encodeURIComponent(targetUrl)}`, { method: 'GET' });
}

/**
 * Checks whether range requests for a target must skip the edge cache.
 * @param {object} options
 * @param {Cache | null} options.cache - Edge cache instance
 * @param {string} options.origin - Origin of the incoming request
 * @param {string} options.targetUrl - Upstream target URL
 * @returns {Promise<boolean>} True when the target is known to break range semantics in cache.
 */
export async function readEdgeCacheHint({ cache, origin, targetUrl }) {
  if (!cache) {
    return false;
  }

  try {
    return Boolean(await cache.match(buildHintKey(origin, targetUrl)));
  } catch (cacheError) {
    console.warn('Edge cache hint read failed:', cacheError);
    return false;
  }
}

/**
 * Remembers a target that must skip the edge cache from now on.
 * @param {object} options
 * @param {Cache | null} options.cache - Edge cache instance
 * @param {import('../config/index.js').ApplicationConfig} options.config - App configuration
 * @param {ExecutionContext} [options.ctx] - Execution context for background work
 * @param {string} options.origin - Origin of the incoming request
 * @param {string} options.targetUrl - Upstream target URL
 * @returns {void}
 */
export function rememberEdgeCacheHint({ cache, config, ctx, origin, targetUrl }) {
  if (!cache) {
    return;
  }

  const marker = new Response('1', {
    headers: { 'Cache-Control': `public, max-age=${config.CACHE_DURATION}` }
  });
  const key = buildHintKey(origin, targetUrl);

  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(cache.put(key, marker));
    return;
  }

  cache
    .put(key, marker)
    .catch(cacheError => console.warn('Edge cache hint write failed:', cacheError));
}

/**
 * Releases a response body that is about to be discarded.
 * @param {Response} response - Response to discard
 * @returns {void}
 */
function cancelResponseBody(response) {
  try {
    response.body?.cancel();
  } catch (cancelError) {
    console.warn('Failed to cancel collapsed range response:', cancelError);
  }
}

/**
 * Inspects a download response and decides whether it has to be refetched.
 *
 * Oversized objects are remembered so later range requests skip the edge cache.
 * When a range request came back as a full response, the caller is told to retry
 * without edge caching, which lets the upstream `206` reach the client.
 * @param {object} options
 * @param {Cache | null} options.cache - Edge cache instance
 * @param {import('../config/index.js').ApplicationConfig} options.config - App configuration
 * @param {ExecutionContext} [options.ctx] - Execution context for background work
 * @param {string} options.origin - Origin of the incoming request
 * @param {string | null} options.rangeHeader - Range header sent by the client
 * @param {Response} options.response - Response returned by the original fetch
 * @param {string} options.targetUrl - Upstream target URL
 * @returns {Promise<boolean>} True when the request must be retried without edge caching.
 */
export async function shouldRetryWithoutEdgeCache({
  cache,
  config,
  ctx,
  origin,
  rangeHeader,
  response,
  targetUrl
}) {
  const oversized = isOversizedResponse(response);

  if (oversized) {
    // Oversized objects degrade as soon as the edge stores them, so remember the
    // target to keep later range requests away from the edge cache.
    rememberEdgeCacheHint({ cache, config, ctx, origin, targetUrl });
  }

  // A range request answered with the whole oversized object means the edge cache
  // collapsed it: ask for a retry so the upstream `206` reaches the client.
  if (!oversized || rangeHeader === null || isRangeSatisfied(response)) {
    return false;
  }

  cancelResponseBody(response);
  return true;
}
