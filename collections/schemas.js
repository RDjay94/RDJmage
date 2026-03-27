// ─────────────────────────────────────────────────────────────
// BigTaka Content Network — Wix Data Collection Schemas
// ─────────────────────────────────────────────────────────────
// Create these collections in the Wix Editor under:
//   Content Manager > Create Collection
//
// These schemas document the field structure for each collection.

/**
 * Collection: "Articles"
 * Primary content collection for all articles (bilingual)
 *
 * Fields:
 *  _id             (Text)       — Auto-generated
 *  titleEn         (Text)       — English headline
 *  titleBn         (Text)       — Bengali headline
 *  slug            (Text)       — URL-friendly identifier (e.g., "virat-kohli-big-update")
 *  summaryEn       (Text)       — English summary (150-200 chars)
 *  summaryBn       (Text)       — Bengali summary
 *  bodyEn          (Rich Text)  — English full article body
 *  bodyBn          (Rich Text)  — Bengali full article body
 *  category        (Text)       — One of: cricket, casino, celebrity, viral
 *  tags            (Tags)       — Array of tag strings
 *  featuredImage   (Image)      — Main article image
 *  thumbnailImage  (Image)      — Smaller thumbnail for cards
 *  author          (Reference)  — Reference to Authors collection
 *  status          (Text)       — draft | published | archived
 *  isFeatured      (Boolean)    — Show in featured section
 *  isTrending      (Boolean)    — Show in trending section
 *  viewCount       (Number)     — Total page views
 *  readTimeMinutes (Number)     — Estimated read time
 *  publishDate     (Date)       — When the article goes live
 *  seoTitleEn      (Text)       — Custom SEO title (English)
 *  seoTitleBn      (Text)       — Custom SEO title (Bengali)
 *  seoDescEn       (Text)       — Custom meta description (English)
 *  seoDescBn       (Text)       — Custom meta description (Bengali)
 *  seoKeywords     (Text)       — Comma-separated keywords
 *  bigTakaLink     (URL)        — Optional BigTaka CTA link
 *  bigTakaCta      (Text)       — CTA button text
 *  _createdDate    (Date)       — Auto-generated
 *  _updatedDate    (Date)       — Auto-generated
 */

/**
 * Collection: "Authors"
 *
 * Fields:
 *  _id             (Text)       — Auto-generated
 *  nameEn          (Text)       — Author name in English
 *  nameBn          (Text)       — Author name in Bengali
 *  avatar          (Image)      — Author photo
 *  bioEn           (Text)       — Short English bio
 *  bioBn           (Text)       — Short Bengali bio
 *  role            (Text)       — e.g., "Editor", "Contributor"
 *  socialLinks     (Text)       — JSON string of social media links
 */

/**
 * Collection: "Categories"
 *
 * Fields:
 *  _id             (Text)       — Auto-generated
 *  categoryId      (Text)       — Unique key: cricket, casino, celebrity, viral
 *  nameEn          (Text)       — English display name
 *  nameBn          (Text)       — Bengali display name
 *  slug            (Text)       — URL slug
 *  descriptionEn   (Text)       — English description
 *  descriptionBn   (Text)       — Bengali description
 *  icon            (Text)       — Emoji or icon reference
 *  headerImage     (Image)      — Category banner image
 *  articleCount    (Number)     — Cached count of published articles
 */

/**
 * Collection: "Tags"
 *
 * Fields:
 *  _id             (Text)       — Auto-generated
 *  tagEn           (Text)       — English tag
 *  tagBn           (Text)       — Bengali tag
 *  slug            (Text)       — URL slug
 *  articleCount    (Number)     — Cached count
 */

/**
 * Collection: "SiteAnalytics"
 * Tracks article views and engagement for trending calculations
 *
 * Fields:
 *  _id             (Text)       — Auto-generated
 *  articleId       (Text)       — Reference to Articles._id
 *  viewDate        (Date)       — Date of view
 *  viewCount       (Number)     — Views on this date
 *  source          (Text)       — Traffic source (organic, facebook, telegram, direct)
 *  language        (Text)       — bn or en
 */

/**
 * Collection: "Backlinks"
 * Tracks BigTaka backlink placements
 *
 * Fields:
 *  _id             (Text)       — Auto-generated
 *  articleId       (Text)       — Reference to Articles._id
 *  anchorText      (Text)       — The clickable text
 *  targetUrl       (URL)        — BigTaka destination URL
 *  linkType        (Text)       — brand | soft | contextual
 *  placement       (Text)       — body | cta | sidebar
 */

export const COLLECTION_NAMES = {
    ARTICLES: "Articles",
    AUTHORS: "Authors",
    CATEGORIES: "Categories",
    TAGS: "Tags",
    ANALYTICS: "SiteAnalytics",
    BACKLINKS: "Backlinks",
};
