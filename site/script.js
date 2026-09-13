/**
 * ============================================================================
 * Xget URL Converter - Main JavaScript Application
 *
 * A modern web application for converting URLs from supported platforms
 * to the Xget-accelerated URLs. Dynamically loads platform configuration
 * from the Xget repository.
 *
 * @author Xi Xu
 * @version 1.0.0
 * @since 2025
 * ============================================================================
 */

"use strict";

// ============================================================================
// Global State Management
// ============================================================================

/**
 * Platform configuration data loaded from GitHub
 * @type {Object.<string, string>}
 */
let platformsData = {};

/**
 * Loading state indicator
 * @type {boolean}
 */
let isLoading = false;

/** @type {ReturnType<typeof window.XgetI18n>|undefined} Shared i18n utilities */
const i18n = window.XgetI18n;

/**
 * Platform status state for localized re-rendering
 * @type {{type: "idle"} | {type: "detected", key: string} | {type: "error", messageKey: string, params?: Record<string, string|number>}}
 */
let platformStatusState = { type: "idle" };

/**
 * Error message state for localized re-rendering
 * @type {{messageKey: string, params?: Record<string, string|number>} | null}
 */
let errorState = null;

/**
 * Candidate platform configuration files in priority order.
 *
 * The original page read these from the upstream repository through jsDelivr.
 * That repository is gone, so the list is served by this deployment, which
 * renders the same `PLATFORMS` object literal from its own catalog.
 * @type {string[]}
 */
const PLATFORM_CONFIG_URLS = ["/platforms.js"];

// ============================================================================
// DOM Element References
// ============================================================================

/** @type {HTMLInputElement} URL of an Xget instance input field */
const xgetDomainInput = document.getElementById("xget-domain");

/** @type {HTMLInputElement} Original URL input field */
const originalUrlInput = document.getElementById("original-url");

/** @type {HTMLElement} Result section container */
const resultSection = document.getElementById("result-section");

/** @type {HTMLInputElement} Converted URL output field */
const convertedUrlInput = document.getElementById("converted-url");

/** @type {HTMLButtonElement} Copy to clipboard button */
const copyBtn = document.getElementById("copy-btn");

/** @type {HTMLElement} Error message container */
const errorMessage = document.getElementById("error-message");

/** @type {HTMLElement} Platform name display */
const platformName = document.getElementById("platform-name");

/** @type {HTMLElement} Platform detection indicator dot */
const platformDot = document.querySelector(".platform-dot");

/** @type {HTMLElement} Main converter section */
const converterSection = document.querySelector(".converter-section");

// ============================================================================
// Internationalization Helpers
// ============================================================================

/**
 * Resolve a localized string with English fallback when i18n is unavailable
 * @param {string} key - Translation key
 * @param {Record<string, string|number>} [params] - Interpolation parameters
 * @returns {string} Localized message
 */
function t(key, params = {}) {
  return i18n ? i18n.t(key, params) : key;
}

/**
 * Create a localized error payload
 * @param {string} key - Translation key
 * @param {Record<string, string|number>} [params] - Interpolation parameters
 * @returns {Error} Localized error object
 */
function createLocalizedError(key, params = {}) {
  if (i18n) {
    return i18n.createLocalizedError(key, params);
  }

  const error = new Error(key);
  error.translationKey = key;
  error.translationParams = params;
  return error;
}

/**
 * Normalize unknown errors into a human-readable message.
 * @param {unknown} error - Error-like value to format
 * @returns {string} Readable error message
 */
function getErrorMessage(error) {
  if (error && typeof error === "object" && "translationKey" in error) {
    return t(error.translationKey, error.translationParams || {});
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

// ============================================================================
// Application Initialization
// ============================================================================

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", async () => {
  if (i18n) {
    i18n.init({ page: "home" });
    i18n.onChange(() => {
      renderPlatformStatus();
      renderErrorState();
      resetCopyButton();
    });
  }

  resetPlatformStatus();
  resetCopyButton();
  await loadPlatforms();
  loadSavedDomain();
  setupEventListeners();
  updateCopyrightYear();

  // Check if the user has chosen not to show the modal again
  const dontShowAgain = localStorage.getItem("dontShowSponsorModal");

  if (!dontShowAgain) {
    // Show the modal after a short delay
    setTimeout(showSponsorModal, 1000);
  }

  // Set up event listeners for modal elements
  setupModalEventListeners();
});

// ============================================================================
// Event Listeners Setup
// ============================================================================

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
  xgetDomainInput.addEventListener("input", handleDomainInput);
  xgetDomainInput.addEventListener("blur", saveDomain);
  originalUrlInput.addEventListener("input", handleUrlInput);
  copyBtn.addEventListener("click", copyToClipboard);

  // Handle paste events with slight delay for processing
  originalUrlInput.addEventListener("paste", (e) => {
    setTimeout(() => handleUrlInput(), 10);
  });
}

// ============================================================================
// Domain Management
// ============================================================================

/**
 * Load saved URL of an Xget instance from localStorage
 */
function loadSavedDomain() {
  const savedDomain = localStorage.getItem("xgetDomain");
  if (savedDomain) {
    xgetDomainInput.value = savedDomain;
  }
}

/**
 * Save URL of an Xget instance to localStorage
 */
function saveDomain() {
  const domain = xgetDomainInput.value.trim();
  if (domain) {
    localStorage.setItem("xgetDomain", domain);
  }
}

/**
 * Handle domain input changes
 * Re-convert URL if one is already entered
 */
function handleDomainInput() {
  const domain = xgetDomainInput.value.trim();

  // Validate domain format
  if (domain && !isValidUrl(domain)) {
    xgetDomainInput.classList.add("error");
    return;
  } else {
    xgetDomainInput.classList.remove("error");
  }

  // If there's already a URL converted, re-convert it with the new domain
  const currentUrl = originalUrlInput.value.trim();
  if (currentUrl && !resultSection.classList.contains("hidden")) {
    handleUrlInput();
  }
}

/**
 * Get the current URL of an Xget instance
 * Returns the user-specified domain or falls back to default
 * @returns {string} URL of an Xget instance URL
 */
function getXgetDomain() {
  const domain = xgetDomainInput.value.trim();

  // Validate the domain
  if (domain && isValidUrl(domain)) {
    // Remove trailing slash if present
    return domain.replace(/\/$/, "");
  }

  // Fallback to default domain
  return "https://xget.xi-xu.me";
}

// ============================================================================
// Platform Data Management
// ============================================================================

/**
 * Load platform configuration from the Xget repository on Gitee
 * @async
 * @function loadPlatforms
 * @returns {Promise<void>}
 */
async function loadPlatforms() {
  try {
    showLoading(t("shared.loading.platforms"));

    const loadFailures = [];

    for (const configUrl of PLATFORM_CONFIG_URLS) {
      try {
        const response = await fetch(configUrl);

        if (!response.ok) {
          throw createLocalizedError("shared.errors.platformFetchFailed", {
            status: response.status,
            statusText: response.statusText,
          });
        }

        const fileContent = await response.text();

        // Parse the platform data from the JavaScript file
        platformsData = parsePlatformsData(fileContent);

        if (Object.keys(platformsData).length === 0) {
          throw createLocalizedError("shared.errors.noPlatformDataFound");
        }

        console.log(
          `Loaded ${Object.keys(platformsData).length} platform configurations from ${configUrl}`
        );
        hideError();
        return;
      } catch (error) {
        console.warn(`Failed to load platform config from ${configUrl}:`, error);
        loadFailures.push(getErrorMessage(error));
      }
    }

    throw createLocalizedError("shared.errors.platformConfigLoadFailed", {
      error: loadFailures.join("; "),
    });
  } catch (error) {
    console.error("Failed to load platforms:", error);

    if (error.translationKey) {
      showError(error.translationKey, error.translationParams);
      return;
    }

    showError("shared.errors.platformConfigLoadFailed", {
      error: error.message,
    });
  } finally {
    isLoading = false;
  }
}

/**
 * Parse platform data from JavaScript file content
 * Extracts the PLATFORMS or PLATFORM_CATALOG object using improved parsing logic
 * @param {string} fileContent - Raw JavaScript file content
 * @returns {Object.<string, string>} Parsed platform mappings
 * @throws {Error} When platform data cannot be parsed
 */
function parsePlatformsData(fileContent) {
  try {
    // Support both the legacy inline PLATFORMS export and the newer
    // PLATFORM_CATALOG source file used by upstream.
    const platformsMatch = fileContent.match(
      /(?:export\s+)?const\s+(?:PLATFORMS|PLATFORM_CATALOG)\s*=\s*{([\s\S]*?)};/
    );

    if (!platformsMatch) {
      throw createLocalizedError("shared.errors.platformsObjectMissing");
    }

    // Extract the content between the braces
    const platformsContent = platformsMatch[1];

    // Parse the object content more carefully
    const platforms = {};

    // Split by lines and process each line
    const lines = platformsContent.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines, comments, and other non-key-value content
      if (
        !trimmed ||
        trimmed.startsWith("//") ||
        trimmed.startsWith("/*") ||
        trimmed.startsWith("*") ||
        trimmed === "{" ||
        trimmed === "}" ||
        trimmed === "," ||
        !trimmed.includes(":")
      ) {
        continue;
      }

      // Match various key-value patterns
      // Handles: 'key': 'value', "key": "value", key: 'value', key: "value"
      const keyValueMatch = trimmed.match(
        /^['"]?([^'":\s,]+)['"]?\s*:\s*['"]([^'"]+)['"][\s,]*$/
      );

      if (keyValueMatch) {
        const [, key, value] = keyValueMatch;
        // Clean up the key and value
        const cleanKey = key.trim();
        const cleanValue = value.trim();

        // Only add valid HTTP/HTTPS URLs
        if (cleanValue.startsWith("http")) {
          platforms[cleanKey] = cleanValue;
        }
      }
    }

    // Validate that we found some platforms
    if (Object.keys(platforms).length === 0) {
      throw createLocalizedError("shared.errors.noParsedPlatforms");
    }

    console.log(
      `Successfully parsed ${
        Object.keys(platforms).length
      } platform configurations`
    );
    return platforms;
  } catch (error) {
    console.error("Error parsing platform data:", error);

    if (error.translationKey) {
      throw error;
    }

    throw createLocalizedError("shared.errors.platformConfigParseFailed", {
      error: error.message,
    });
  }
}

/**
 * Get display name for platform (simplified version)
 * Currently returns the platform key as the display name
 * @param {string} key - Platform key identifier
 * @param {string} url - Platform base URL
 * @returns {string} Display name for the platform
 */
function getPlatformDisplayName(key, url) {
  return key;
}

// ============================================================================
// URL Processing and Validation
// ============================================================================

/**
 * Handle URL input changes with real-time validation and conversion
 * Validates URL format, detects platform, and performs conversion
 * @function handleUrlInput
 */
function handleUrlInput() {
  const url = originalUrlInput.value.trim();

  if (!url) {
    resetPlatformStatus();
    hideError();
    hideResult();
    return;
  }

  if (!isValidUrl(url)) {
    showPlatformError("shared.status.invalidUrl");
    hideResult();
    return;
  }

  // Detect platform from URL
  const detectedPlatform = detectPlatform(url);

  if (detectedPlatform) {
    showPlatformDetected(detectedPlatform.key, detectedPlatform.name);
    hideError();
    // Automatically convert the URL in real-time
    performUrlConversion(url, detectedPlatform);
  } else {
    showPlatformError("shared.status.unsupportedPlatform");
    hideResult();
  }
}

/**
 * Validate URL format using the URL constructor
 * Only accepts HTTP and HTTPS protocols
 * @param {string} string - URL string to validate
 * @returns {boolean} True if valid URL format with http/https protocol
 */
function isValidUrl(string) {
  try {
    const url = new URL(string);
    // Only accept http: and https: protocols
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Detect platform from URL using priority-based matching
 * Priority order: exact hostname → path-based routing → subdomain → base domain
 * @param {string} url - URL to analyze
 * @returns {Object|null} Platform object with key, name, and baseUrl or null if not found
 */
function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const pathname = urlObj.pathname;

    // Priority 1: Exact hostname match (handles subdomain conflicts automatically)
    for (const [key, baseUrl] of Object.entries(platformsData)) {
      try {
        const baseUrlObj = new URL(baseUrl);
        if (hostname === baseUrlObj.hostname) {
          return {
            key,
            name: getPlatformDisplayName(key, baseUrl),
            baseUrl,
          };
        }
      } catch (e) {
        // Skip invalid base URLs
        continue;
      }
    }

    // Priority 2: Special path-based routing for platforms sharing the same hostname

    // ghcr.io - route based on pathname
    if (hostname === "ghcr.io") {
      // Check if it's a homebrew bottles path (contains /v2/homebrew/)
      if (pathname.includes("/v2/homebrew/")) {
        return {
          key: "homebrew-bottles",
          name: getPlatformDisplayName("homebrew-bottles", "https://ghcr.io"),
          baseUrl: "https://ghcr.io",
        };
      } else {
        // Default to cr-ghcr for standard container registry usage
        return {
          key: "cr-ghcr",
          name: getPlatformDisplayName("cr-ghcr", "https://ghcr.io"),
          baseUrl: "https://ghcr.io",
        };
      }
    }

    // github.com - route based on pathname
    if (hostname === "github.com") {
      // Check if it's a Homebrew organization path (starts with /Homebrew or /homebrew/, case-insensitive)
      if (pathname.toLowerCase().startsWith("/homebrew/")) {
        return {
          key: "homebrew",
          name: getPlatformDisplayName(
            "homebrew",
            "https://github.com/Homebrew"
          ),
          baseUrl: "https://github.com/Homebrew",
        };
      } else {
        // Default to gh for standard GitHub usage
        return {
          key: "gh",
          name: getPlatformDisplayName("gh", "https://github.com"),
          baseUrl: "https://github.com",
        };
      }
    }

    // Priority 3: Subdomain match (e.g., registry.npmjs.org matches npmjs.org)
    for (const [key, baseUrl] of Object.entries(platformsData)) {
      try {
        const baseUrlObj = new URL(baseUrl);
        if (hostname.endsWith("." + baseUrlObj.hostname)) {
          return {
            key,
            name: getPlatformDisplayName(key, baseUrl),
            baseUrl,
          };
        }
      } catch (e) {
        continue;
      }
    }

    // Priority 4: Base domain match (e.g., different subdomains on same base domain)
    for (const [key, baseUrl] of Object.entries(platformsData)) {
      try {
        const baseUrlObj = new URL(baseUrl);
        const baseDomain = baseUrlObj.hostname.split(".").slice(-2).join(".");
        const urlDomain = hostname.split(".").slice(-2).join(".");

        if (baseDomain === urlDomain && baseDomain.includes(".")) {
          return {
            key,
            name: getPlatformDisplayName(key, baseUrl),
            baseUrl,
          };
        }
      } catch (e) {
        continue;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// ============================================================================
// URL Conversion Functions
// ============================================================================

/**
 * Convert URL to Xget format with real-time processing
 * Extracts the path from the original URL and constructs the Xget URL
 * Special handling for GitHub blob URLs: automatically converts them to raw URLs
 * Example: /owner/repo/blob/branch/file → /owner/repo/raw/refs/heads/branch/file
 * @param {string} url - Original URL to convert
 * @param {Object} detectedPlatform - Platform object with key, name, and baseUrl
 */
function performUrlConversion(url, detectedPlatform) {
  try {
    const urlObj = new URL(url);

    // Extract the path after the base URL
    let path = urlObj.pathname;

    // For some platforms, we might need to include search params
    if (urlObj.search) {
      path += urlObj.search;
    }

    // Handle special cases where the path might need adjustment
    path = adjustPathForPlatform(path, detectedPlatform.key, urlObj);

    // Convert platform key: replace "-" with "/" in the platform prefix
    const platformPrefix = detectedPlatform.key.replace(/-/g, "/");

    // Get the configured URL of an Xget instance
    const xgetDomain = getXgetDomain();

    // Construct the Xget URL
    const xgetUrl = `${xgetDomain}/${platformPrefix}${path}`;

    // Display the result
    convertedUrlInput.value = xgetUrl;
    showResult();
    hideError();

    // Reset copy button state
    resetCopyButton();
  } catch (error) {
    console.error("Conversion error:", error);
    showError("shared.errors.urlConversionFailed", {
      error: error.message,
    });
  }
}

/**
 * Adjust path for specific platforms if needed
 * Most platforms can use the path as-is, but special handling can be added
 * @param {string} path - URL path to adjust
 * @param {string} platformKey - Platform key identifier
 * @param {URL} urlObj - Original URL object
 * @returns {string} Adjusted path
 */
function adjustPathForPlatform(path, platformKey, urlObj) {
  // Special handling for GitHub platform - convert blob URLs to raw URLs
  if (platformKey === "gh") {
    // Check if this is a blob URL pattern: /owner/repo/blob/branch/file
    const blobMatch = path.match(/^\/([^\/]+)\/([^\/]+)\/blob\/(.+)$/);
    if (blobMatch) {
      const [, owner, repo, branchAndFile] = blobMatch;

      // Split branch and file path
      // We need to be careful here because branch names can contain slashes
      // For simplicity, we'll assume the first segment is the branch name
      // This works for most common cases like "main", "master", "dev", etc.
      const parts = branchAndFile.split("/");

      if (parts.length >= 2) {
        const branch = parts[0];
        const filePath = parts.slice(1).join("/");

        // Convert to raw URL format: /owner/repo/raw/refs/heads/branch/file
        path = `/${owner}/${repo}/raw/refs/heads/${branch}/${filePath}`;
      } else if (parts.length === 1) {
        // Edge case: only branch name, no file path
        const branch = parts[0];
        path = `/${owner}/${repo}/raw/refs/heads/${branch}/`;
      }
    }
  }

  // Special handling for homebrew platform
  if (platformKey === "homebrew") {
    // Remove /Homebrew or /homebrew from the path (case-insensitive)
    path = path.replace(/^\/[Hh]omebrew/i, "");

    // If path becomes empty, set it to root
    if (!path || path === "/") {
      path = "";
    }
  }

  // Special handling for homebrew-api platform
  if (platformKey === "homebrew-api") {
    // Remove /api from the beginning of the path to avoid duplication
    path = path.replace(/^\/api/i, "");

    // If path becomes empty, set it to root
    if (!path || path === "/") {
      path = "";
    }
  }

  // Ensure path starts with / (except for homebrew and homebrew-api when it should be empty)
  if (!path.startsWith("/") && path !== "") {
    path = "/" + path;
  }

  return path;
}

// ============================================================================
// Clipboard Operations
// ============================================================================

/**
 * Copy converted URL to clipboard with fallback support
 * Uses modern Clipboard API with fallback to document.execCommand
 * @async
 * @function copyToClipboard
 */
async function copyToClipboard() {
  const textToCopy = convertedUrlInput.value;

  if (!textToCopy) {
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    showCopySuccess();
  } catch (error) {
    // Fallback for older browsers
    try {
      convertedUrlInput.select();
      document.execCommand("copy");
      showCopySuccess();
    } catch (fallbackError) {
      showError("shared.errors.copyFailed");
    }
  }
}

// ============================================================================
// UI Helper Functions
// ============================================================================

/**
 * Show loading state indicator
 * @param {string} message - Loading message to display
 */
function showLoading(message) {
  isLoading = true;
  // Loading message is handled by platform status indicators
}

/**
 * Reset platform status to initial state
 */
function resetPlatformStatus() {
  platformStatusState = { type: "idle" };
  renderPlatformStatus();
}

/**
 * Show platform detection success state
 * @param {string} key - Platform key identifier
 * @param {string} name - Platform display name
 */
function showPlatformDetected(key, name) {
  platformStatusState = { type: "detected", key };
  renderPlatformStatus();
}

/**
 * Show platform detection error state
 * @param {string} messageKey - Translation key for the error message
 * @param {Record<string, string|number>} [params] - Translation parameters
 */
function showPlatformError(messageKey, params = {}) {
  platformStatusState = { type: "error", messageKey, params };
  renderPlatformStatus();
}

/**
 * Re-render platform detection state in the active locale
 */
function renderPlatformStatus() {
  if (platformStatusState.type === "detected") {
    platformName.textContent = t("shared.status.detected", {
      platform: platformStatusState.key,
    });
    platformDot.className = "platform-dot detected";
    return;
  }

  if (platformStatusState.type === "error") {
    platformName.textContent = t(
      platformStatusState.messageKey,
      platformStatusState.params
    );
    platformDot.className = "platform-dot error";
    return;
  }

  platformName.textContent = t("shared.status.idle");
  platformDot.className = "platform-dot";
}

/**
 * Show the conversion result section
 */
function showResult() {
  resultSection.classList.remove("hidden");
  converterSection.classList.add("has-content");
}

/**
 * Hide the conversion result section
 */
function hideResult() {
  resultSection.classList.add("hidden");
  // Check if there are other content elements (like error messages)
  if (errorMessage.classList.contains("hidden")) {
    converterSection.classList.remove("has-content");
  }
}

/**
 * Show error message
 * @param {string} messageKey - Translation key for the error message
 * @param {Record<string, string|number>} [params] - Translation parameters
 */
function showError(messageKey, params = {}) {
  errorState = { messageKey, params };
  renderErrorState();
}

/**
 * Hide error message
 */
function hideError() {
  errorState = null;
  renderErrorState();
}

/**
 * Re-render the current error message in the active locale
 */
function renderErrorState() {
  if (!errorState) {
    errorMessage.classList.add("hidden");
    if (resultSection.classList.contains("hidden")) {
      converterSection.classList.remove("has-content");
    }
    return;
  }

  errorMessage.textContent = t(errorState.messageKey, errorState.params);
  errorMessage.classList.remove("hidden");
  converterSection.classList.add("has-content");
}

/**
 * Show copy success feedback with temporary state change
 */
function showCopySuccess() {
  copyBtn.classList.add("copied");
  copyBtn.querySelector(".copy-text").textContent = t("shared.actions.copied");
  copyBtn.querySelector(".copy-icon").textContent = "✓";

  setTimeout(() => {
    resetCopyButton();
  }, 2000);
}

/**
 * Reset copy button to original state
 */
function resetCopyButton() {
  copyBtn.classList.remove("copied");
  copyBtn.querySelector(".copy-text").textContent = t("shared.actions.copy");
  copyBtn.querySelector(".copy-icon").textContent = "📋";
  copyBtn.title = t("shared.actions.copyToClipboard");
  copyBtn.setAttribute("aria-label", t("shared.actions.copyToClipboard"));
}

// ============================================================================
// Sponsor Popup Modal
// ============================================================================

/**
 * Set up event listeners for the sponsor modal
 */
function setupModalEventListeners() {
  const modal = document.getElementById("sponsor-modal");
  const closeModalButton = document.getElementById("close-modal");
  const dontShowAgainCheckbox = document.getElementById("dont-show-again");

  // Close modal when clicking the X button
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      closeSponsorModal();
    });
  }

  // Close modal when clicking outside the modal content
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeSponsorModal();
      }
    });
  }

  // Handle "Don't show again" checkbox
  if (dontShowAgainCheckbox) {
    dontShowAgainCheckbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        localStorage.setItem("dontShowSponsorModal", "true");
      } else {
        localStorage.removeItem("dontShowSponsorModal");
      }
    });
  }
}

/**
 * Show the sponsor modal
 */
function showSponsorModal() {
  const modal = document.getElementById("sponsor-modal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

/**
 * Close the sponsor modal
 */
function closeSponsorModal() {
  const modal = document.getElementById("sponsor-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// ============================================================================
// Copyright Management
// ============================================================================

/**
 * Update the copyright year to the current year
 */
function updateCopyrightYear() {
  const yearElement = document.getElementById("copyright-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ============================================================================
// Global Error Handling
// ============================================================================

/**
 * Handle unhandled promise rejections globally
 * Provides fallback error handling for async operations
 */
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  if (!isLoading) {
    showError("shared.errors.unexpected");
  }
});
