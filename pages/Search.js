// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Search Results Page
// ─────────────────────────────────────────────────────────────
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixSeo from "wix-seo";
import { getCurrentLang, getLabels } from "public/masterPage.js";
import { SITE_CONFIG } from "public/config.js";
import { localize, formatDate, articleUrl, truncate } from "public/helpers.js";

$w.onReady(async function () {
    const lang = getCurrentLang();
    const labels = getLabels();

    const query = wixLocation.query.q || "";

    if ($w("#searchInput")) $w("#searchInput").value = query;

    if (query.length < 2) {
        if ($w("#searchPrompt")) {
            $w("#searchPrompt").text = lang === "bn"
                ? "অনুগ্রহ করে কমপক্ষে ২টি অক্ষর লিখুন।"
                : "Please enter at least 2 characters.";
            $w("#searchPrompt").show();
        }
        return;
    }

    setupSearchSEO(query, lang);
    await performSearch(query, lang, labels);

    // Re-search on enter
    if ($w("#searchInput")) {
        $w("#searchInput").onKeyPress((event) => {
            if (event.key === "Enter") {
                const newQuery = $w("#searchInput").value.trim();
                if (newQuery.length >= 2) {
                    wixLocation.to(`/${lang}/search?q=${encodeURIComponent(newQuery)}`);
                }
            }
        });
    }
});

// ── SEO ─────────────────────────────────────────────────────

function setupSearchSEO(query, lang) {
    const suffix = lang === "bn" ? SITE_CONFIG.seo.titleSuffixBn : SITE_CONFIG.seo.titleSuffixEn;
    const prefix = lang === "bn" ? "অনুসন্ধান:" : "Search:";
    wixSeo.setTitle(`${prefix} ${query}${suffix}`);
    // Prevent search pages from being indexed
    wixSeo.setMetaTags([{ name: "robots", content: "noindex, follow" }]);
}

// ── Search ──────────────────────────────────────────────────

async function performSearch(query, lang, labels) {
    // Search in both Bengali and English title/summary fields
    const results = await wixData
        .query("Articles")
        .eq("status", "published")
        .and(
            wixData
                .query("Articles")
                .contains("titleEn", query)
                .or(wixData.query("Articles").contains("titleBn", query))
                .or(wixData.query("Articles").contains("summaryEn", query))
                .or(wixData.query("Articles").contains("summaryBn", query))
                .or(wixData.query("Articles").hasSome("tags", [query]))
        )
        .descending("publishDate")
        .limit(20)
        .include("author")
        .find();

    // Show result count
    if ($w("#resultCount")) {
        const count = results.totalCount;
        $w("#resultCount").text = lang === "bn"
            ? `"${query}" এর জন্য ${count}টি ফলাফল পাওয়া গেছে`
            : `${count} result${count !== 1 ? "s" : ""} found for "${query}"`;
    }

    if (results.items.length === 0) {
        if ($w("#noResultsText")) {
            $w("#noResultsText").text = labels.noResults;
            $w("#noResultsText").show();
        }
        return;
    }

    // Populate results
    if ($w("#searchRepeater")) {
        $w("#searchRepeater").data = results.items.map((a) => ({ _id: a._id, ...a }));

        $w("#searchRepeater").onItemReady(($item, itemData) => {
            $item("#searchResultImage").src = itemData.thumbnailImage || itemData.featuredImage;
            $item("#searchResultTitle").text = localize(itemData, "title", lang);
            $item("#searchResultSummary").text = truncate(localize(itemData, "summary", lang), 150);
            $item("#searchResultDate").text = formatDate(itemData.publishDate, lang);

            const cat = SITE_CONFIG.categories.find((c) => c.id === itemData.category);
            if ($item("#searchResultCategory") && cat) {
                $item("#searchResultCategory").text = lang === "bn" ? cat.labelBn : cat.labelEn;
            }

            $item("#searchResultLink").onClick(() => {
                wixLocation.to(articleUrl(itemData.slug, lang));
            });
        });
    }
}
