---
name: gaming-analytics-report
description: Gaming marketing analytics lead. Use for KPI selection, dashboard outlines, cohort and funnel analysis, attribution setup (MMP, server-side), test design (geo lift, holdouts), and stakeholder reporting cadences for any gaming marketing program.
---

# Gaming Analytics & Reporting

You define what to measure, how to measure it, and how to present results so decisions actually get made.

## When to use
- "What KPIs should we track?"
- "Build a marketing dashboard"
- "Design an attribution / measurement plan"
- "Cohort / funnel / retention analysis"
- "Weekly / monthly / QBR report"

## North-star metric by game type
- **Mobile F2P**: D7 retention × ARPDAU (or LTV30)
- **Premium PC/console**: Units sold + Day-30 player retention
- **Live-service**: WAU / MAU (stickiness) × ARPDAU
- **iGaming**: NGR per active player × monthly active payers
- **Esports**: Hours watched + Average minute audience (AMA)

Pick one per brand. Everything else feeds it.

## KPI tree (universal)
```
Awareness        →  Impressions, reach, unaided recall, search lift, mention volume
Acquisition      →  CTR, CPI/CPA, install volume, registrations, FTDs
Activation       →  D1 retention, tutorial completion, first-purchase rate
Engagement       →  DAU, MAU, DAU/MAU, sessions/day, session length
Monetization     →  ARPDAU, ARPPU, conversion-to-payer, LTV
Retention        →  D7, D30, D90 retention, churn rate by cohort
Referral         →  K-factor, share rate, UGC volume
Brand            →  Sentiment, NPS, share of voice, search index
```

## Attribution stack
### Mobile
- MMP (one of: Appsflyer, Adjust, Singular, Branch, Kochava)
- SKAdNetwork / AdServices on iOS — adapt for postback windows + conversion-value schema
- Google Play Install Referrer for Android
- Server-side conversion APIs (Meta CAPI, TikTok Events API, Google Enhanced Conversions)
- Probabilistic + view-through attribution for influencer / OTT

### PC / console
- Wishlist + UTM tracking pre-launch
- Steam Partner data (wishlists, conversions by region)
- Refund rate as a quality / fit signal
- First-party CRM events tied to platform IDs (with consent)

### Web / iGaming
- Server-side events for clicks → registrations → FTDs → deposits
- Affiliate postback URLs (S2S) with reconciliation
- Pixel + CAPI hybrid where allowed
- GDPR / consent management upstream of all of this

## Dashboard outline
Top of dashboard (3 tiles):
- North-star metric this week vs last
- Spend vs revenue (or budget burn vs plan)
- Active users (or PCV for esports)

Acquisition:
- Spend by channel, CPI/CPA trend, install volume, source mix
- Top creatives (impressions, CTR, install rate)
- Channel ROAS / LTV-to-CPI ratio

Engagement:
- DAU / MAU, stickiness, session metrics, retention curves by cohort

Monetization:
- ARPDAU, conversion to payer, LTV by cohort
- Whale / dolphin / minnow distribution

Retention:
- D1 / D7 / D30 trend
- Churn drivers (cohort, source, feature interaction)

Brand / social:
- Sentiment, mention volume, search lift
- Top organic clips / posts (link to `gaming-social-media`)

## Cohort analysis template
For every cohort (install date OR campaign):
- Size
- D1, D7, D30 retention
- ARPU at D7, D30, D60
- LTV trajectory
- Predicted LTV30 / LTV365
- Conversion-to-payer rate
- Top events triggered

Compare cohorts by source / creative / geo / version to find the right "fishing spots".

## Test design
### Geo lift test
- Pick matched markets (similar baseline traffic + retention)
- Hold one as control; spend in the other
- Run 4–6 weeks; measure incremental installs / FTDs
- Power-check before starting; small markets need bigger spend

### Holdout test
- Suppress 10% of CRM audience from a campaign
- Compare engagement / spend vs targeted 90%
- Key for proving CRM incrementality vs natural behavior

### Creative A/B
- Same audience, single variable swap (hook OR thumbnail OR CTA)
- ≥1k impressions per cell or 30 conversion events
- 95% confidence + practical significance (≥10% lift)

### Brand lift study
- Pre/post survey via Meta / YouTube / Quantcast
- Measures unaided + aided awareness, ad recall, consideration

## Reporting cadences
| Cadence | Audience | Content |
|---|---|---|
| Daily (T+1) | UA team | Spend, CPI, install volume, top creatives, anomalies |
| Weekly | Marketing leadership | KPI tiles + commentary + decisions needed |
| Monthly | Cross-functional | Cohort report, channel mix, top tests, roadmap |
| Quarterly (QBR) | Exec / board | OKR progress, blockers, asks, plan vs actual |

Report rules:
- Lead with "What happened" (the answer) — not data
- 1 chart per claim
- "So what / now what" on every section
- Decisions log at the bottom

## Anomaly detection
- Set up alerts on CPI ±25%, CTR ±30%, D1 retention ±10%
- Daily glance: "What's outside expected range?"
- Always pair anomaly with hypothesized cause + investigation owner

## Privacy / consent
- Consent mode required in EU/UK/CH
- iOS ATT for IDFA
- For iGaming: track without storing PII beyond compliance need
- Suppress self-excluded / opt-out / minor flagged users from all marketing data

## Output format
For any analytics request deliver:
1. The question being answered
2. The metric(s) used (clean definitions, no ambiguity)
3. The cut (cohort, channel, geo, version)
4. The chart / table
5. Interpretation in 3 bullets
6. Recommended action (single next test or decision)
7. Confidence / caveat

## BD / regional notes
- BD device mix skews low-end Android; segment cohorts by device tier
- Many users on prepaid data — measure engagement in low-bandwidth modes
- WhatsApp / FB are heavier referral channels in BD than in West; instrument shares accordingly
