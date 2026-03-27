// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Homepage
// ─────────────────────────────────────────────────────────────
import wixData from "wix-data";
import wixSeo from "wix-seo";
import { getCurrentLang, getLabels, getLocalizedField } from "public/masterPage.js";
import { SITE_CONFIG } from "public/config.js";
import { localize, formatDate, articleUrl, truncate, categoryUrl, formatViewCount } from "public/helpers.js";

$w.onReady(async function () {
    const lang = getCurrentLang();
    const labels = getLabels();

    setupSEO(lang);
    setupSectionHeaders(labels);

    // Load all sections in parallel
    await Promise.all([
        loadFeaturedArticles(lang, labels),
        loadTrendingArticles(lang, labels),
        loadLatestByCategory(lang, labels),
        loadLatestArticles(lang, labels),
    ]);
});

// ── SEO Setup ───────────────────────────────────────────────

function setupSEO(lang) {
    const seo = SITE_CONFIG.seo;
    const title = lang === "bn"
        ? `হোম${seo.titleSuffixBn}`
        : `Home${seo.titleSuffixEn}`;
    const description = lang === "bn" ? seo.defaultDescriptionBn : seo.defaultDescriptionEn;

    wixSeo.setTitle(title);
    wixSeo.setMetaTags([
        { name: "description", content: description },
        { name: "keywords", content: lang === "bn" ? seo.defaultKeywordsBn : seo.defaultKeywordsEn },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: SITE_CONFIG.siteName },
    ]);
}

function setupSectionHeaders(labels) {
    if ($w("#trendingTitle")) $w("#trendingTitle").text = labels.trending;
    if ($w("#featuredTitle")) $w("#featuredTitle").text = labels.featured;
    if ($w("#latestTitle")) $w("#latestTitle").text = labels.latest;
    if ($w("#categoriesTitle")) $w("#categoriesTitle").text = labels.categories;
}

// ── Featured Articles (Hero Section) ────────────────────────

async function loadFeaturedArticles(lang, labels) {
    const results = await wixData
        .query("Articles")
        .eq("status", "published")
        .eq("isFeatured", true)
        .descending("publishDate")
        .limit(SITE_CONFIG.content.featuredCount)
        .include("author")
        .find();

    if (results.items.length === 0) return;

    const articles = results.items;

    // Main featured article (hero)
    const hero = articles[0];
    if ($w("#heroImage")) $w("#heroImage").src = hero.featuredImage;
    if ($w("#heroTitle")) $w("#heroTitle").text = localize(hero, "title", lang);
    if ($w("#heroSummary")) $w("#heroSummary").text = localize(hero, "summary", lang);
    if ($w("#heroCategory")) {
        const cat = SITE_CONFIG.categories.find((c) => c.id === hero.category);
        $w("#heroCategory").text = cat ? (lang === "bn" ? cat.labelBn : cat.labelEn) : "";
    }
    if ($w("#heroDate")) $w("#heroDate").text = formatDate(hero.publishDate, lang);
    if ($w("#heroLink")) {
        $w("#heroLink").onClick(() => {
            import("wix-location").then((loc) => loc.to(articleUrl(hero.slug, lang)));
        });
    }

    // Secondary featured articles
    if ($w("#featuredRepeater")) {
        const secondaryArticles = articles.slice(1);
        $w("#featuredRepeater").data = secondaryArticles.map((a) => ({
            _id: a._id,
            ...a,
        }));

        $w("#featuredRepeater").onItemReady(($item, itemData) => {
            $item("#featuredItemImage").src = itemData.thumbnailImage || itemData.featuredImage;
            $item("#featuredItemTitle").text = localize(itemData, "title", lang);
            $item("#featuredItemSummary").text = truncate(localize(itemData, "summary", lang), 100);
            $item("#featuredItemDate").text = formatDate(itemData.publishDate, lang);

            $item("#featuredItemLink").onClick(() => {
                import("wix-location").then((loc) => loc.to(articleUrl(itemData.slug, lang)));
            });
        });
    }
}

// ── Trending Articles ───────────────────────────────────────

async function loadTrendingArticles(lang, labels) {
    const results = await wixData
        .query("Articles")
        .eq("status", "published")
        .eq("isTrending", true)
        .descending("viewCount")
        .limit(SITE_CONFIG.content.trendingCount)
        .find();

    if ($w("#trendingRepeater") && results.items.length > 0) {
        $w("#trendingRepeater").data = results.items.map((a) => ({ _id: a._id, ...a }));

        $w("#trendingRepeater").onItemReady(($item, itemData) => {
            $item("#trendingImage").src = itemData.thumbnailImage || itemData.featuredImage;
            $item("#trendingItemTitle").text = localize(itemData, "title", lang);
            $item("#trendingCategory").text = getCategoryLabel(itemData.category, lang);
            $item("#trendingViews").text = formatViewCount(itemData.viewCount || 0, lang);

            $item("#trendingItemLink").onClick(() => {
                import("wix-location").then((loc) => loc.to(articleUrl(itemData.slug, lang)));
            });
        });
    }
}

// ── Latest Articles by Category ─────────────────────────────

async function loadLatestByCategory(lang, labels) {
    if (!$w("#categoryRepeater")) return;

    // Build category cards
    const categoryData = SITE_CONFIG.categories.map((cat) => ({
        _id: cat.id,
        ...cat,
    }));

    $w("#categoryRepeater").data = categoryData;

    $w("#categoryRepeater").onItemReady(async ($item, catData) => {
        const catLabel = lang === "bn" ? catData.labelBn : catData.labelEn;
        $item("#catTitle").text = `${catData.icon} ${catLabel}`;

        // Load 3 latest articles for this category
        const catArticles = await wixData
            .query("Articles")
            .eq("status", "published")
            .eq("category", catData.id)
            .descending("publishDate")
            .limit(3)
            .find();

        if ($item("#catArticleRepeater") && catArticles.items.length > 0) {
            $item("#catArticleRepeater").data = catArticles.items.map((a) => ({
                _id: a._id,
                ...a,
            }));

            $item("#catArticleRepeater").onItemReady(($aItem, article) => {
                $aItem("#catArticleTitle").text = localize(article, "title", lang);
                $aItem("#catArticleDate").text = formatDate(article.publishDate, lang);
                if ($aItem("#catArticleThumb")) {
                    $aItem("#catArticleThumb").src = article.thumbnailImage || article.featuredImage;
                }
                $aItem("#catArticleLink").onClick(() => {
                    import("wix-location").then((loc) => loc.to(articleUrl(article.slug, lang)));
                });
            });
        }

        // "View all" link for the category
        if ($item("#catViewAll")) {
            $item("#catViewAll").text = lang === "bn" ? "সব দেখুন →" : "View All →";
            $item("#catViewAll").onClick(() => {
                import("wix-location").then((loc) => loc.to(categoryUrl(catData.slug, lang)));
            });
        }
    });
}

// ── Latest Articles (All Categories) ────────────────────────

async function loadLatestArticles(lang, labels) {
    const results = await wixData
        .query("Articles")
        .eq("status", "published")
        .descending("publishDate")
        .limit(SITE_CONFIG.content.articlesPerPage)
        .include("author")
        .find();

    if ($w("#latestRepeater") && results.items.length > 0) {
        $w("#latestRepeater").data = results.items.map((a) => ({ _id: a._id, ...a }));

        $w("#latestRepeater").onItemReady(($item, itemData) => {
            $item("#latestImage").src = itemData.thumbnailImage || itemData.featuredImage;
            $item("#latestItemTitle").text = localize(itemData, "title", lang);
            $item("#latestItemSummary").text = truncate(localize(itemData, "summary", lang), 120);
            $item("#latestItemCategory").text = getCategoryLabel(itemData.category, lang);
            $item("#latestItemDate").text = formatDate(itemData.publishDate, lang);

            if (itemData.author) {
                $item("#latestItemAuthor").text = `${labels.by} ${localize(itemData.author, "name", lang)}`;
            }

            $item("#latestItemLink").onClick(() => {
                import("wix-location").then((loc) => loc.to(articleUrl(itemData.slug, lang)));
            });
        });

        // Load more button
        setupLoadMore(results, lang, labels);
    }
}

// ── Load More Pagination ────────────────────────────────────

function setupLoadMore(initialResults, lang, labels) {
    let currentResults = initialResults;

    if ($w("#loadMoreBtn")) {
        $w("#loadMoreBtn").label = labels.loadMore;

        if (!currentResults.hasNext()) {
            $w("#loadMoreBtn").hide();
            return;
        }

        $w("#loadMoreBtn").onClick(async () => {
            $w("#loadMoreBtn").disable();
            const nextResults = await currentResults.next();
            currentResults = nextResults;

            const existingData = $w("#latestRepeater").data;
            const newData = nextResults.items.map((a) => ({ _id: a._id, ...a }));
            $w("#latestRepeater").data = [...existingData, ...newData];

            if (!currentResults.hasNext()) {
                $w("#loadMoreBtn").hide();
            }
            $w("#loadMoreBtn").enable();
        });
    }
}

// ── Helpers ─────────────────────────────────────────────────

function getCategoryLabel(categoryId, lang) {
    const cat = SITE_CONFIG.categories.find((c) => c.id === categoryId);
    if (!cat) return "";
    return lang === "bn" ? cat.labelBn : cat.labelEn;
}
