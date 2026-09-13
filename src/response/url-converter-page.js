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
 * Restored "Xget URL 转换器" page, the former `xuc.xi-xu.me`.
 *
 * The markup below is the archived capture of 2026-08-15 with Cloudflare's
 * injected scripts removed, the obfuscated contact link restored, and the
 * original domain replaced by a placeholder that is filled in per request.
 * Its assets (`style.css`, `script.js`, `i18n.js`, `Xget.png`, `Xget.ico`)
 * are served from the site root, and the bundled `script.js` reads the
 * platform list from this deployment's `/platforms.js` endpoint.
 *
 * Regenerate with `tmp/xuc/gen_page.py` after re-downloading the capture.
 */

/** Placeholder standing in for the deployment origin inside the markup. */
const ORIGIN_PLACEHOLDER = '__XGET_ORIGIN__';

/**
 * Content Security Policy of the restored page.
 *
 * Mirrors the policy the page shipped in its own meta tag, minus the jsDelivr
 * allowance: the platform list is now served from this origin.
 */
const PAGE_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; font-src 'self'";

/** Cache lifetime of the page, in seconds. */
const PAGE_CACHE_SECONDS = 300;

/** Archived markup of the converter page (captured 2026-08-15). */
const PAGE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Basic Meta Information -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <!-- Primary Meta Tags -->
    <title>
      Xget URL Converter - Fast URL Conversion for GitHub, npm, Docker & More
    </title>
    <meta
      name="title"
      content="Xget URL Converter - Fast URL Conversion for GitHub, npm, Docker & More"
    />
    <meta
      name="description"
      content="Convert URLs to Xget-accelerated format instantly. Support for GitHub, npm, Docker Hub, Homebrew, and more developer platforms. Free, secure, client-side URL conversion tool with no registration required."
    />
    <meta
      name="keywords"
      content="Xget, URL converter, GitHub download accelerator, npm mirror, Docker Hub mirror, Homebrew bottles, URL conversion tool, download acceleration, CDN accelerator, developer tools, GitHub raw files, container registry, package manager, open source tools, free URL converter"
    />
    <meta name="author" content="Xi Xu" />
    <meta name="language" content="en" />
    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />
    <meta name="googlebot" content="index, follow" />
    <meta name="bingbot" content="index, follow" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="__XGET_ORIGIN__" />
    <meta
      property="og:title"
      content="Xget URL Converter - Fast URL Conversion for GitHub, npm, Docker & More"
    />
    <meta
      property="og:description"
      content="Convert URLs to Xget-accelerated format instantly. Support for GitHub, npm, Docker Hub, Homebrew, and more developer platforms. Free, secure, client-side URL conversion tool with no registration required."
    />
    <meta property="og:image" content="__XGET_ORIGIN__/Xget.png" />
    <meta property="og:image:alt" content="Xget URL Converter Logo" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Xget URL Converter" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="__XGET_ORIGIN__" />
    <meta
      property="twitter:title"
      content="Xget URL Converter - Fast URL Conversion for GitHub, npm, Docker & More"
    />
    <meta
      property="twitter:description"
      content="Convert URLs to Xget-accelerated format instantly. Support for GitHub, npm, Docker Hub, Homebrew, and more developer platforms. Free, secure, client-side URL conversion tool with no registration required."
    />
    <meta property="twitter:image" content="__XGET_ORIGIN__/Xget.png" />
    <meta property="twitter:image:alt" content="Xget URL Converter Logo" />
    <meta property="twitter:creator" content="@xixu_me" />
    <meta property="twitter:site" content="@xixu_me" />

    <!-- Additional Meta Tags -->
    <meta name="theme-color" content="#0052d9" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Xget URL Converter" />
    <meta name="application-name" content="Xget URL Converter" />
    <meta name="msapplication-TileColor" content="#0052d9" />
    <meta name="msapplication-TileImage" content="Xget.png" />
    <meta name="msapplication-square70x70logo" content="Xget.png" />
    <meta name="msapplication-square150x150logo" content="Xget.png" />
    <meta name="msapplication-wide310x150logo" content="Xget.png" />
    <meta name="msapplication-square310x310logo" content="Xget.png" />

    <!-- Security Headers -->
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://cdn.jsdelivr.net; font-src 'self';"
    />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta
      http-equiv="Referrer-Policy"
      content="strict-origin-when-cross-origin"
    />

    <!-- Performance Optimization -->
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />

    <!-- Canonical URL and Alternate Languages -->
    <link rel="canonical" href="__XGET_ORIGIN__" />
    <link rel="alternate" hreflang="en" href="__XGET_ORIGIN__" />
    <link
      rel="alternate"
      hreflang="zh-Hans"
      href="__XGET_ORIGIN__/zh-hans.html"
    />
    <link
      rel="alternate"
      hreflang="zh-Hant"
      href="__XGET_ORIGIN__/zh-hant.html"
    />
    <link rel="alternate" hreflang="x-default" href="__XGET_ORIGIN__" />

    <!-- Stylesheets -->
    <link rel="stylesheet" href="style.css" />

    <!-- Favicon and Icons -->
    <link rel="icon" type="image/x-icon" href="Xget.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="Xget.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="Xget.png" />
    <link rel="apple-touch-icon" sizes="57x57" href="Xget.png" />
    <link rel="shortcut icon" href="Xget.ico" />

    <!-- Structured Data (JSON-LD) -->
    <script id="structured-data-webapp" type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Xget URL Converter",
        "description": "Convert URLs to Xget-accelerated format instantly. Support for GitHub, npm, Docker Hub, Homebrew, and more developer platforms.",
        "url": "__XGET_ORIGIN__",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": "Xi Xu",
          "url": "https://xi-xu.me"
        },
        "publisher": {
          "@type": "Person",
          "name": "Xi Xu",
          "url": "https://xi-xu.me"
        },
        "inLanguage": "en",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "softwareVersion": "1.0",
        "featureList": [
          "GitHub URL conversion",
          "npm URL conversion",
          "Docker Hub URL conversion",
          "Homebrew URL conversion",
          "Custom URL of an Xget instance support",
          "Client-side processing",
          "No registration required",
          "Free to use"
        ],
        "screenshot": "__XGET_ORIGIN__/Xget.png",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "ratingCount": "1"
        }
      }
    </script>

    <script id="structured-data-breadcrumb" type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "__XGET_ORIGIN__"
          }
        ]
      }
    </script>

    <script id="structured-data-organization" type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Xget",
        "url": "https://github.com/xixu-me/Xget",
        "logo": "__XGET_ORIGIN__/Xget.png",
        "sameAs": ["https://github.com/xixu-me/Xget"]
      }
    </script>
  </head>
  <body data-page="home">
    <!-- Main Container -->
    <div class="container">
      <!-- Sponsor Popup Modal -->
      <div id="sponsor-modal" class="modal hidden">
        <div class="modal-content">
          <div class="modal-header">
            <h2 data-i18n="shared.modal.title">Support Us</h2>
            <span class="close-button" id="close-modal">&times;</span>
          </div>
          <div class="modal-body">
            <p data-i18n="shared.modal.description">
              If you find this tool helpful, consider supporting us:
            </p>
            <div class="modal-links">
              <a
                href="https://xi-xu.me/#sponsorships"
                target="_blank"
                rel="noopener noreferrer"
                class="modal-link"
              >
                <span>💖</span>
                <span data-i18n="shared.modal.sponsor">Sponsor</span>
              </a>
              <a href="mailto:i@xi-xu.me?subject=Xget%20Business%20Inquiry" class="modal-link">
                <span>🤝</span>
                <span data-i18n="shared.modal.partner">Partner With Us</span>
              </a>
            </div>
            <div class="modal-footer">
              <label class="dont-show-again">
                <input type="checkbox" id="dont-show-again" />
                <span data-i18n="shared.modal.dontShowAgain">
                  Don't show again
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <!-- Header Section -->
      <header class="header">
        <div class="header-top">
          <div
            class="language-switcher"
            role="group"
            data-i18n-aria-label="shared.languageLabel"
          >
            <span class="language-switcher-icon" aria-hidden="true">🌐</span>
            <div class="language-options">
              <button
                type="button"
                class="language-option"
                data-locale-option="en"
                data-i18n="shared.languages.en"
              >
                English
              </button>
              <button
                type="button"
                class="language-option"
                data-locale-option="zh-Hans"
                data-i18n="shared.languages.zh-Hans"
              >
                汉语（简体）
              </button>
              <button
                type="button"
                class="language-option"
                data-locale-option="zh-Hant"
                data-i18n="shared.languages.zh-Hant"
              >
                漢語（繁體）
              </button>
            </div>
          </div>
        </div>
        <h1 class="title" data-i18n="shared.appName">Xget URL Converter</h1>
        <p class="subtitle" data-i18n="shared.subtitle">
          Convert URLs from supported platforms to Xget-accelerated URLs
        </p>
      </header>

      <!-- Main Content -->
      <main class="main">
        <!-- URL Converter Section -->
        <div class="converter-section">
          <!-- URL of an Xget Instance Configuration -->
          <div class="input-group">
            <label for="xget-domain" class="label">
              <span data-i18n="home.form.xgetDomainLabel">
                URL of an Xget Instance
              </span>
            </label>
            <input
              type="url"
              id="xget-domain"
              class="input"
              placeholder="https://xget.xi-xu.me"
              value="https://xget.xi-xu.me"
              autocomplete="off"
              spellcheck="false"
            />
          </div>

          <!-- URL Input -->
          <div class="input-group">
            <label for="original-url" class="label">
              <span data-i18n="home.form.originalUrlLabel">Original URL</span>
            </label>
            <input
              type="url"
              id="original-url"
              class="input"
              data-i18n-placeholder="home.form.originalUrlPlaceholder"
              placeholder="Paste a URL from any supported platform"
              autocomplete="off"
              spellcheck="false"
            />
          </div>

          <!-- Platform Detection Status -->
          <div class="platform-status">
            <span class="platform-indicator">
              <span class="platform-dot"></span>
              <span id="platform-name">Platform will be auto-detected</span>
            </span>
          </div>

          <!-- Conversion Result -->
          <div id="result-section" class="result-section hidden">
            <div class="input-group">
              <label for="converted-url" class="label">
                <span data-i18n="home.form.convertedUrlLabel">
                  Converted URL
                </span>
              </label>
              <div class="output-container">
                <input
                  type="text"
                  id="converted-url"
                  class="input output"
                  readonly
                  data-i18n-placeholder="home.form.convertedUrlPlaceholder"
                  placeholder="Converted URL will appear here"
                />
                <button
                  id="copy-btn"
                  class="copy-btn"
                  data-i18n-title="shared.actions.copyToClipboard"
                  data-i18n-aria-label="shared.actions.copyToClipboard"
                  title="Copy to clipboard"
                >
                  <span class="copy-icon">📋</span>
                  <span class="copy-text" data-i18n="shared.actions.copy">
                    Copy
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Error Messages -->
          <div id="error-message" class="error-message hidden"></div>
        </div>
      </main>

      <!-- Footer Section -->
      <footer class="footer">
        <div class="footer-content">
          <p class="footer-text">
            <span data-i18n="shared.footer.poweredByPrefix">由</span>
            <a
              href="https://github.com/xixu-me/Xget"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              Xget
            </a>
            <span data-i18n="shared.footer.poweredBySuffix">提供支持</span>
          </p>
          <p class="footer-links">
            <a
              href="https://xi-xu.me/#sponsorships"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-link"
            >
              <span>💖</span>
              <span data-i18n="shared.footer.sponsor">Sponsor</span>
            </a>
            |
            <a href="mailto:i@xi-xu.me?subject=Xget%20Business%20Inquiry" class="footer-link">
              <span>🤝</span>
              <span data-i18n="shared.footer.partner">Partner With Us</span>
            </a>
          </p>
          <p class="footer-note" data-i18n="shared.footer.platformConfig">
            Platform configurations dynamically loaded from the Xget repository
          </p>
          <p class="footer-copyright">
            Copyright &copy; <span id="copyright-year">2025</span>
            <a
              href="https://xi-xu.me"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-author-link"
              >Xi Xu</a
            >.
            <span data-i18n="shared.footer.rightsReserved">
              All rights reserved.
            </span>
          </p>
        </div>
      </footer>
    </div>

    <!-- Scripts -->
    <script src="i18n.js"></script>
    <script src="script.js"></script></body>
</html>
`;

/**
 * Creates the restored URL converter response.
 * @param {{ origin: string }} options
 * @returns {Response} HTML response for the restored page.
 */
export function createUrlConverterResponse({ origin }) {
  return new Response(PAGE_TEMPLATE.replaceAll(ORIGIN_PLACEHOLDER, origin), {
    headers: {
      'Cache-Control': `public, max-age=${PAGE_CACHE_SECONDS}`,
      'Content-Security-Policy': PAGE_CSP,
      'Content-Type': 'text/html; charset=utf-8'
    },
    status: 200
  });
}
