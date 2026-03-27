// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Global Configuration
// ─────────────────────────────────────────────────────────────

export const SITE_CONFIG = {
    siteName: "BigTaka Content Network",
    siteNameBn: "বিগটাকা কন্টেন্ট নেটওয়ার্ক",
    defaultLang: "bn",
    supportedLangs: ["bn", "en"],
    baseUrl: "https://www.bigtaka-content.com",

    // Branding
    brand: {
        name: "BigTaka",
        nameBn: "বিগটাকা",
        primaryColor: "#FF6B00",
        secondaryColor: "#1A1A2E",
        accentColor: "#FFD700",
        logoUrl: "/BigTaka-logo.png",
    },

    // Categories
    categories: [
        { id: "cricket", labelEn: "Cricket News", labelBn: "ক্রিকেট খবর", icon: "🏏", slug: "cricket" },
        { id: "casino", labelEn: "Casino & Gaming", labelBn: "ক্যাসিনো ও গেমিং", icon: "🎰", slug: "casino-gaming" },
        { id: "celebrity", labelEn: "Celebrity & Entertainment", labelBn: "সেলিব্রিটি ও বিনোদন", icon: "🎭", slug: "celebrity-entertainment" },
        { id: "viral", labelEn: "Worldwide Viral", labelBn: "বিশ্বজুড়ে ভাইরাল", icon: "🌍", slug: "worldwide-viral" },
    ],

    // SEO defaults
    seo: {
        titleSuffixEn: " | BigTaka Content Network",
        titleSuffixBn: " | বিগটাকা কন্টেন্ট নেটওয়ার্ক",
        defaultDescriptionEn: "Latest cricket news, celebrity updates, gaming insights and viral stories from Bangladesh and beyond.",
        defaultDescriptionBn: "বাংলাদেশ এবং বিশ্ব থেকে সর্বশেষ ক্রিকেট খবর, সেলিব্রিটি আপডেট, গেমিং ইনসাইট এবং ভাইরাল স্টোরি।",
        defaultKeywordsEn: "cricket news, Bangladesh cricket, IPL, BPL, celebrity news BD, BigTaka",
        defaultKeywordsBn: "ক্রিকেট খবর, বাংলাদেশ ক্রিকেট, আইপিএল, বিপিএল, সেলিব্রিটি খবর, বিগটাকা",
    },

    // Content settings
    content: {
        articlesPerPage: 12,
        trendingCount: 6,
        featuredCount: 3,
        relatedCount: 4,
    },

    // Social links
    social: {
        facebook: "https://facebook.com/bigtaka",
        telegram: "https://t.me/bigtaka",
        youtube: "https://youtube.com/@bigtaka",
    },
};

// Language labels used across the site
export const UI_LABELS = {
    en: {
        home: "Home",
        trending: "Trending Now",
        featured: "Featured Stories",
        latest: "Latest Articles",
        readMore: "Read More",
        shareArticle: "Share This Article",
        relatedArticles: "Related Articles",
        searchPlaceholder: "Search articles...",
        categories: "Categories",
        loadMore: "Load More",
        publishedOn: "Published on",
        by: "By",
        minuteRead: "min read",
        switchLang: "বাংলা",
        backToHome: "Back to Home",
        noResults: "No articles found.",
        footer: {
            about: "About BigTaka Content Network",
            aboutText: "Your go-to source for the latest cricket news, entertainment updates, and trending stories from Bangladesh and around the world.",
            quickLinks: "Quick Links",
            followUs: "Follow Us",
            copyright: "© 2026 BigTaka Content Network. All rights reserved.",
        },
    },
    bn: {
        home: "হোম",
        trending: "এখন ট্রেন্ডিং",
        featured: "ফিচার্ড স্টোরি",
        latest: "সর্বশেষ আর্টিকেল",
        readMore: "আরও পড়ুন",
        shareArticle: "এই আর্টিকেল শেয়ার করুন",
        relatedArticles: "সম্পর্কিত আর্টিকেল",
        searchPlaceholder: "আর্টিকেল খুঁজুন...",
        categories: "ক্যাটাগরি",
        loadMore: "আরও দেখুন",
        publishedOn: "প্রকাশিত",
        by: "লেখক",
        minuteRead: "মিনিট পড়া",
        switchLang: "English",
        backToHome: "হোমে ফিরে যান",
        noResults: "কোনো আর্টিকেল পাওয়া যায়নি।",
        footer: {
            about: "বিগটাকা কন্টেন্ট নেটওয়ার্ক সম্পর্কে",
            aboutText: "বাংলাদেশ এবং বিশ্ব থেকে সর্বশেষ ক্রিকেট খবর, বিনোদন আপডেট এবং ট্রেন্ডিং স্টোরির জন্য আপনার বিশ্বস্ত উৎস।",
            quickLinks: "দ্রুত লিংক",
            followUs: "আমাদের অনুসরণ করুন",
            copyright: "© ২০২৬ বিগটাকা কন্টেন্ট নেটওয়ার্ক। সর্বস্বত্ব সংরক্ষিত।",
        },
    },
};
