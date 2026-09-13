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
 * Platform list endpoint for the restored URL converter page.
 *
 * The original page downloaded `src/config/platforms.js` from the upstream
 * repository through jsDelivr and parsed the inline `PLATFORMS` object out of
 * it with a regular expression. That repository no longer exists, so the same
 * shape is rendered here from the deployment's own catalog.
 */

import { PLATFORM_CATALOG } from '../config/platform-catalog.js';

/** Cache lifetime of the rendered platform source, in seconds. */
const PLATFORM_SOURCE_CACHE_SECONDS = 300;

/**
 * Renders the platform catalog as an inline `PLATFORMS` object literal.
 * @returns {string} JavaScript source consumed by the converter page.
 */
export function renderPlatformSource() {
  const entries = Object.entries(PLATFORM_CATALOG)
    .map(([key, baseUrl]) => `  '${key}': '${baseUrl}'`)
    .join(',\n');

  return `export const PLATFORMS = {\n${entries}\n};\n`;
}

/**
 * Creates the response served at `/platforms.js`.
 * @returns {Response} JavaScript response holding the platform list.
 */
export function createPlatformSourceResponse() {
  return new Response(renderPlatformSource(), {
    headers: {
      'Cache-Control': `public, max-age=${PLATFORM_SOURCE_CACHE_SECONDS}`,
      'Content-Type': 'application/javascript; charset=utf-8'
    },
    status: 200
  });
}
