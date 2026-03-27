# BigTaka Content Network — Wix Velo Codebase

Bangladesh-focused bilingual (Bengali + English) content website built with Wix Velo.

## Project Structure

```
RDJmage/
├── pages/                    # Page-specific Velo code
│   ├── masterPage.js         # Site-wide code (runs on every page)
│   ├── Home.js               # Homepage (featured, trending, categories)
│   ├── Article.js            # Article dynamic page
│   ├── Category.js           # Category listing page
│   └── Search.js             # Search results page
├── backend/                  # Server-side code (secure)
│   ├── content.jsw           # Content query API
│   ├── analytics.jsw         # View tracking & trending calculations
│   ├── seo.jsw               # SEO utilities (sitemap, schema)
│   ├── claude-api.jsw        # Claude AI integration (translation, rewriting)
│   ├── http-functions.js     # REST API endpoints
│   └── jobs.config           # Scheduled jobs configuration
├── public/                   # Shared frontend code
│   ├── config.js             # Site configuration & UI labels
│   └── helpers.js            # Utility functions
├── collections/              # Data collection schemas
│   └── schemas.js            # Field definitions for all collections
└── styles/                   # Design reference
    └── theme.js              # Colors, fonts, spacing constants
```

## Setup Instructions

### 1. Enable Wix Velo

1. Open your site in the **Wix Editor**
2. Click **Dev Mode** → **Turn on Dev Mode**
3. You'll see the code panel at the bottom

### 2. Create Data Collections

In the Wix Editor, go to **Content Manager** → **Create Collection** and create:

| Collection | Purpose |
|---|---|
| `Articles` | All bilingual articles with SEO fields |
| `Authors` | Content writers/editors |
| `Categories` | Category metadata |
| `Tags` | Article tags |
| `SiteAnalytics` | View tracking data |
| `Backlinks` | BigTaka link placements |

See `collections/schemas.js` for complete field definitions.

### 3. Add Code to Wix

**Option A: Copy-paste (Quick)**
- Copy each file's content into the corresponding Wix code panel
- `masterPage.js` → Site tab in the code panel
- Page files → Select each page's code tab
- Backend files → Backend section in the file tree
- Public files → Public section in the file tree

**Option B: Git Integration (Recommended)**
1. In Wix Studio, go to **Settings** → **Git Integration**
2. Connect this GitHub repo
3. Code syncs automatically

### 4. Set Up Wix Editor Elements

Each page needs specific elements with matching IDs. Create these in the drag-and-drop editor:

#### Site Header (masterPage)
- `#brandLogo` — Image: BigTaka logo
- `#navHome` — Button: Home link
- `#nav_cricket`, `#nav_casino`, `#nav_celebrity`, `#nav_viral` — Buttons: Category nav
- `#langToggleBtn` — Button: Language switcher
- `#searchInput` — Text Input: Search box
- `#searchBtn` — Button: Search trigger
- `#mobileMenuBtn` — Button: Mobile hamburger menu
- `#mobileMenu` — Container: Mobile navigation

#### Homepage
- `#heroImage`, `#heroTitle`, `#heroSummary`, `#heroCategory`, `#heroDate`, `#heroLink` — Hero section
- `#featuredRepeater` — Repeater with: `#featuredItemImage`, `#featuredItemTitle`, `#featuredItemSummary`, `#featuredItemDate`, `#featuredItemLink`
- `#trendingRepeater` — Repeater with: `#trendingImage`, `#trendingItemTitle`, `#trendingCategory`, `#trendingViews`, `#trendingItemLink`
- `#categoryRepeater` → nested `#catArticleRepeater`
- `#latestRepeater` — Repeater with: `#latestImage`, `#latestItemTitle`, `#latestItemSummary`, `#latestItemCategory`, `#latestItemDate`, `#latestItemAuthor`, `#latestItemLink`
- `#loadMoreBtn` — Button

#### Article Page
- `#articleTitle`, `#articleBody`, `#articleSummary`, `#articleImage`
- `#articleCategory`, `#articleDate`, `#readTime`, `#viewCount`
- `#authorName`, `#authorAvatar`, `#authorBio`
- `#tagsRepeater` with `#tagLabel`, `#tagLink`
- `#relatedRepeater` with `#relatedImage`, `#relatedItemTitle`, `#relatedItemDate`, `#relatedItemLink`
- `#shareFacebook`, `#shareTwitter`, `#shareTelegram`, `#shareWhatsapp`
- `#bigTakaCTA`, `#bigTakaCtaText` — BigTaka promotion
- `#breadcrumbHome`, `#breadcrumbCategory`, `#breadcrumbTitle`

#### Footer
- `#footerAboutTitle`, `#footerAboutText`
- `#footerLinksTitle`, `#footerFollowTitle`, `#footerCopyright`
- `#socialFacebook`, `#socialTelegram`, `#socialYoutube`

### 5. Configure Secrets

In Wix Editor: **Dev Mode** → **Secrets Manager** → Add:

| Secret Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Claude API key (from console.anthropic.com) |

### 6. Set Up Scheduled Jobs

In the Wix Editor, configure:
- **Update Trending**: Run `updateTrendingFlags()` every 3 hours
- See `backend/jobs.config` for details

### 7. Configure SEO

1. Set up **URL routing** for bilingual paths: `/{lang}/article/{slug}`
2. Enable **hreflang** tags (handled automatically by the code)
3. Submit sitemap to Google Search Console

## Features

- **Bilingual**: Full Bengali + English support with one-click switching
- **SEO Optimized**: Schema markup, hreflang, meta tags, sitemap generation
- **AI Powered**: Claude API for content translation, rewriting, headline generation
- **Analytics**: Built-in view tracking and trending calculation
- **REST API**: External access via HTTP functions
- **BigTaka Integration**: Soft CTA placements and backlink tracking
- **Mobile First**: Responsive design with mobile menu support

## Content Categories

| Category | Focus |
|---|---|
| Cricket News | IPL, BPL, ICC, match predictions, player highlights |
| Casino & Gaming | BD gaming trends, platform reviews, strategy guides |
| Celebrity & Entertainment | BD celebrities, viral personalities, trending stories |
| Worldwide Viral | Global trending topics, clickbait-style viral content |

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /_functions/articles` | List articles (params: category, page, limit, tag) |
| `GET /_functions/article/{slug}` | Get single article |
| `GET /_functions/trending` | Get trending articles |
| `GET /_functions/search?q=query` | Search articles |
| `GET /_functions/sitemap` | Sitemap data |
| `GET /_functions/feed?lang=bn` | RSS-style feed |
