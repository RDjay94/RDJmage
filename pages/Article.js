// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Article (Dynamic Page)
// ─────────────────────────────────────────────────────────────
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from "wix-window";
import wixSeo from "wix-seo";
import { getCurrentLang, getLabels } from "public/masterPage.js";
import { SITE_CONFIG } from "public/config.js";
import {
    localize, formatDate, articleUrl, truncate,
    getShareUrls, calculateReadTime, getCategoryById,
    formatViewCount, toBengali,
} from "public/helpers.js";

let currentArticle = null;

$w.onReady(async function () {
    const lang = getCurrentLang();
    const labels = getLabels();

    // Get the article slug from URL: /{lang}/article/{slug}
    const path = wixLocation.path;
    const slug = path[path.length - 1];

    if (!slug) {
        showNotFound(lang);
        return;
    }

    await loadArticle(slug, lang, labels);
});

// ── Load Article ────────────────────────────────────────────

async function loadArticle(slug, lang, labels) {
    const results = await wixData
        .query("Articles")
        .eq("slug", slug)
        .eq("status", "published")
        .include("author")
        .find();

    if (results.items.length === 0) {
        showNotFound(lang);
        return;
    }

    currentArticle = results.items[0];

    // Populate article content
    populateArticle(currentArticle, lang, labels);

    // SEO
    setupArticleSEO(currentArticle, lang);

    // Track view
    trackArticleView(currentArticle._id, lang);

    // Load related articles
    loadRelatedArticles(currentArticle, lang, labels);

    // BigTaka CTA
    setupBigTakaCTA(currentArticle, lang);

    // Share buttons
    setupShareButtons(currentArticle, lang);
}

// ── Populate Article Content ────────────────────────────────

function populateArticle(article, lang, labels) {
    const title = localize(article, "title", lang);
    const body = localize(article, "body", lang);
    const summary = localize(article, "summary", lang);

    // Title & body
    if ($w("#articleTitle")) $w("#articleTitle").text = title;
    if ($w("#articleBody")) $w("#articleBody").html = body;
    if ($w("#articleSummary")) $w("#articleSummary").text = summary;

    // Featured image
    if ($w("#articleImage")) $w("#articleImage").src = article.featuredImage;

    // Category badge
    const cat = getCategoryById(article.category);
    if ($w("#articleCategory") && cat) {
        $w("#articleCategory").text = `${cat.icon} ${lang === "bn" ? cat.labelBn : cat.labelEn}`;
        $w("#articleCategory").onClick(() => {
            wixLocation.to(`/${lang}/category/${cat.slug}`);
        });
    }

    // Date
    if ($w("#articleDate")) {
        $w("#articleDate").text = `${labels.publishedOn} ${formatDate(article.publishDate, lang)}`;
    }

    // Author
    if (article.author) {
        const authorName = localize(article.author, "name", lang);
        if ($w("#authorName")) $w("#authorName").text = `${labels.by} ${authorName}`;
        if ($w("#authorAvatar")) $w("#authorAvatar").src = article.author.avatar;
        if ($w("#authorBio")) $w("#authorBio").text = localize(article.author, "bio", lang);
    }

    // Read time
    const plainText = body ? body.replace(/<[^>]*>/g, "") : "";
    const readTime = calculateReadTime(plainText, lang);
    if ($w("#readTime")) {
        const mins = lang === "bn" ? toBengali(readTime) : readTime;
        $w("#readTime").text = `${mins} ${labels.minuteRead}`;
    }

    // View count
    if ($w("#viewCount")) {
        $w("#viewCount").text = formatViewCount(article.viewCount || 0, lang);
    }

    // Tags
    if ($w("#tagsRepeater") && article.tags && article.tags.length > 0) {
        $w("#tagsRepeater").data = article.tags.map((tag, i) => ({
            _id: `tag_${i}`,
            tag: tag,
        }));
        $w("#tagsRepeater").onItemReady(($item, tagData) => {
            $item("#tagLabel").text = `#${tagData.tag}`;
            $item("#tagLink").onClick(() => {
                wixLocation.to(`/${lang}/search?q=${encodeURIComponent(tagData.tag)}`);
            });
        });
    }

    // Breadcrumb
    if ($w("#breadcrumbHome")) {
        $w("#breadcrumbHome").text = labels.home;
        $w("#breadcrumbHome").onClick(() => wixLocation.to(`/${lang}`));
    }
    if ($w("#breadcrumbCategory") && cat) {
        $w("#breadcrumbCategory").text = lang === "bn" ? cat.labelBn : cat.labelEn;
        $w("#breadcrumbCategory").onClick(() => wixLocation.to(`/${lang}/category/${cat.slug}`));
    }
    if ($w("#breadcrumbTitle")) {
        $w("#breadcrumbTitle").text = truncate(title, 40);
    }
}

// ── SEO ─────────────────────────────────────────────────────

function setupArticleSEO(article, lang) {
    const seoTitle = localize(article, "seoTitle", lang) || localize(article, "title", lang);
    const seoDesc = localize(article, "seoDesc", lang) || localize(article, "summary", lang);
    const suffix = lang === "bn" ? SITE_CONFIG.seo.titleSuffixBn : SITE_CONFIG.seo.titleSuffixEn;
    const fullTitle = `${seoTitle}${suffix}`;
    const fullUrl = `${SITE_CONFIG.baseUrl}/${lang}/article/${article.slug}`;

    wixSeo.setTitle(fullTitle);
    wixSeo.setMetaTags([
        { name: "description", content: seoDesc },
        { name: "keywords", content: article.seoKeywords || "" },
        { property: "og:title", content: fullTitle },
        { property: "og:description", content: seoDesc },
        { property: "og:image", content: article.featuredImage },
        { property: "og:url", content: fullUrl },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: SITE_CONFIG.siteName },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: fullTitle },
        { name: "twitter:description", content: seoDesc },
        { name: "twitter:image", content: article.featuredImage },
    ]);

    // Alternate language links
    const altLang = lang === "bn" ? "en" : "bn";
    wixSeo.setLinks([
        { rel: "canonical", href: fullUrl },
        { rel: "alternate", href: `${SITE_CONFIG.baseUrl}/${altLang}/article/${article.slug}`, hreflang: altLang },
        { rel: "alternate", href: fullUrl, hreflang: lang },
    ]);

    // Structured data (Article schema)
    wixSeo.setStructuredData([
        {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: localize(article, "title", lang),
            description: seoDesc,
            image: article.featuredImage,
            datePublished: article.publishDate,
            dateModified: article._updatedDate || article.publishDate,
            author: article.author
                ? { "@type": "Person", name: localize(article.author, "name", lang) }
                : undefined,
            publisher: {
                "@type": "Organization",
                name: SITE_CONFIG.siteName,
                logo: { "@type": "ImageObject", url: SITE_CONFIG.brand.logoUrl },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": fullUrl },
        },
    ]);
}

// ── Related Articles ────────────────────────────────────────

async function loadRelatedArticles(article, lang, labels) {
    if (!$w("#relatedRepeater")) return;

    if ($w("#relatedTitle")) $w("#relatedTitle").text = labels.relatedArticles;

    // Find articles in the same category, excluding current
    const results = await wixData
        .query("Articles")
        .eq("status", "published")
        .eq("category", article.category)
        .ne("_id", article._id)
        .descending("publishDate")
        .limit(SITE_CONFIG.content.relatedCount)
        .find();

    if (results.items.length === 0) {
        if ($w("#relatedSection")) $w("#relatedSection").hide();
        return;
    }

    $w("#relatedRepeater").data = results.items.map((a) => ({ _id: a._id, ...a }));

    $w("#relatedRepeater").onItemReady(($item, itemData) => {
        $item("#relatedImage").src = itemData.thumbnailImage || itemData.featuredImage;
        $item("#relatedItemTitle").text = localize(itemData, "title", lang);
        $item("#relatedItemDate").text = formatDate(itemData.publishDate, lang);
        $item("#relatedItemLink").onClick(() => {
            wixLocation.to(articleUrl(itemData.slug, lang));
        });
    });
}

// ── BigTaka CTA ─────────────────────────────────────────────

function setupBigTakaCTA(article, lang) {
    // Inline CTA within article body
    if ($w("#bigTakaCTA") && article.bigTakaLink) {
        $w("#bigTakaCTA").show();
        if ($w("#bigTakaCtaText")) {
            $w("#bigTakaCtaText").text = article.bigTakaCta ||
                (lang === "bn" ? "বিগটাকায় যান →" : "Visit BigTaka →");
        }
        $w("#bigTakaCTA").onClick(() => {
            wixWindow.openUrl(article.bigTakaLink, "_blank");
        });
    }

    // Sidebar BigTaka banner (always visible)
    if ($w("#sidebarBigTakaBanner")) {
        $w("#sidebarBigTakaBanner").onClick(() => {
            wixWindow.openUrl("https://www.bigtaka.com", "_blank");
        });
    }
}

// ── Share Buttons ───────────────────────────────────────────

function setupShareButtons(article, lang) {
    const labels = getLabels();
    const title = localize(article, "title", lang);
    const fullUrl = `${SITE_CONFIG.baseUrl}/${lang}/article/${article.slug}`;
    const shares = getShareUrls(fullUrl, title);

    if ($w("#shareTitle")) $w("#shareTitle").text = labels.shareArticle;

    const shareButtons = {
        "#shareFacebook": shares.facebook,
        "#shareTwitter": shares.twitter,
        "#shareTelegram": shares.telegram,
        "#shareWhatsapp": shares.whatsapp,
    };

    Object.entries(shareButtons).forEach(([id, url]) => {
        if ($w(id)) {
            $w(id).onClick(() => wixWindow.openUrl(url, "_blank"));
        }
    });
}

// ── Track View ──────────────────────────────────────────────

function trackArticleView(articleId, lang) {
    import("backend/analytics.jsw").then((analytics) => {
        analytics.incrementArticleView(articleId, lang).catch(() => {});
    });
}

// ── Not Found ───────────────────────────────────────────────

function showNotFound(lang) {
    if ($w("#articleContent")) $w("#articleContent").hide();
    if ($w("#notFoundSection")) {
        $w("#notFoundSection").show();
        if ($w("#notFoundText")) {
            $w("#notFoundText").text = lang === "bn"
                ? "দুঃখিত, এই আর্টিকেল পাওয়া যায়নি।"
                : "Sorry, this article was not found.";
        }
        if ($w("#notFoundHomeBtn")) {
            $w("#notFoundHomeBtn").label = lang === "bn" ? "হোমে ফিরে যান" : "Back to Home";
            $w("#notFoundHomeBtn").onClick(() => wixLocation.to(`/${lang}`));
        }
    }
}
