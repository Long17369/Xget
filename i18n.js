/**
 * ============================================================================
 * Xget URL Converter - Internationalization Utilities
 * ============================================================================
 */

"use strict";

window.XgetI18n = (() => {
  const DEFAULT_LOCALE = "en";
  const STORAGE_KEY = "preferredLanguage";
  const PAGE_LOCALE_PATHS = {
    home: {
      en: "/",
      "zh-Hans": "/zh-hans.html",
      "zh-Hant": "/zh-hant.html",
    },
    notFound: {
      en: "/404.html",
      "zh-Hans": "/404.html?lang=zh-Hans",
      "zh-Hant": "/404.html?lang=zh-Hant",
    },
  };

  const SUPPORTED_LOCALES = {
    en: {
      label: "English",
      htmlLang: "en",
      metaLanguage: "en",
      ogLocale: "en_US",
    },
    "zh-Hans": {
      label: "汉语（简体）",
      htmlLang: "zh-Hans",
      metaLanguage: "zh-CN",
      ogLocale: "zh_CN",
    },
    "zh-Hant": {
      label: "漢語（繁體）",
      htmlLang: "zh-Hant",
      metaLanguage: "zh-TW",
      ogLocale: "zh_TW",
    },
  };

  const TRANSLATIONS = {
    en: {
      shared: {
        appName: "Xget URL Converter",
        subtitle:
          "Convert URLs from supported platforms to Xget-accelerated URLs",
        languageLabel: "Language",
        languages: {
          en: "English",
          "zh-Hans": "汉语（简体）",
          "zh-Hant": "漢語（繁體）",
        },
        modal: {
          title: "Support Us",
          description:
            "If you find this tool helpful, consider supporting us:",
          sponsor: "Sponsor",
          partner: "Partner With Us",
          dontShowAgain: "Don't show again",
        },
        actions: {
          copy: "Copy",
          copied: "Copied!",
          copyToClipboard: "Copy to clipboard",
        },
        loading: {
          platforms: "Loading platform configurations...",
        },
        status: {
          idle: "Platform will be auto-detected",
          detected: "Detected: {platform}",
          invalidUrl: "Invalid URL format",
          unsupportedPlatform: "Platform not supported or unrecognized",
        },
        footer: {
          poweredByPrefix: "Supported by",
          poweredBySuffix: "",
          sponsor: "Sponsor",
          partner: "Partner With Us",
          platformConfig:
            "Platform configurations dynamically loaded from the Xget repository",
          rightsReserved: "All rights reserved.",
        },
        errors: {
          platformConfigLoadFailed:
            "Failed to load platform configurations: {error}",
          platformFetchFailed:
            "Failed to fetch platform data: {status} {statusText}",
          noPlatformDataFound: "No platform data found in configuration file",
          platformsObjectMissing:
            "Unable to find PLATFORMS object in configuration file",
          noParsedPlatforms: "Failed to parse any platform data",
          platformConfigParseFailed:
            "Failed to parse platform configuration: {error}",
          urlConversionFailed: "URL conversion failed: {error}",
          copyFailed: "Failed to copy to clipboard. Please copy manually.",
          unexpected: "An unexpected error occurred. Please try again.",
        },
        breadcrumbs: {
          home: "Home",
        },
      },
      home: {
        form: {
          xgetDomainLabel: "URL of an Xget Instance",
          originalUrlLabel: "Original URL",
          originalUrlPlaceholder:
            "Paste a URL from any supported platform",
          convertedUrlLabel: "Converted URL",
          convertedUrlPlaceholder: "Converted URL will appear here",
        },
      },
      notFound: {
        title: "Page Not Found",
        description:
          "Sorry, the page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage to continue using our service.",
        primaryAction: "Back to Home",
        secondaryAction: "Go Back",
        breadcrumbCurrent: "404 Error",
      },
      pages: {
        home: {
          meta: {
            title:
              "Xget URL Converter - Fast URL Conversion for GitHub, npm, Docker & More",
            description:
              "Convert URLs to Xget-accelerated format instantly. Support for GitHub, npm, Docker Hub, Homebrew, and more developer platforms. Free, secure, client-side URL conversion tool with no registration required.",
            keywords:
              "Xget, URL converter, GitHub download accelerator, npm mirror, Docker Hub mirror, Homebrew bottles, URL conversion tool, download acceleration, CDN accelerator, developer tools, GitHub raw files, container registry, package manager, open source tools, free URL converter",
            imageAlt: "Xget URL Converter Logo",
            featureList: [
              "GitHub URL conversion",
              "npm URL conversion",
              "Docker Hub URL conversion",
              "Homebrew URL conversion",
              "Custom URL of an Xget instance support",
              "Client-side processing",
              "No registration required",
              "Free to use",
            ],
          },
        },
        notFound: {
          meta: {
            title: "404 - Page Not Found | Xget URL Converter",
            description:
              "The page you're looking for doesn't exist. Return to Xget URL Converter to convert URLs for GitHub, npm, Docker Hub, Homebrew and more developer platforms.",
            keywords:
              "404, page not found, Xget, URL converter, error page, GitHub URL converter, npm mirror, Docker Hub accelerator",
            imageAlt: "Xget URL Converter Logo",
          },
        },
      },
    },
    "zh-Hans": {
      shared: {
        appName: "Xget URL 转换器",
        subtitle: "将受支持平台的 URL 转换为 Xget 加速 URL",
        languageLabel: "语言",
        languages: {
          en: "English",
          "zh-Hans": "汉语（简体）",
          "zh-Hant": "漢語（繁體）",
        },
        modal: {
          title: "支持我们",
          description: "如果这个工具对你有帮助，欢迎支持我们：",
          sponsor: "赞助",
          partner: "与我们合作",
          dontShowAgain: "不再显示",
        },
        actions: {
          copy: "复制",
          copied: "已复制",
          copyToClipboard: "复制到剪贴板",
        },
        loading: {
          platforms: "正在加载平台配置...",
        },
        status: {
          idle: "将自动识别平台",
          detected: "已识别：{platform}",
          invalidUrl: "URL 格式无效",
          unsupportedPlatform: "平台暂不支持或无法识别",
        },
        footer: {
          poweredByPrefix: "由",
          poweredBySuffix: "提供支持",
          sponsor: "赞助",
          partner: "与我们合作",
          platformConfig: "平台配置会从 Xget 存储库动态加载",
          rightsReserved: "保留所有权利。",
        },
        errors: {
          platformConfigLoadFailed: "加载平台配置失败：{error}",
          platformFetchFailed: "获取平台数据失败：{status} {statusText}",
          noPlatformDataFound: "配置文件中未找到平台数据",
          platformsObjectMissing: "无法在配置文件中找到 PLATFORMS 对象",
          noParsedPlatforms: "未能解析出任何平台数据",
          platformConfigParseFailed: "解析平台配置失败：{error}",
          urlConversionFailed: "URL 转换失败：{error}",
          copyFailed: "复制到剪贴板失败，请手动复制。",
          unexpected: "发生意外错误，请重试。",
        },
        breadcrumbs: {
          home: "首页",
        },
      },
      home: {
        form: {
          xgetDomainLabel: "Xget 实例 URL",
          originalUrlLabel: "原始 URL",
          originalUrlPlaceholder: "粘贴来自任意受支持平台的 URL",
          convertedUrlLabel: "转换后的 URL",
          convertedUrlPlaceholder: "转换后的 URL 将显示在这里",
        },
      },
      notFound: {
        title: "页面未找到",
        description:
          "抱歉，你访问的页面不存在或已被移动。请检查 URL，或返回首页继续使用本服务。",
        primaryAction: "返回首页",
        secondaryAction: "返回上一页",
        breadcrumbCurrent: "404 错误",
      },
      pages: {
        home: {
          meta: {
            title: "Xget URL 转换器 - 面向 GitHub、npm、Docker 等的高速 URL 转换",
            description:
              "立即将 URL 转换为 Xget 加速格式。支持 GitHub、npm、Docker Hub、Homebrew 等开发者平台。免费、安全、纯客户端处理，无需注册。",
            keywords:
              "Xget, URL 转换器, GitHub 下载加速, npm 镜像, Docker Hub 镜像, Homebrew bottles, URL 转换工具, 下载加速, CDN 加速, 开发者工具, GitHub 原始文件, 容器镜像存储库, 包管理器, 开源工具, 免费 URL 转换器",
            imageAlt: "Xget URL 转换器标志",
            featureList: [
              "GitHub URL 转换",
              "npm URL 转换",
              "Docker Hub URL 转换",
              "Homebrew URL 转换",
              "支持自定义 Xget 实例 URL",
              "纯客户端处理",
              "无需注册",
              "免费使用",
            ],
          },
        },
        notFound: {
          meta: {
            title: "404 - 页面未找到 | Xget URL 转换器",
            description:
              "你访问的页面不存在。返回 Xget URL 转换器，继续为 GitHub、npm、Docker Hub、Homebrew 等平台转换 URL。",
            keywords:
              "404, 页面未找到, Xget, URL 转换器, 错误页, GitHub URL 转换器, npm 镜像, Docker Hub 加速",
            imageAlt: "Xget URL 转换器标志",
          },
        },
      },
    },
    "zh-Hant": {
      shared: {
        appName: "Xget URL 轉換器",
        subtitle: "將受支援平台的 URL 轉換為 Xget 加速 URL",
        languageLabel: "語言",
        languages: {
          en: "English",
          "zh-Hans": "汉语（简体）",
          "zh-Hant": "漢語（繁體）",
        },
        modal: {
          title: "支持我們",
          description: "如果這個工具對你有幫助，歡迎支持我們：",
          sponsor: "贊助",
          partner: "與我們合作",
          dontShowAgain: "不再顯示",
        },
        actions: {
          copy: "複製",
          copied: "已複製",
          copyToClipboard: "複製到剪貼簿",
        },
        loading: {
          platforms: "正在載入平台設定...",
        },
        status: {
          idle: "將自動識別平台",
          detected: "已識別：{platform}",
          invalidUrl: "URL 格式無效",
          unsupportedPlatform: "平台暫不支援或無法識別",
        },
        footer: {
          poweredByPrefix: "由",
          poweredBySuffix: "提供支援",
          sponsor: "贊助",
          partner: "與我們合作",
          platformConfig: "平台設定會從 Xget 儲存庫動態載入",
          rightsReserved: "保留所有權利。",
        },
        errors: {
          platformConfigLoadFailed: "載入平台設定失敗：{error}",
          platformFetchFailed: "取得平台資料失敗：{status} {statusText}",
          noPlatformDataFound: "設定檔中找不到平台資料",
          platformsObjectMissing: "無法在設定檔中找到 PLATFORMS 物件",
          noParsedPlatforms: "未能解析出任何平台資料",
          platformConfigParseFailed: "解析平台設定失敗：{error}",
          urlConversionFailed: "URL 轉換失敗：{error}",
          copyFailed: "複製到剪貼簿失敗，請手動複製。",
          unexpected: "發生未預期錯誤，請再試一次。",
        },
        breadcrumbs: {
          home: "首頁",
        },
      },
      home: {
        form: {
          xgetDomainLabel: "Xget 實例 URL",
          originalUrlLabel: "原始 URL",
          originalUrlPlaceholder: "貼上來自任意受支援平台的 URL",
          convertedUrlLabel: "轉換後的 URL",
          convertedUrlPlaceholder: "轉換後的 URL 將顯示在這裡",
        },
      },
      notFound: {
        title: "頁面未找到",
        description:
          "抱歉，你造訪的頁面不存在或已被移動。請檢查 URL，或返回首頁繼續使用本服務。",
        primaryAction: "返回首頁",
        secondaryAction: "返回上一頁",
        breadcrumbCurrent: "404 錯誤",
      },
      pages: {
        home: {
          meta: {
            title: "Xget URL 轉換器 - 面向 GitHub、npm、Docker 等的高速 URL 轉換",
            description:
              "立即將 URL 轉換為 Xget 加速格式。支援 GitHub、npm、Docker Hub、Homebrew 等開發者平台。免費、安全、純客戶端處理，無需註冊。",
            keywords:
              "Xget, URL 轉換器, GitHub 下載加速, npm 鏡像, Docker Hub 鏡像, Homebrew bottles, URL 轉換工具, 下載加速, CDN 加速, 開發者工具, GitHub 原始檔案, 容器映像倉庫, 套件管理器, 開源工具, 免費 URL 轉換器",
            imageAlt: "Xget URL 轉換器標誌",
            featureList: [
              "GitHub URL 轉換",
              "npm URL 轉換",
              "Docker Hub URL 轉換",
              "Homebrew URL 轉換",
              "支援自訂 Xget 實例 URL",
              "純客戶端處理",
              "無需註冊",
              "免費使用",
            ],
          },
        },
        notFound: {
          meta: {
            title: "404 - 頁面未找到 | Xget URL 轉換器",
            description:
              "你造訪的頁面不存在。返回 Xget URL 轉換器，繼續為 GitHub、npm、Docker Hub、Homebrew 等平台轉換 URL。",
            keywords:
              "404, 頁面未找到, Xget, URL 轉換器, 錯誤頁, GitHub URL 轉換器, npm 鏡像, Docker Hub 加速",
            imageAlt: "Xget URL 轉換器標誌",
          },
        },
      },
    },
  };

  let currentLocale = DEFAULT_LOCALE;
  const changeHandlers = new Set();

  function normalizeLocale(locale) {
    if (!locale) {
      return DEFAULT_LOCALE;
    }

    const normalized = locale.toLowerCase();

    if (normalized === "en" || normalized.startsWith("en-")) {
      return "en";
    }

    if (
      normalized === "zh-hans" ||
      normalized.startsWith("zh-cn") ||
      normalized.startsWith("zh-sg")
    ) {
      return "zh-Hans";
    }

    if (
      normalized === "zh-hant" ||
      normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hk") ||
      normalized.startsWith("zh-mo")
    ) {
      return "zh-Hant";
    }

    if (normalized.startsWith("zh")) {
      return "zh-Hans";
    }

    return DEFAULT_LOCALE;
  }

  function resolveKey(source, key) {
    return key.split(".").reduce((value, part) => value?.[part], source);
  }

  function interpolate(template, params = {}) {
    return template.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? "");
  }

  function translate(key, params = {}, locale = currentLocale) {
    const value =
      resolveKey(TRANSLATIONS[locale], key) ??
      resolveKey(TRANSLATIONS[DEFAULT_LOCALE], key) ??
      key;

    return typeof value === "string" ? interpolate(value, params) : value;
  }

  function getCurrentPage() {
    return document.body?.dataset.page || "home";
  }

  function getLocalizedPath(locale, page = getCurrentPage()) {
    return PAGE_LOCALE_PATHS[page]?.[locale] || null;
  }

  function getCurrentUrl() {
    const url = new URL(window.location.href);
    url.hash = "";
    return url.toString();
  }

  function getInitialLocale() {
    const searchParams = new URL(window.location.href).searchParams;
    const urlLocale = searchParams.get("lang");

    if (urlLocale) {
      return normalizeLocale(urlLocale);
    }

    const staticLocale = document.body?.dataset.staticLocale;
    if (staticLocale) {
      return normalizeLocale(staticLocale);
    }

    try {
      const savedLocale = localStorage.getItem(STORAGE_KEY);
      if (savedLocale) {
        return normalizeLocale(savedLocale);
      }
    } catch {
      // Ignore localStorage access failures.
    }

    const browserLocales =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];

    for (const locale of browserLocales) {
      const normalizedLocale = normalizeLocale(locale);
      if (normalizedLocale !== DEFAULT_LOCALE || locale?.startsWith("en")) {
        return normalizedLocale;
      }
    }

    return DEFAULT_LOCALE;
  }

  function setMetaContent(selector, content) {
    const element = document.querySelector(selector);
    if (element && content) {
      element.setAttribute("content", content);
    }
  }

  function setJsonLd(id, json) {
    const script = document.getElementById(id);
    if (script) {
      script.textContent = JSON.stringify(json, null, 2);
    }
  }

  function updateStructuredData(page) {
    const localeData = SUPPORTED_LOCALES[currentLocale];

    if (page === "home") {
      const meta = translate("pages.home.meta");
      setJsonLd("structured-data-webapp", {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: translate("shared.appName"),
        description: meta.description,
        url: getCurrentUrl(),
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Person",
          name: "Xi Xu",
          url: "https://xi-xu.me",
        },
        publisher: {
          "@type": "Person",
          name: "Xi Xu",
          url: "https://xi-xu.me",
        },
        inLanguage: localeData.htmlLang,
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.0",
        featureList: meta.featureList,
        screenshot: "https://xuc.xi-xu.me/Xget.png",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          ratingCount: "1",
        },
      });

      setJsonLd("structured-data-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: translate("shared.breadcrumbs.home"),
            item: getCurrentUrl(),
          },
        ],
      });

      return;
    }

    if (page === "notFound") {
      const meta = translate("pages.notFound.meta");
      setJsonLd("structured-data-404-page", {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: translate("notFound.title"),
        description: meta.description,
        url: getCurrentUrl(),
        inLanguage: localeData.htmlLang,
        isPartOf: {
          "@type": "WebSite",
          name: translate("shared.appName"),
          url: "https://xuc.xi-xu.me",
        },
      });

      setJsonLd("structured-data-404-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: translate("shared.breadcrumbs.home"),
            item: new URL(
              PAGE_LOCALE_PATHS.home[currentLocale],
              window.location.origin
            ).toString(),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: translate("notFound.breadcrumbCurrent"),
          },
        ],
      });
    }
  }

  function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute(
        "placeholder",
        translate(element.dataset.i18nPlaceholder)
      );
    });

    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.setAttribute("title", translate(element.dataset.i18nTitle));
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute(
        "aria-label",
        translate(element.dataset.i18nAriaLabel)
      );
    });
  }

  function applyPageMetadata(page) {
    const meta = translate(`pages.${page}.meta`);
    const localeData = SUPPORTED_LOCALES[currentLocale];
    const pageUrl = getCurrentUrl();

    if (!meta || typeof meta !== "object") {
      return;
    }

    document.title = meta.title;
    document.documentElement.lang = localeData.htmlLang;

    setMetaContent('meta[name="title"]', meta.title);
    setMetaContent('meta[name="description"]', meta.description);
    setMetaContent('meta[name="keywords"]', meta.keywords);
    setMetaContent('meta[name="language"]', localeData.metaLanguage);
    setMetaContent('meta[property="og:url"]', pageUrl);
    setMetaContent('meta[property="og:title"]', meta.title);
    setMetaContent('meta[property="og:description"]', meta.description);
    setMetaContent('meta[property="og:image:alt"]', meta.imageAlt);
    setMetaContent('meta[property="og:site_name"]', translate("shared.appName"));
    setMetaContent('meta[property="og:locale"]', localeData.ogLocale);
    setMetaContent('meta[property="twitter:url"]', pageUrl);
    setMetaContent('meta[property="twitter:title"]', meta.title);
    setMetaContent('meta[property="twitter:description"]', meta.description);
    setMetaContent('meta[property="twitter:image:alt"]', meta.imageAlt);
    setMetaContent(
      'meta[name="apple-mobile-web-app-title"]',
      translate("shared.appName")
    );
    setMetaContent(
      'meta[name="application-name"]',
      translate("shared.appName")
    );

    updateStructuredData(page);
  }

  function syncLanguageControls() {
    const select = document.getElementById("language-select");

    if (select) {
      select.value = currentLocale;

      if (select.dataset.bound !== "true") {
        select.addEventListener("change", (event) => {
          setLocale(event.target.value);
        });
        select.dataset.bound = "true";
      }
    }

    document.querySelectorAll("[data-locale-option]").forEach((button) => {
      const isActive = button.dataset.localeOption === currentLocale;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");

      if (button.dataset.bound === "true") {
        return;
      }

      button.addEventListener("click", () => {
        setLocale(button.dataset.localeOption);
      });
      button.dataset.bound = "true";
    });
  }

  function syncLocaleToUrl() {
    if (getLocalizedPath(currentLocale)) {
      return;
    }

    const url = new URL(window.location.href);

    if (currentLocale === DEFAULT_LOCALE) {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", currentLocale);
    }

    window.history.replaceState({}, "", url);
  }

  function persistLocale(locale = currentLocale) {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Ignore localStorage access failures.
    }
  }

  function notifyChangeHandlers() {
    changeHandlers.forEach((handler) => {
      try {
        handler(currentLocale);
      } catch (error) {
        console.error("XgetI18n change handler failed:", error);
      }
    });
  }

  function init({ page } = {}) {
    currentLocale = getInitialLocale();
    persistLocale();
    syncLocaleToUrl();
    syncLanguageControls();
    applyTranslations(document);
    applyPageMetadata(page || getCurrentPage());
    return currentLocale;
  }

  function setLocale(locale, { page } = {}) {
    const normalizedLocale = normalizeLocale(locale);
    const currentPage = page || getCurrentPage();
    const targetPath = getLocalizedPath(normalizedLocale, currentPage);

    if (targetPath) {
      persistLocale(normalizedLocale);

      const currentPath = `${window.location.pathname}${window.location.search}`;
      if (currentPath !== targetPath) {
        window.location.assign(targetPath);
        return;
      }
    }

    currentLocale = normalizedLocale;
    persistLocale();
    syncLocaleToUrl();
    syncLanguageControls();
    applyTranslations(document);
    applyPageMetadata(currentPage);
    notifyChangeHandlers();
  }

  function onChange(handler) {
    changeHandlers.add(handler);

    return () => {
      changeHandlers.delete(handler);
    };
  }

  function createLocalizedError(key, params = {}) {
    const error = new Error(key);
    error.translationKey = key;
    error.translationParams = params;
    return error;
  }

  return {
    createLocalizedError,
    getLocale: () => currentLocale,
    init,
    normalizeLocale,
    onChange,
    setLocale,
    t: translate,
  };
})();
