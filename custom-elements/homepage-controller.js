// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Homepage Controller
// PASTE THIS into the Home page code tab in Wix Editor
// This fetches articles and sends them to the HtmlComponent
// ─────────────────────────────────────────────────────────────
import wixData from "wix-data";
import wixLocation from "wix-location";
import wixWindow from "wix-window";

$w.onReady(async function () {
    // Fetch all published articles
    const results = await wixData
        .query("Articles")
        .eq("status", "published")
        .descending("publishDate")
        .limit(50)
        .find();

    const articles = results.items.map(item => ({
        _id: item._id,
        titleEn: item.titleEn,
        titleBn: item.titleBn,
        slug: item.slug,
        summaryEn: item.summaryEn,
        summaryBn: item.summaryBn,
        category: item.category,
        tags: item.tags,
        featuredImage: item.featuredImage,
        thumbnailImage: item.thumbnailImage,
        status: item.status,
        isFeatured: item.isFeatured,
        isTrending: item.isTrending,
        viewCount: item.viewCount,
        readTimeMinutes: item.readTimeMinutes,
        publishDate: item.publishDate,
    }));

    // Send articles to the HtmlComponent
    // The HtmlComponent ID should be "htmlEmbed" — set this in Properties!
    $w("#htmlEmbed").postMessage({
        type: "articles",
        items: articles,
        lang: "bn",
    });

    // Listen for navigation messages from the embed
    $w("#htmlEmbed").onMessage((event) => {
        if (event.data.type === "navigate") {
            wixLocation.to(`/${event.data.lang}/article/${event.data.slug}`);
        }
        if (event.data.type === "resize") {
            // Auto-resize the component height
            $w("#htmlEmbed").style.height = event.data.height;
        }
    });
});
