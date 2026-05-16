---
name: gaming-launch-playbook
description: Game launch producer. Use for full pre-launch → launch → post-launch (live-ops) timelines, milestone checklists, and cross-team coordination plans for any game, season, or major update.
---

# Game Launch Playbook

Produce a launch timeline + checklist for any game release, season pass, expansion, or major update.

## When to use
- "Build me a launch plan for X"
- "What should we do 60 days before release?"
- "How do we ship a season / expansion?"
- "Post-launch live-ops calendar?"

## Master timeline (default for a mid-budget title)

### T-90 days — Reveal & Wishlist phase
- Lock positioning + 3 key art assets
- Reveal trailer (use `gaming-trailer-script`)
- Open wishlist / pre-reg pages (Steam, Play Store, App Store, Epic)
- Set up Discord + subreddit + official forum
- Press list build + outreach plan (use `gaming-press-release`)
- ASO baseline listings live (use `app-store-optimization`)
- Brand site / landing page with email capture
- Begin influencer scouting (use `streamer-influencer-outreach`)

### T-60 days — Demand build
- Closed beta / playtest (NDA-able if needed)
- Press preview embargo briefings
- Creator preview gifting wave 1 (mid-tier)
- Social calendar locked (use `gaming-social-media`)
- First paid teaser flight (low spend, learning)
- FAQ + media kit published

### T-30 days — Crescendo
- Gameplay deep-dive trailer
- Open beta / demo (if planned)
- Press review embargo set (typically T-7 to T-2)
- Top-tier creator wave 2 (paid integrations)
- UA campaign creative production wrap
- Community AMA / dev livestream
- Pre-order incentives finalized

### T-14 → T-0 — Launch window
- Day-1 patch QA + release-ready
- 24/7 support rota set
- Crisis comms playbook armed (use `gaming-crisis-comms`)
- Review embargo lifts
- Launch trailer goes live
- All paid channels active
- Creator livestream marathon
- Launch-day social storm: pinned tweet, Discord events, store-page banner
- Server / matchmaking war room

### T+1 → T+14 — Stabilize
- Daily metrics review (DAU, crash rate, store rating, refund rate)
- Reply to first 100 reviews on each store
- "Thank you" content + roadmap teaser
- Patch notes cadence locked
- Hotfix comms templates ready

### T+15 → T+90 — Sustain
- First seasonal event / content drop
- Re-engagement push to lapsed installers (CRM + push)
- Creator wave 3: long-tail / niche
- UGC contest #1
- Retention cohort analysis report
- Begin Season 2 / next-update planning

### T+90 → ongoing — Live ops cadence
- Monthly: small content drop + community spotlight
- Quarterly: season / expansion + paid spike
- Annual: anniversary event + retrospective

## Milestone checklist (universal)
Each milestone must hit:
- [ ] Creative assets locked & QA'd in every aspect ratio (1:1, 9:16, 16:9, 4:5)
- [ ] Localized strings approved (default: EN + BN; add markets as needed)
- [ ] Store listings updated everywhere (Steam, Play, App Store, Epic, Console)
- [ ] PR briefed + embargo terms set
- [ ] Paid creative trafficked + tracking pixels live
- [ ] Community announcement queued (Discord + Reddit + forums + X)
- [ ] Analytics events instrumented and confirmed firing
- [ ] Customer support runbook + macro responses ready
- [ ] Legal/compliance sign-off (esp. iGaming, sweepstakes, minor-safe)
- [ ] Rollback plan documented

## RACI snapshot
Provide a default R/A/C/I across these roles when asked: Marketing lead, Producer, PR, Community, UA, Creative, Devops, Customer Support, Legal.

## Output format
1. Timeline table (date column + milestone + owner placeholder)
2. Checklist per milestone
3. Risks + mitigations list
4. KPI targets per phase (link to `gaming-analytics-report`)
5. Comms calendar (1 line per surface per week)

## Customize by genre
- **Hyper-casual mobile**: compress timeline to T-30 → T+30. UA-first.
- **Live-service**: emphasize seasons; no real "launch", it's recurring beats.
- **Premium PC/console**: heavy on press review embargo + day-1 patch.
- **iGaming**: legal/jurisdictional approval BEFORE any T-90 step. See `casino-gaming-marketing`.
