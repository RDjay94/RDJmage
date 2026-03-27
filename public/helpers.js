// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Public Helper Utilities
// Shared across frontend pages
// ─────────────────────────────────────────────────────────────

import { SITE_CONFIG } from "public/config.js";

/**
 * Get the localized value of a bilingual field
 * @param {Object} item - Data item with En/Bn suffixed fields
 * @param {string} fieldName - Base field name (e.g., "title")
 * @param {string} lang - "bn" or "en"
 * @returns {string}
 */
export function localize(item, fieldName, lang) {
    const suffix = lang === "bn" ? "Bn" : "En";
    return item[`${fieldName}${suffix}`] || item[`${fieldName}En`] || "";
}

/**
 * Format a date for display
 * @param {Date|string} date
 * @param {string} lang - "bn" or "en"
 * @returns {string}
 */
export function formatDate(date, lang) {
    const d = new Date(date);
    if (lang === "bn") {
        const bnMonths = [
            "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
            "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
        ];
        const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
        const day = toBengaliNumber(d.getDate(), bnDigits);
        const month = bnMonths[d.getMonth()];
        const year = toBengaliNumber(d.getFullYear(), bnDigits);
        return `${day} ${month}, ${year}`;
    }
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Convert number to Bengali digits
 */
function toBengaliNumber(num, bnDigits) {
    return String(num)
        .split("")
        .map((digit) => bnDigits[parseInt(digit)] || digit)
        .join("");
}

/**
 * Convert English number to Bengali
 */
export function toBengali(num) {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return toBengaliNumber(num, bnDigits);
}

/**
 * Generate article URL
 * @param {string} slug - Article slug
 * @param {string} lang - "bn" or "en"
 * @returns {string}
 */
export function articleUrl(slug, lang) {
    return `/${lang}/article/${slug}`;
}

/**
 * Generate category URL
 * @param {string} categorySlug
 * @param {string} lang
 * @returns {string}
 */
export function categoryUrl(categorySlug, lang) {
    return `/${lang}/category/${categorySlug}`;
}

/**
 * Truncate text to a max length with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text || "";
    return text.substring(0, maxLength).trim() + "...";
}

/**
 * Calculate estimated read time
 * @param {string} bodyText - Article body as plain text
 * @param {string} lang - "bn" or "en"
 * @returns {number} Minutes
 */
export function calculateReadTime(bodyText, lang) {
    if (!bodyText) return 1;
    const wordsPerMinute = lang === "bn" ? 150 : 200;
    const wordCount = bodyText.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Get category config by ID
 * @param {string} categoryId
 * @returns {Object|null}
 */
export function getCategoryById(categoryId) {
    return SITE_CONFIG.categories.find((c) => c.id === categoryId) || null;
}

/**
 * Generate social share URLs
 * @param {string} url - Full article URL
 * @param {string} title - Article title
 * @returns {Object}
 */
export function getShareUrls(url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };
}

/**
 * Format view count with K/M suffixes
 * @param {number} count
 * @param {string} lang
 * @returns {string}
 */
export function formatViewCount(count, lang) {
    let formatted;
    if (count >= 1000000) {
        formatted = (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
        formatted = (count / 1000).toFixed(1) + "K";
    } else {
        formatted = String(count);
    }
    return lang === "bn" ? toBengali(formatted) : formatted;
}
