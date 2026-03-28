// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — HTTP Functions (REST API Endpoints)
// Accessible at: https://www.{your-site}.com/_functions/{endpoint}
// ─────────────────────────────────────────────────────────────
import { ok, notFound, badRequest, serverError } from "wix-http-functions";
import wixData from "wix-data";
import { generateSitemapData } from "backend/seo.jsw";

/**
 * GET /api/articles
 * Query params: category, page, limit, tag
 * Returns paginated article list
 */
export function get_articles(request) {
    const { category, page = "1", limit = "12", tag } = request.query;

    let query = wixData.query("Articles").eq("status", "published");

    if (category) query = query.eq("category", category);
    if (tag) query = query.hasSome("tags", [tag]);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    return query
        .descending("publishDate")
        .skip(skip)
        .limit(parseInt(limit))
        .find()
        .then((results) => {
            return ok({
                headers: { "Content-Type": "application/json" },
                body: {
                    articles: results.items.map(sanitizeArticle),
                    totalCount: results.totalCount,
                    page: parseInt(page),
                    hasNext: results.hasNext(),
                },
            });
        })
        .catch((error) => {
            return serverError({ body: { error: error.message } });
        });
}

/**
 * GET /api/article/{slug}
 * Returns a single article by slug
 */
export function get_article(request) {
    const slug = request.path[0];

    if (!slug) {
        return badRequest({ body: { error: "Slug is required" } });
    }

    return wixData
        .query("Articles")
        .eq("slug", slug)
        .eq("status", "published")
        .include("author")
        .find()
        .then((results) => {
            if (results.items.length === 0) {
                return notFound({ body: { error: "Article not found" } });
            }

            return ok({
                headers: { "Content-Type": "application/json" },
                body: sanitizeArticle(results.items[0]),
            });
        })
        .catch((error) => {
            return serverError({ body: { error: error.message } });
        });
}

/**
 * GET /api/trending
 * Returns trending articles
 */
export function get_trending(request) {
    const limit = parseInt(request.query.limit || "6");

    return wixData
        .query("Articles")
        .eq("status", "published")
        .eq("isTrending", true)
        .descending("viewCount")
        .limit(limit)
        .find()
        .then((results) => {
            return ok({
                headers: { "Content-Type": "application/json" },
                body: { articles: results.items.map(sanitizeArticle) },
            });
        })
        .catch((error) => {
            return serverError({ body: { error: error.message } });
        });
}

/**
 * GET /api/search?q=query
 * Search articles
 */
export function get_search(request) {
    const q = request.query.q;

    if (!q || q.length < 2) {
        return badRequest({ body: { error: "Query must be at least 2 characters" } });
    }

    return wixData
        .query("Articles")
        .eq("status", "published")
        .and(
            wixData.query("Articles")
                .contains("titleEn", q)
                .or(wixData.query("Articles").contains("titleBn", q))
                .or(wixData.query("Articles").contains("summaryEn", q))
                .or(wixData.query("Articles").contains("summaryBn", q))
        )
        .descending("publishDate")
        .limit(20)
        .find()
        .then((results) => {
            return ok({
                headers: { "Content-Type": "application/json" },
                body: {
                    articles: results.items.map(sanitizeArticle),
                    totalCount: results.totalCount,
                },
            });
        })
        .catch((error) => {
            return serverError({ body: { error: error.message } });
        });
}

/**
 * GET /api/sitemap
 * Returns sitemap data as JSON (convert to XML externally or use for indexing)
 */
export async function get_sitemap(request) {
    try {
        const urls = await generateSitemapData();
        return ok({
            headers: { "Content-Type": "application/json" },
            body: { urls },
        });
    } catch (error) {
        return serverError({ body: { error: error.message } });
    }
}

/**
 * GET /api/feed
 * RSS-style feed data for latest articles
 */
export function get_feed(request) {
    const lang = request.query.lang || "bn";
    const limit = parseInt(request.query.limit || "20");

    return wixData
        .query("Articles")
        .eq("status", "published")
        .descending("publishDate")
        .limit(limit)
        .find()
        .then((results) => {
            const items = results.items.map((article) => {
                const titleField = lang === "bn" ? "titleBn" : "titleEn";
                const summaryField = lang === "bn" ? "summaryBn" : "summaryEn";
                return {
                    title: article[titleField] || article.titleEn,
                    summary: article[summaryField] || article.summaryEn,
                    slug: article.slug,
                    category: article.category,
                    publishDate: article.publishDate,
                    image: article.featuredImage,
                };
            });

            return ok({
                headers: { "Content-Type": "application/json" },
                body: { items, lang },
            });
        })
        .catch((error) => {
            return serverError({ body: { error: error.message } });
        });
}

/**
 * GET /api/redtrack-postback
 * Receives postback/callback from RedTrack for conversion verification.
 * RedTrack can be configured to send postbacks to this endpoint
 * when a conversion is confirmed on the network side.
 *
 * Query params: clickid, status, payout, currency
 */
export function get_redtrackPostback(request) {
    const { clickid, status, payout, currency } = request.query;

    if (!clickid) {
        return badRequest({ body: { error: "clickid is required" } });
    }

    // Log the postback for reconciliation
    return wixData
        .insert("RedTrackPostbacks", {
            clickId: clickid,
            status: status || "approved",
            payout: payout ? parseFloat(payout) : 0,
            currency: currency || "USD",
            receivedAt: new Date(),
        })
        .then(() => {
            return ok({
                headers: { "Content-Type": "application/json" },
                body: { success: true },
            });
        })
        .catch((error) => {
            return serverError({ body: { error: error.message } });
        });
}

// ── Helper ──────────────────────────────────────────────────

function sanitizeArticle(article) {
    return {
        _id: article._id,
        slug: article.slug,
        titleEn: article.titleEn,
        titleBn: article.titleBn,
        summaryEn: article.summaryEn,
        summaryBn: article.summaryBn,
        bodyEn: article.bodyEn,
        bodyBn: article.bodyBn,
        category: article.category,
        tags: article.tags,
        featuredImage: article.featuredImage,
        thumbnailImage: article.thumbnailImage,
        author: article.author
            ? { nameEn: article.author.nameEn, nameBn: article.author.nameBn, avatar: article.author.avatar }
            : null,
        viewCount: article.viewCount,
        readTimeMinutes: article.readTimeMinutes,
        publishDate: article.publishDate,
        isFeatured: article.isFeatured,
        isTrending: article.isTrending,
    };
}
