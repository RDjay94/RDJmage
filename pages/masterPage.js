// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — masterPage.js
// Runs on EVERY page (site-wide code)
// ─────────────────────────────────────────────────────────────
import wixWindow from "wix-window";
import wixLocation from "wix-location";
import wixSeo from "wix-seo";
import wixStorage from "wix-storage-frontend";
import { SITE_CONFIG, UI_LABELS } from "public/config.js";

// RedTrack click ID key for session storage
const RT_CLICK_ID_KEY = "redtrack_click_id";

// ── State ──────────────────────────────────────────────────
let currentLang = "bn"; // default Bengali

$w.onReady(function () {
    initLanguage();
    captureRedTrackClickId();
    setupNavigation();
    setupLanguageToggle();
    setupSearch();
    setupFooter();
    setupStickyHeader();
    trackPageView();
    trackRedTrackPageView();
});

// ── Language System ─────────────────────────────────────────

function initLanguage() {
    // Check URL path for language prefix
    const path = wixLocation.path;
    if (path.length > 0 && SITE_CONFIG.supportedLangs.includes(path[0])) {
        currentLang = path[0];
    } else {
        // Check stored preference
        const storedLang = wixStorage.local.getItem("bigtaka_lang");
        if (storedLang && SITE_CONFIG.supportedLangs.includes(storedLang)) {
            currentLang = storedLang;
        }
    }

    wixStorage.local.setItem("bigtaka_lang", currentLang);

    // Apply language to all site-wide UI elements
    applyLanguageToUI();
    setDocumentLanguage();
}

function applyLanguageToUI() {
    const labels = UI_LABELS[currentLang];

    // Navigation labels
    if ($w("#navHome")) $w("#navHome").label = labels.home;
    if ($w("#navCategories")) $w("#navCategories").label = labels.categories;

    // Category navigation items
    SITE_CONFIG.categories.forEach((cat) => {
        const navId = `#nav_${cat.id}`;
        if ($w(navId)) {
            $w(navId).label = currentLang === "bn" ? cat.labelBn : cat.labelEn;
        }
    });

    // Search placeholder
    if ($w("#searchInput")) {
        $w("#searchInput").placeholder = labels.searchPlaceholder;
    }

    // Language toggle button
    if ($w("#langToggleBtn")) {
        $w("#langToggleBtn").label = labels.switchLang;
    }

    // Footer
    applyFooterLanguage(labels);
}

function setDocumentLanguage() {
    const suffix = currentLang === "bn"
        ? SITE_CONFIG.seo.titleSuffixBn
        : SITE_CONFIG.seo.titleSuffixEn;

    wixSeo.setLinks([
        { rel: "alternate", href: buildLangUrl("bn"), hreflang: "bn" },
        { rel: "alternate", href: buildLangUrl("en"), hreflang: "en" },
        { rel: "alternate", href: buildLangUrl("bn"), hreflang: "x-default" },
    ]);
}

function buildLangUrl(lang) {
    const path = wixLocation.path.slice();
    if (SITE_CONFIG.supportedLangs.includes(path[0])) {
        path[0] = lang;
    } else {
        path.unshift(lang);
    }
    return `${SITE_CONFIG.baseUrl}/${path.join("/")}`;
}

// ── Language Toggle ─────────────────────────────────────────

function setupLanguageToggle() {
    if ($w("#langToggleBtn")) {
        $w("#langToggleBtn").onClick(() => {
            const newLang = currentLang === "bn" ? "en" : "bn";
            wixStorage.local.setItem("bigtaka_lang", newLang);

            // Redirect to the same page in the other language
            const path = wixLocation.path.slice();
            if (SITE_CONFIG.supportedLangs.includes(path[0])) {
                path[0] = newLang;
            } else {
                path.unshift(newLang);
            }
            wixLocation.to(`/${path.join("/")}`);
        });
    }
}

// ── Navigation ──────────────────────────────────────────────

function setupNavigation() {
    // Home link
    if ($w("#navHome")) {
        $w("#navHome").onClick(() => {
            wixLocation.to(`/${currentLang}`);
        });
    }

    // Category links
    SITE_CONFIG.categories.forEach((cat) => {
        const navId = `#nav_${cat.id}`;
        if ($w(navId)) {
            $w(navId).onClick(() => {
                wixLocation.to(`/${currentLang}/category/${cat.slug}`);
            });
        }
    });

    // Brand logo link
    if ($w("#brandLogo")) {
        $w("#brandLogo").onClick(() => {
            wixLocation.to(`/${currentLang}`);
        });
    }

    // Mobile menu toggle
    if ($w("#mobileMenuBtn")) {
        $w("#mobileMenuBtn").onClick(() => {
            if ($w("#mobileMenu")) {
                const menu = $w("#mobileMenu");
                if (menu.hidden) {
                    menu.show("slide");
                } else {
                    menu.hide("slide");
                }
            }
        });
    }
}

// ── Search ──────────────────────────────────────────────────

function setupSearch() {
    if ($w("#searchInput")) {
        $w("#searchInput").onKeyPress((event) => {
            if (event.key === "Enter") {
                const query = $w("#searchInput").value.trim();
                if (query.length >= 2) {
                    wixLocation.to(`/${currentLang}/search?q=${encodeURIComponent(query)}`);
                }
            }
        });
    }

    if ($w("#searchBtn")) {
        $w("#searchBtn").onClick(() => {
            const query = $w("#searchInput").value.trim();
            if (query.length >= 2) {
                wixLocation.to(`/${currentLang}/search?q=${encodeURIComponent(query)}`);
            }
        });
    }
}

// ── Footer ──────────────────────────────────────────────────

function setupFooter() {
    applyFooterLanguage(UI_LABELS[currentLang]);

    // Social links
    const socialMap = {
        "#socialFacebook": SITE_CONFIG.social.facebook,
        "#socialTelegram": SITE_CONFIG.social.telegram,
        "#socialYoutube": SITE_CONFIG.social.youtube,
    };

    Object.entries(socialMap).forEach(([id, url]) => {
        if ($w(id)) {
            $w(id).onClick(() => wixWindow.openUrl(url, "_blank"));
        }
    });
}

function applyFooterLanguage(labels) {
    if ($w("#footerAboutTitle")) $w("#footerAboutTitle").text = labels.footer.about;
    if ($w("#footerAboutText")) $w("#footerAboutText").text = labels.footer.aboutText;
    if ($w("#footerLinksTitle")) $w("#footerLinksTitle").text = labels.footer.quickLinks;
    if ($w("#footerFollowTitle")) $w("#footerFollowTitle").text = labels.footer.followUs;
    if ($w("#footerCopyright")) $w("#footerCopyright").text = labels.footer.copyright;
}

// ── Sticky Header ───────────────────────────────────────────

function setupStickyHeader() {
    // Wix handles sticky headers via the editor, but we can add
    // scroll-based class toggling for visual effects
    if ($w("#siteHeader")) {
        wixWindow.onScroll((scrollData) => {
            // No direct DOM access, but we can show/hide elements
            // based on scroll position
            if (scrollData.y > 100) {
                if ($w("#compactHeader")) $w("#compactHeader").show("fade");
            } else {
                if ($w("#compactHeader")) $w("#compactHeader").hide("fade");
            }
        });
    }
}

// ── Analytics Tracking ──────────────────────────────────────

function trackPageView() {
    // Fire a lightweight backend call to track page views
    const pageInfo = {
        path: wixLocation.path.join("/"),
        lang: currentLang,
        referrer: wixWindow.referrer || "direct",
        timestamp: new Date().toISOString(),
    };

    // Non-blocking analytics call
    import("backend/analytics.jsw").then((analytics) => {
        analytics.trackView(pageInfo).catch(() => {
            // Silently fail — analytics should never break the page
        });
    });
}

// ── RedTrack Integration ───────────────────────────────────

/**
 * Capture RedTrack click ID from URL query parameters and store in session.
 * When a visitor arrives via a RedTrack campaign link, the URL contains
 * a click ID parameter (e.g. ?rtkclkid=abc123). We store this so it
 * persists across page navigations for server-side conversion tracking.
 */
function captureRedTrackClickId() {
    const clickIdParam = SITE_CONFIG.redtrack.clickIdParam;
    const query = wixLocation.query;

    if (query[clickIdParam]) {
        wixStorage.session.setItem(RT_CLICK_ID_KEY, query[clickIdParam]);
    }
}

/**
 * Send a page view conversion to RedTrack via CAPI (server-side).
 * Only fires if a RedTrack click ID is present in session storage.
 */
function trackRedTrackPageView() {
    const clickId = wixStorage.session.getItem(RT_CLICK_ID_KEY);
    if (!clickId) return;

    import("backend/redtrack.jsw").then((redtrack) => {
        redtrack.trackPageViewConversion(clickId, {
            path: wixLocation.path.join("/"),
        }).catch(() => {
            // Silently fail — tracking should never break the page
        });
    });
}

/**
 * Get the stored RedTrack click ID (used by page-level code like Article.js)
 */
export function getRedTrackClickId() {
    return wixStorage.session.getItem(RT_CLICK_ID_KEY);
}

// ── Exported Helpers (available to page code) ───────────────

export function getCurrentLang() {
    return currentLang;
}

export function getLabels() {
    return UI_LABELS[currentLang];
}

export function getLocalizedField(item, fieldName) {
    const suffix = currentLang === "bn" ? "Bn" : "En";
    return item[`${fieldName}${suffix}`] || item[`${fieldName}En`] || "";
}
