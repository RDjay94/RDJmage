// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Category Page
// ─────────────────────────────────────────────────────────────
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixSeo from "wix-seo";
import { getCurrentLang, getLabels } from "public/masterPage.js";
import { SITE_CONFIG } from "public/config.js";
import { localize, formatDate, articleUrl, truncate, formatViewCount } from "public/helpers.js";

$w.onReady(async function () {
    const lang = getCurrentLang();
    const labels = getLabels();

    // Get category slug from URL: /{lang}/category/{slug}
    const path = wixLocation.path;
    const categorySlug = path[path.length - 1];

    const category = SITE_CONFIG.categories.find((c) => c.slug === categorySlug);

    if (!category) {
        showNotFound(lang);
        return;
    }

    setupCategoryHeader(category, lang);
    setupCategorySEO(category, lang);
    await loadCategoryArticles(category, lang, labels);
});

// ── Category Header ─────────────────────────────────────────

function setupCategoryHeader(category, lang) {
    const name = lang === "bn" ? category.labelBn : category.labelEn;

    if ($w("#categoryName")) $w("#categoryName").text = `${category.icon} ${name}`;

    // Breadcrumb
    if ($w("#breadcrumbHome")) {
        const labels = getLabels();
        $w("#breadcrumbHome").text = labels.home;
        $w("#breadcrumbHome").onClick(() => wixLocation.to(`/${lang}`));
    }
    if ($w("#breadcrumbCurrent")) {
        $w("#breadcrumbCurrent").text = name;
    }
}

// ── SEO ─────────────────────────────────────────────────────

function setupCategorySEO(category, lang) {
    const name = lang === "bn" ? category.labelBn : category.labelEn;
    const suffix = lang === "bn" ? SITE_CONFIG.seo.titleSuffixBn : SITE_CONFIG.seo.titleSuffixEn;
    const title = `${name}${suffix}`;

    const description = lang === "bn"
        ? `${name} — সর্বশেষ খবর ও আপডেট। বিগটাকা কন্টেন্ট নেটওয়ার্ক।`
        : `${name} — Latest news and updates. BigTaka Content Network.`;

    wixSeo.setTitle(title);
    wixSeo.setMetaTags([
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
    ]);
}

// ── Load Articles ───────────────────────────────────────────

async function loadCategoryArticles(category, lang, labels) {
    const results = await wixData
        .query("Articles")
        .eq("status", "published")
        .eq("category", category.id)
        .descending("publishDate")
        .limit(SITE_CONFIG.content.articlesPerPage)
        .include("author")
        .find();

    if (results.items.length === 0) {
        if ($w("#noResultsText")) {
            $w("#noResultsText").text = labels.noResults;
            $w("#noResultsText").show();
        }
        return;
    }

    if ($w("#categoryRepeater")) {
        $w("#categoryRepeater").data = results.items.map((a) => ({ _id: a._id, ...a }));

        $w("#categoryRepeater").onItemReady(($item, itemData) => {
            $item("#catArticleImage").src = itemData.thumbnailImage || itemData.featuredImage;
            $item("#catArticleTitle").text = localize(itemData, "title", lang);
            $item("#catArticleSummary").text = truncate(localize(itemData, "summary", lang), 150);
            $item("#catArticleDate").text = formatDate(itemData.publishDate, lang);
            $item("#catArticleViews").text = formatViewCount(itemData.viewCount || 0, lang);

            if (itemData.author) {
                $item("#catArticleAuthor").text = `${labels.by} ${localize(itemData.author, "name", lang)}`;
            }

            $item("#catArticleLink").onClick(() => {
                wixLocation.to(articleUrl(itemData.slug, lang));
            });
        });

        // Load more
        setupLoadMore(results, lang, labels);
    }
}

// ── Load More ───────────────────────────────────────────────

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

            const existingData = $w("#categoryRepeater").data;
            const newData = nextResults.items.map((a) => ({ _id: a._id, ...a }));
            $w("#categoryRepeater").data = [...existingData, ...newData];

            if (!currentResults.hasNext()) $w("#loadMoreBtn").hide();
            $w("#loadMoreBtn").enable();
        });
    }
}

// ── Not Found ───────────────────────────────────────────────

function showNotFound(lang) {
    if ($w("#categoryContent")) $w("#categoryContent").hide();
    if ($w("#notFoundSection")) {
        $w("#notFoundSection").show();
        if ($w("#notFoundText")) {
            $w("#notFoundText").text = lang === "bn"
                ? "এই ক্যাটাগরি পাওয়া যায়নি।"
                : "Category not found.";
        }
    }
}
