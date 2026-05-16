# Gaming Marketing Skills — Team Roster

This `.claude/skills/` directory is your in-repo gaming marketing team. Claude Code auto-discovers each subfolder's `SKILL.md` and offers it to invoke when its description matches what you're asking for.

## How to use
- **Orchestrator first.** For anything that crosses disciplines ("launch this game", "build a campaign", "we're shipping a season"), invoke `/gaming-marketing-team`. It routes to the right specialists and assembles one deliverable.
- **Specialist directly.** For single-discipline work, call the specialist (e.g. `/gaming-social-media` for a content calendar).
- **Ad hoc.** You don't have to type slash commands — describe what you need and Claude will pick the matching skill from the descriptions.

## Roster

| Skill | What it does |
|---|---|
| `gaming-marketing-team` | Orchestrator — routes to specialists, assembles full deliverables |
| `gaming-marketing-strategy` | Strategy, audience, positioning, OKRs, budget |
| `gaming-launch-playbook` | Pre-launch → launch → live-ops timeline |
| `gaming-social-media` | TikTok / X / IG / YT Shorts calendars, hooks, scripts |
| `gaming-community-manager` | Discord, Reddit, forums, AMAs, moderation |
| `streamer-influencer-outreach` | Twitch / YT / TikTok creator deals & briefs |
| `gaming-press-release` | Press releases, embargoes, EPK, journalist outreach |
| `gaming-ad-copy` | Meta / Google / TikTok / Reddit paid ad copy + UA |
| `app-store-optimization` | Play Store + App Store listings, keywords, A/B tests |
| `gaming-seo-content` | SEO articles, guides, tier lists, patch summaries |
| `gaming-trailer-script` | Reveal / gameplay / launch / esports trailer scripts |
| `esports-event-marketing` | Tournament marketing, watch parties, sponsorships |
| `casino-gaming-marketing` | iGaming / casino / sportsbook — compliance-first |
| `gaming-analytics-report` | KPIs, dashboards, cohorts, test design, reports |
| `gaming-crisis-comms` | Outages, breaches, controversies, post-mortems |
| `gaming-viral-content` | Memes, hooks, trends, share-engineered content |
| `gaming-brand-voice` | Voice / tone guide, copy audits, channel adaptation |

## Defaults

All skills assume the BigTaka brand context unless told otherwise:
- Bilingual EN + BN (Bengali), BD-first audience
- Cricket, casino & gaming, celebrity, viral content verticals
- Wix Velo backend; Claude API translation pipeline already in `backend/claude-api.jsw`
- iGaming work defaults to legal / informational / responsible-play framing for the BD market

Override any default by saying so in your request (e.g. "for a US mobile RPG launch", "in Spanish for LATAM").

## Editing the team

These are plain markdown files. Edit any `SKILL.md` directly to tune voice, add templates, or change defaults. Commit your changes and the whole team levels up across every Claude Code session in this repo.
