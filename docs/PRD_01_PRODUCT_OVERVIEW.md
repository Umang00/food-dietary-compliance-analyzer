# PRODUCT REQUIREMENTS DOCUMENT
## Food Dietary Compliance Analyzer

**Document Version:** 1.0  
**Date:** January 2, 2026  
**Status:** 🟢 Approved for Development  
**Project Timeline:** 4 weeks (Jan 2 - Jan 29, 2026)

---

## DOCUMENT SUITE

This PRD is divided into 5 documents for clarity:

1. **PRD 01: Product Overview** (This Document)
   - Vision, goals, target users, success metrics

2. **PRD 02: Technical Architecture**
   - Tech stack, system design, LLM integration, cost analysis

3. **PRD 03: User Experience & Flows**
   - Screens, user journeys, interaction patterns

4. **PRD 04: API Specifications**
   - Endpoints, request/response formats, authentication

5. **PRD 05: Data Models & Policies**
   - Database schema, image retention, privacy compliance

---

## TABLE OF CONTENTS

1. Executive Summary
2. Problem Statement
3. Target Users
4. Product Vision
5. Core Value Proposition
6. Success Metrics (KPIs)
7. Product Scope (MVP vs Post-MVP)
8. User Stories
9. Non-Goals (Out of Scope)
10. Risks & Mitigations
11. Go-to-Market Strategy
12. Competitive Landscape

---

## 1. EXECUTIVE SUMMARY

### What We're Building

A mobile-first dietary compliance analyzer that helps users following **Jain, Vaishnava, Swaminarayan, and Vegan diets** instantly verify if packaged food products align with their religious and ethical dietary restrictions.

### The Core Problem

Religious communities (especially diaspora and travelers) struggle to verify food products in foreign countries due to:
- **Language barriers** (ingredients labels in unfamiliar languages)
- **Ambiguous ingredients** (E-numbers, "natural flavoring", regional variations)
- **Complex dietary rules** (80-100 restrictions in Jain diet alone)
- **Time pressure** (standing in store aisle trying to decode labels)

### Our Solution

**Scan → Analyze → Verdict in 2 seconds**

1. User scans ingredient label with phone camera
2. Multi-tier AI (Gemini 3 Flash → GPT-5.2) analyzes against community-specific rules
3. Clear verdict: SAFE ✅, UNSAFE ❌, CAUTION ⚠️, UNCERTAIN ❓
4. Detailed reasoning with confidence score

### Key Innovation

**Community-specific intelligence**: Not generic "vegetarian" scanning, but deep knowledge of:
- Jain rules (no onion, garlic, root vegetables, specific E-numbers)
- Vaishnava rules (sattvic diet, no mushrooms, no caffeine)
- Swaminarayan rules (strict purity, specific vegetables forbidden)
- User customization ("Jain but OK with potatoes")

### Why Now?

1. **LLM Vision Capabilities** (2024-2026): Gemini 3 Flash can accurately read ingredient labels
2. **Diaspora Growth**: 17M+ Indians abroad, increasing demand for dietary compliance tools
3. **Religious Tourism**: Travelers need instant verification in foreign stores
4. **Cost Reduction**: LLM API costs dropped 90% (2023: $0.01/image → 2026: $0.001/image)

### Business Model (Post-MVP)
**Freemium Model (Post-MVP - Month 3):**

Free Tier:
- 10 scans per month
- Access to scan history (30 days)
- Basic support

Premium Tier ($0.99/month):
- Unlimited scans
- Lifetime scan history
- Priority support
- Early access to new features

**Pricing Rationale:**
- $0.99/month = impulse purchase price
- Lower than coffee ($3-5)
- Monthly vs annual (easier commitment)
- Re-evaluate based on user feedback

**Break-even:**
- Monthly costs at 1K users: ~$45
- Need: 46 paid users ($45 / $0.99)
- Target: 10% conversion = 100 paid users = $99/month revenue

---

## 2. PROBLEM STATEMENT

### The Pain Points (User Research)

**Primary User: Ravi (Jain, lives in London)**

> "I spend 20 minutes in Tesco trying to figure out if E471 is plant-based or animal-based. Even if I Google it, I get conflicting answers. I usually just skip products I'm unsure about, which means I eat the same 5 things repeatedly."

**Pain Point Breakdown:**

| Pain Point | Current Behavior | Impact | Frequency |
|------------|------------------|---------|-----------|
| **Language barriers** | Use Google Translate on phone | 5-10 min per product | Every shopping trip |
| **E-numbers ambiguity** | Google each E-number | 3-5 min per E-number | 2-3 times per trip |
| **Regional variations** | Call manufacturer | Often not possible | Weekly |
| **Mistakes** | Accidentally consume forbidden items | Religious distress | 2-3 times/year |
| **Decision fatigue** | Give up and buy familiar brands only | Limited diet variety | Constant |

### Quantifying the Problem

**Market Research Data:**

```
Target Population:
- Jain community globally: ~6-8 million
- Strict practicing Jains: ~2-3 million
- Jains living abroad (diaspora): ~500K-1M
- Vaishnava (ISKCON): ~1M globally
- Swaminarayan: ~2M followers

Total Addressable Market (TAM): ~4-6M users
Serviceable Addressable Market (SAM): ~1-2M (diaspora + travelers)
Serviceable Obtainable Market (SOM): ~10K users (Year 1 target)
```

**Current Alternatives (and Why They Fail):**

1. **Manual Label Reading**
   - ❌ Time-consuming (5-20 minutes per product)
   - ❌ Error-prone (miss hidden ingredients)
   - ❌ Language barriers

2. **Generic Food Scanner Apps (Yuka, MyFitnessPal)**
   - ❌ No religious diet support
   - ❌ Focus on nutrition, not compliance
   - ❌ Don't understand E-number sources

3. **Community WhatsApp Groups**
   - ❌ Slow response time (hours/days)
   - ❌ Inconsistent answers
   - ❌ No source verification

4. **Manufacturer Websites**
   - ❌ Often incomplete ingredient lists
   - ❌ Regional variations not documented
   - ❌ Time-consuming to navigate

### Why This Matters

**Religious Significance:**
- Dietary compliance is core to spiritual practice
- Accidental violation causes religious guilt
- Community reputation matters

**Practical Impact:**
- Limited food choices → Nutritional deficiencies
- Anxiety around food shopping → Stress
- Time wasted → Opportunity cost

**Emotional Toll:**
> "I accidentally ate something with onion powder once. I felt spiritually impure and had to perform atonement. I don't trust myself anymore when shopping." - Survey Respondent

---

## 3. TARGET USERS

### Primary Personas

#### **Persona 1: Ravi (The Diaspora Professional)**

**Demographics:**
- Age: 28-35
- Location: London, UK
- Occupation: Software Engineer
- Income: £60K/year
- Tech-savvy: High

**Background:**
- Born in India (Gujarat), moved to UK for work (3 years ago)
- Strict Jain upbringing, maintains practices abroad
- Lives in area with limited Indian grocery stores

**Dietary Needs:**
- Jain diet (no onion, garlic, root vegetables except carrots/potatoes)
- Lactovegetarian (consumes dairy)
- Allergies: None

**Current Pain:**
- Spends 30-45 min per shopping trip verifying products
- Relies on 10-15 "trusted" products repeatedly
- Anxious about hidden ingredients (E-numbers)

**Goals:**
- Shop confidently in mainstream UK supermarkets
- Expand food variety without compromising beliefs
- Quick verification (under 1 minute per product)

**Tech Usage:**
- iPhone 14 Pro
- Uses apps daily (banking, food delivery, meditation)
- Comfortable with phone camera apps

**Quote:**
> "I want to walk into Sainsbury's and scan products like I scan QR codes - instant answers, no second-guessing."

---

#### **Persona 2: Priya (The Religious Tourist)**

**Demographics:**
- Age: 45-55
- Location: Mumbai, India (travels frequently)
- Occupation: Business Owner
- Income: ₹25L/year
- Tech-savvy: Medium

**Background:**
- Vaishnava (ISKCON devotee)
- Travels to Europe/US for business 3-4 times/year
- Struggles with food options abroad

**Dietary Needs:**
- Sattvic diet (no onion, garlic, mushrooms, eggs)
- No caffeine
- Prasadam (food offered to deity) preferred

**Current Pain:**
- Limited to Indian restaurants abroad (expensive, time-consuming)
- Carries own food on flights (inconvenient)
- Uncertain about ingredients in foreign products

**Goals:**
- Find compliant products in foreign supermarkets
- Reduce reliance on restaurants
- Share findings with community

**Tech Usage:**
- Android phone (Samsung Galaxy)
- Uses WhatsApp extensively
- Learning to use apps (not native)

**Quote:**
> "I want something as simple as Google Translate but for food. Just point and it tells me yes or no."

---

#### **Persona 3: Arjun (The Young Practitioner)**

**Demographics:**
- Age: 18-25
- Location: Toronto, Canada (student)
- Occupation: University Student
- Income: Part-time job ($15K/year)
- Tech-savvy: Very High

**Background:**
- Born in Canada, parents are Swaminarayan followers
- Maintains religious practices to honor family
- Lives in dorms with meal plan (limited options)

**Dietary Needs:**
- Swaminarayan diet (lacto-vegetarian, no onion/garlic, no eggplant)
- Flexible on some restrictions (modern interpretation)
- Budget-conscious

**Current Pain:**
- Campus dining doesn't cater to specific diets
- Grocery shopping on tight budget
- Wants to maintain practices but feels isolated

**Goals:**
- Quick verification at grocery stores
- Affordable food options that comply
- Connect with others following similar diets

**Tech Usage:**
- iPhone 13 (hand-me-down)
- Heavy social media user (Instagram, TikTok)
- Expects instant, mobile-first experiences

**Quote:**
> "I don't have time to read every label. I need an app that works as fast as Snapchat - snap, answer, done."

---

### Secondary Personas

#### **Persona 4: Dr. Mehta (The Health-Conscious Parent)**

**Use Case:** Vegan + Jain diet for health reasons (not strictly religious)

**Key Difference:** 
- Motivated by health, not just religion
- More flexible on "grey area" ingredients
- Wants nutritional info alongside compliance

---

#### **Persona 5: Community Leader (Temple Organizer)**

**Use Case:** Bulk verification for temple prasadam preparation

**Key Difference:**
- Needs batch scanning (10+ products at once)
- Requires highest confidence (religious responsibility)
- Willing to pay premium for accuracy

---

### User Segmentation

| Segment | % of TAM | Priority | Monetization Potential |
|---------|----------|----------|----------------------|
| **Diaspora Professionals** | 35% | 🔴 High | High ($0.99-2.99/month) |
| **Religious Tourists** | 25% | 🟡 Medium | Medium (occasional use) |
| **Young Practitioners** | 20% | 🟡 Medium | Low (students, price-sensitive) |
| **Health-Conscious** | 15% | 🟢 Low | High (premium features) |
| **Community Leaders** | 5% | 🟢 Low | Very High (B2B potential) |

**MVP Focus:** Personas 1-3 (80% of market)

---

## 4. PRODUCT VISION

### Vision Statement (3-5 Years)

**"Empower every person to eat according to their beliefs, anywhere in the world."**

### Mission Statement

Make dietary compliance **instant, accurate, and accessible** for religious and ethical communities through AI-powered food intelligence.

### North Star Metric

**"Number of confident food purchases enabled per month"**

Why this metric?
- Measures actual value delivered (not just app opens)
- Correlates with user satisfaction
- Drives retention (users keep scanning)

---

## 5. CORE VALUE PROPOSITION

### For Users

**Before our app:**
> "I spend 20 minutes per product, still uncertain, and often give up."

**After our app:**
> "I scan in 2 seconds, get a clear answer with 94% confidence, and shop with peace of mind."

### Value Pillars

1. **Speed**: 2-second scan → instant verdict
2. **Accuracy**: 94%+ confidence with multi-tier AI analysis
3. **Trust**: Transparent reasoning ("E631 is fish-derived in India")
4. **Customization**: "Jain but OK with potatoes"
5. **Community**: Built for specific religious communities, not generic

### Unique Selling Points (USPs)

| Feature | Us | Competitors | Advantage |
|---------|-----|-------------|-----------|
| **Community-Specific** | ✅ Jain, Vaishnava, Swaminarayan, Vegan | ❌ Generic "vegetarian" | Deep rule understanding |
| **Regional Intelligence** | ✅ E631 source varies by country | ❌ Generic E-number database | Accurate for travel |
| **User Exceptions** | ✅ "Jain but OK with potatoes" | ❌ Rigid categories | Real-world flexibility |
| **Confidence Scores** | ✅ 94% confidence shown | ❌ Binary yes/no | Builds trust |
| **Multi-Tier AI** | ✅ Escalates uncertain cases | ❌ Single AI pass | Higher accuracy |

---

## 6. SUCCESS METRICS (KPIs)

North Star Metric: "High-Confidence Scans Delivered per Month"

Calculation: Number of scans where we provide actionable verdict (confidence ≥70%)

Sub-metrics:
1. Scans with confidence ≥90% (High confidence)
2. Scans with confidence 70-89% (Medium confidence)
3. Scans with confidence <70% (Low confidence - needs improvement)

Target (Month 3): 
- 80% of scans achieve ≥70% confidence
- 60% of scans achieve ≥90% confidence

---

### Primary Metrics

#### **Acquisition Metrics**

| Metric | Week 1 | Month 1 | Month 3 | Month 6 |
|--------|--------|---------|---------|---------|
| **App Downloads** | 50 | 200 | 1,000 | 5,000 |
| **Sign-ups** | 40 | 150 | 800 | 4,000 |
| **Conversion (Download→Signup)** | 80% | 75% | 80% | 80% |

**Channels:**
- Community outreach (WhatsApp groups, temples)
- Word of mouth
- Diaspora forums (Reddit, Facebook groups)

---

#### **Activation Metrics**

| Metric | Target (Week 1) | Target (Month 1) |
|--------|-----------------|------------------|
| **Onboarding Completion** | 70% | 75% |
| **First Scan within 24 hours** | 60% | 65% |
| **First Scan within 7 days** | 80% | 85% |

**Why These Matter:**
- Onboarding completion = User understands app
- First scan = Core value delivered
- Time-to-first-scan = Activation speed

---

#### **Engagement Metrics**

| Metric | Week 1 | Month 1 | Month 3 |
|--------|--------|---------|---------|
| **Daily Active Users (DAU)** | 20 | 80 | 400 |
| **Weekly Active Users (WAU)** | 35 | 140 | 700 |
| **DAU/MAU Ratio** | 50% | 57% | 57% |
| **Avg Scans per User per Week** | 2 | 3 | 4 |
| **Session Length** | 1 min | 1.5 min | 2 min |

**Benchmarks:**
- Food apps: DAU/MAU = 40-50%
- Utility apps: DAU/MAU = 50-60%
- Target: 57% (upper end of utility apps)

---

#### **Retention Metrics**

| Metric | Target (Week 1) | Target (Month 1) | Target (Month 3) |
|--------|-----------------|------------------|------------------|
| **Day 1 Retention** | 70% | 75% | 80% |
| **Day 7 Retention** | 40% | 45% | 50% |
| **Day 30 Retention** | - | 30% | 35% |

**Why These Targets:**
- Day 1: Did user find value immediately?
- Day 7: Did user form habit?
- Day 30: Is app solving real ongoing need?

**Retention Drivers:**
- Regular grocery shopping (weekly habit)
- Building scan history (investment)
- Trust in accuracy (repeat usage)

---

#### **Quality Metrics**

| Metric | Target | How We Measure |
|--------|--------|----------------|
| **AI Accuracy** | 94%+ | Manual review of 100 scans/week |
| **Confidence Score Reliability** | 90%+ | High confidence (≥90%) should = 98% accurate |
| **False Positive Rate** | <3% | Says "SAFE" but actually unsafe |
| **False Negative Rate** | <5% | Says "UNSAFE" but actually safe |
| **Average Response Time** | <3 sec | Server logs |
| **App Crash Rate** | <0.1% | Sentry error tracking |

**Quality > Speed:**
- False positives are CRITICAL (religious violation)
- False negatives are acceptable (user stays safe but misses products)
- Bias toward caution when uncertain

---

#### **Monetization Metrics (Post-MVP)**

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| **Free to Paid Conversion** | 5% | 10% | 15% |
| **Monthly Recurring Revenue (MRR)** | $40 | $400 | $1,500 |
| **Customer Acquisition Cost (CAC)** | $0 (organic) | $2 | $5 |
| **Lifetime Value (LTV)** | $12 | $18 | $24 |
| **LTV:CAC Ratio** | ∞ | 9:1 | 4.8:1 |

**Monetization Strategy:**
- Freemium: 10 free scans/month
- Premium: $0.99/month (unlimited scans)
- Target: 10% conversion rate by Month 6

---

### Secondary Metrics

#### **User Satisfaction**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Net Promoter Score (NPS)** | 60+ | In-app survey (Month 1, 3, 6) |
| **App Store Rating** | 4.5+ ⭐ | iOS App Store / Google Play |
| **Customer Support Tickets** | <5% of users | Support system |
| **Feature Request Submissions** | 10+ per month | In-app feedback |

---

#### **Community Metrics**

| Metric | Target (Month 3) | Measurement |
|--------|------------------|-------------|
| **User-Generated Content** | 20 posts/month | Social media mentions |
| **Referrals** | 15% of sign-ups | Referral tracking |
| **Community Engagement** | 50 comments/month | In-app + social |

---

### Instrumentation Plan

**Tools:**
- **PostHog** (analytics, feature flags): $0 (1M events/month free)
- **Sentry** (error tracking): $0 (5K errors/month free)
- **Mixpanel** (alternative if PostHog insufficient): Backup plan

**Events to Track:**

```javascript
// Acquisition
analytics.track('app_downloaded', { source, campaign });
analytics.track('signup_started', { method: 'google' | 'email' });
analytics.track('signup_completed', { community, method });

// Activation
analytics.track('onboarding_screen_viewed', { screen_number });
analytics.track('onboarding_completed', { duration_seconds, community });
analytics.track('first_scan_started', { hours_since_signup });
analytics.track('first_scan_completed', { verdict, confidence });

// Engagement
analytics.track('scan_initiated', { scan_count, session_number });
analytics.track('scan_completed', {
  verdict, confidence, tier_used, scan_duration, images_count
});
analytics.track('history_viewed', { total_scans });
analytics.track('scan_details_viewed', { scan_id, verdict });

// Quality
analytics.track('error_reported', { scan_id, error_type, user_comment });
analytics.track('re_scan_requested', { original_scan_id });

// Retention
analytics.track('app_opened', { days_since_last_open, total_opens });
analytics.track('push_notification_received', { type });
analytics.track('push_notification_clicked', { type });
```

---

## 7. PRODUCT SCOPE (MVP vs POST-MVP)

### MVP (4 Weeks - Jan 2 to Jan 29, 2026)

**Core Features INCLUDED:**

✅ **Authentication**
- Email + password signup/login
- Google OAuth
- BetterAuth integration

✅ **Onboarding (10 screens)**
- Community selection (Jain, Vaishnava, Swaminarayan, Vegan)
- 5 category screens for restrictions
- Allergies input
- User exceptions ("Jain but OK with potatoes")
- Summary screen

✅ **Camera Scanning**
- Multi-image support (1-3 photos)
- Client-side compression (1200x1600, 70% JPEG)
- Framing guide overlay
- Flash toggle

✅ **AI Analysis**
- Tier 1: Gemini 3 Flash (High Confidence: ≥90% → Return Tier 1 result immediately)
- Tier 2: GPT-5.2 (escalation for Medium Confidence: 70-89% or Low Confidence: <70%)
- Confidence scoring (High ≥90%, Medium 70-90%, Low <70%)
- Search integration (Gemini Grounding first, Tavily backup)

✅ **Results Display**
- Clear verdict (SAFE, UNSAFE, CAUTION, UNCERTAIN)
- Confidence score
- Ingredient breakdown
- Reasoning explanation
- Report error button
- Re-scan option

✅ **Scan History**
- List view (grouped by date)
- Search functionality
- Filter by verdict/date
- Detail view for each scan

✅ **Profile & Settings**
- View account info
- Edit dietary preferences
- Change password
- Delete account
- Download data (GDPR)
- Delete scan history
- Notification preferences
- Permission management (camera, location)
- Contact support
- Report bug
- Suggest feature
- FAQs

✅ **Backend Infrastructure**
- Node.js + Express + TypeScript
- PostgreSQL (Supabase)
- Backblaze B2 (image retention 90 days)
- Rate limiting (10 scans/min per user, 100/min global)
- Error tracking (Sentry)
- Analytics (PostHog)

✅ **Notifications**
- Email notifications (Brevo): Account verification, password reset

---

### MVP Features EXCLUDED (Postponed to Post-MVP)

❌ **NOT in MVP:**

| Feature | Why Excluded | Post-MVP Priority |
|---------|--------------|-------------------|
| **Barcode Scanning** | Low coverage in India/Asia (40%), regional variants | Phase 1.1 (Month 2) |
| **Favorites** | No clear use case yet | Phase 2 (Month 3) |
| **Offline Mode** | Requires local LLM (not feasible) | Phase 3 (Month 6) |
| **Multi-Language UI** | Focus on English first | Phase 2 (Month 3) |
| **Redis Caching** | ROI only at 1K+ users | Phase 1.1 (Month 2) |
| **Recipe Suggestions** | Out of scope for MVP | Phase 4 (Month 9) |
| **Community Features** | Social sharing, forums | Phase 3 (Month 6) |
| **Premium Subscription** | Focus on proving value first | Phase 2 (Month 3) |
| **Nutritional Info** | Different value prop | Phase 3 (Month 6) |
| **Batch Scanning** | B2B feature (temples) | Phase 4 (Month 12) |
| **Batch Scanning** | Overkill for MVP | Phase 1.1 (Month 2) |

### OneSignal (Push Notifications)

**Post-MVP Use Cases:**
- Re-engagement notifications (user hasn't scanned in 7 days)
- Feature announcements
- Product recall alerts (if FSSAI/FDA issues recall)
- Newsletter notifications (when we publish articles)

**NOT Used For:**
- Marketing spam
- Daily reminders (annoying)
- Promotional offers
---

### Post-MVP Roadmap

#### **Phase 1.1 (Month 2 - Feb 2026)**

**Focus: Performance & Scale**

✅ Add Redis caching (when >1K users)
✅ Barcode scanning (with safeguards)
✅ Performance optimizations
✅ Load testing and scaling

**Success Metric:** Handle 10K scans/day without degradation

---

#### **Phase 2 (Month 3-4 - Mar-Apr 2026)**

**Focus: Monetization & Growth**

✅ Launch Premium subscription ($0.99/month)
  - Unlimited scans (Free = 10/month)
  - Priority support
  - Advanced analysis breakdown

✅ Multi-language UI support
  - Hindi, Gujarati, Marathi, Telugu, Tamil

✅ Referral program
  - Invite 3 friends → 1 month free

✅ Community-specific landing pages
  - jain.app.com, vaishnava.app.com

**Success Metric:** 100 paid users, 10% conversion rate

---

#### **Phase 3 (Month 5-6 - May-Jun 2026)**

**Focus: Community & Engagement**

✅ Social features
  - Share scans with friends
  - Community product ratings
  - User reviews

✅ Educational content
  - Blog: "10 Hidden Non-Jain Ingredients"
  - In-app tips and guides
  - Video tutorials

✅ Enhanced accuracy
  - User feedback loop → Prompt improvements
  - Manual expert review of uncertain cases

**Success Metric:** 5K MAU, 60+ NPS

---

#### **Phase 4 (Month 7-12 - Jul-Dec 2026)**

**Focus: New Markets & Features**

✅ B2B offering (temples, restaurants)
✅ Nutritional information (complementary to compliance)
✅ Recipe recommendations (compliant recipes)
✅ Integration with grocery delivery (Instacart, Blinkit)

**Success Metric:** 10K MAU, $10K MRR

---

## 8. USER STORIES

### Epic 1: Authentication & Onboarding

**User Story 1.1: Sign Up**
```
As a Jain user living abroad,
I want to sign up quickly with Google,
So that I can start scanning products immediately.

Acceptance Criteria:
- [ ] User can sign up with email + password
- [ ] User can sign up with Google OAuth
- [ ] Password must be ≥8 characters
- [ ] Email verification sent
- [ ] User redirected to onboarding after signup
- [ ] Error messages shown for invalid inputs

Priority: 🔴 P0 (Critical)
Estimate: 2 days
```

**User Story 1.2: Onboarding - Community Selection**
```
As a new user,
I want to select my dietary community (Jain, Vaishnava, etc.),
So that the app understands my specific restrictions.

Acceptance Criteria:
- [ ] 4 community options shown with icons + descriptions
- [ ] User must select one community
- [ ] Can't proceed without selection
- [ ] Selected community saved to user profile

Priority: 🔴 P0 (Critical)
Estimate: 1 day
```

**User Story 1.3: Onboarding - Dietary Restrictions**
```
As a Jain user,
I want to customize my restrictions (e.g., OK with potatoes),
So that the app gives me personalized verdicts.

Acceptance Criteria:
- [ ] 5 category screens (Proteins, Vegetables, Additives, Fermented, Other)
- [ ] Search box to filter items
- [ ] Default restrictions pre-checked based on community
- [ ] User can uncheck exceptions
- [ ] Progress indicator shows "Screen X of 10"
- [ ] Summary screen shows all selections

Priority: 🔴 P0 (Critical)
Estimate: 4 days
```

---

### Epic 2: Scanning & Analysis

**User Story 2.1: Scan Product**
```
As a user shopping in a foreign supermarket,
I want to scan a product's ingredient label,
So that I know if it's safe to eat.

Acceptance Criteria:
- [ ] Camera opens when "Scan Product" tapped
- [ ] Framing guide shows ideal area
- [ ] User can capture 1-3 photos
- [ ] Flash toggle available
- [ ] Photo thumbnails shown after capture
- [ ] "Looks Good" button to proceed
- [ ] "Retake" option available

Priority: 🔴 P0 (Critical)
Estimate: 3 days
```

**User Story 2.2: View Scan Result**
```
As a user who just scanned a product,
I want to see a clear verdict and explanation,
So that I can decide whether to buy it.

Acceptance Criteria:
- [ ] Large verdict badge (SAFE/UNSAFE/CAUTION/UNCERTAIN)
- [ ] Confidence score displayed (e.g., "94%")
- [ ] Color-coded (green/red/yellow/gray)
- [ ] Ingredients list shown
- [ ] Expandable "Why it's safe/unsafe" section
- [ ] "Report Error" button visible
- [ ] "Re-scan" option available

Priority: 🔴 P0 (Critical)
Estimate: 2 days
```

**User Story 2.3: Uncertain Result**
```
As a user who received an uncertain verdict,
I want guidance on what to do next,
So that I don't eat something unsafe.

Acceptance Criteria:
- [ ] "UNCERTAIN" badge shown clearly
- [ ] Confidence score shown (e.g., "62%")
- [ ] Explanation: "Cannot confidently determine..."
- [ ] Recommendation: "Contact manufacturer or avoid"
- [ ] List of ambiguous ingredients
- [ ] Option to report product for manual review

Priority: 🟡 P1 (High)
Estimate: 1 day
```

---

### Epic 3: History & Management

**User Story 3.1: View Scan History**
```
As a user,
I want to see my past scans,
So that I can remember which products are safe.

Acceptance Criteria:
- [ ] History tab shows all scans
- [ ] Grouped by date (Today, Yesterday, Last Week)
- [ ] Color-coded by verdict
- [ ] Shows product image thumbnail
- [ ] Shows timestamp
- [ ] Tap to view full details

Priority: 🟡 P1 (High)
Estimate: 2 days
```

**User Story 3.2: Filter History**
```
As a user with many scans,
I want to filter by verdict or date,
So that I can find specific products quickly.

Acceptance Criteria:
- [ ] Search bar to search product names
- [ ] Filter by verdict (Safe, Unsafe, Caution)
- [ ] Filter by date range
- [ ] Clear filters button
- [ ] Filter state persists during session

Priority: 🟢 P2 (Medium)
Estimate: 1 day
```

---

### Epic 4: Profile & Settings

**User Story 4.1: Edit Dietary Preferences**
```
As a user whose diet has changed,
I want to update my restrictions,
So that verdicts reflect my current needs.

Acceptance Criteria:
- [ ] Can change community selection
- [ ] Can add/remove exceptions
- [ ] Can add/remove allergies
- [ ] Changes saved immediately
- [ ] Confirmation message shown

Priority: 🟡 P1 (High)
Estimate: 2 days
```

**User Story 4.2: Delete Account**
```
As a user who wants to leave,
I want to delete my account and data,
So that I comply with GDPR/privacy rights.

Acceptance Criteria:
- [ ] Clear warning about data loss
- [ ] Must type "DELETE" to confirm
- [ ] All user data deleted (account, scans, images)
- [ ] Confirmation email sent
- [ ] Redirected to app store after deletion

Priority: 🟡 P1 (High - GDPR requirement)
Estimate: 1 day
```

---

## 9. NON-GOALS (OUT OF SCOPE)

### What We're NOT Building (and Why)

❌ **Nutritional Analysis**
- **Why:** Different value proposition (health vs compliance)
- **Alternative:** Partner with existing nutrition apps later

❌ **Recipe Database**
- **Why:** Out of scope for scanning app
- **Alternative:** Phase 4 (Month 9+)

❌ **Restaurant Recommendations**
- **Why:** Different use case (restaurants vs packaged products)
- **Alternative:** Separate feature post-MVP

❌ **Meal Planning**
- **Why:** Complex feature, low ROI for MVP
- **Alternative:** Not planned

❌ **Social Network**
- **Why:** Not core value prop
- **Alternative:** Simple sharing in Phase 3

❌ **AI Chatbot Support**
- **Why:** Overkill for MVP support needs
- **Alternative:** Simple contact form sufficient

❌ **Web App**
- **Why:** Camera-first experience requires mobile
- **Alternative:** Not planned

❌ **Smart Watch App**
- **Why:** Camera not available on watches
- **Alternative:** Not planned

---

## 10. RISKS & MITIGATIONS

### Critical Risks

#### **Risk 1: LLM Accuracy <90%**

**Impact:** 🔴 CRITICAL
- False positives → Religious violations → Loss of trust
- False negatives → Limited product options → Poor UX

**Probability:** Medium (30%)

**Mitigation Strategies:**
1. **Conservative Confidence Thresholds**
   - Tier 1: Escalate if confidence <70% (not 60%)
   - Show "CAUTION" if any ambiguity

2. **User Feedback Loop**
   - "Report Error" button on every result
   - Manual review of reported errors weekly
   - Update system prompts based on patterns

3. **Multi-Tier Validation**
   - Tier 1: Gemini 3 Flash (fast, cost-effective)
   - Tier 2: GPT-5.2 (slower, more accurate)
   - If still uncertain: Show UNCERTAIN verdict

4. **Community Expert Review**
   - Recruit 3-5 Jain experts for monthly audits
   - Review 100 random scans for accuracy
   - Pay $50/month stipend

**Success Metric:** Maintain 94%+ accuracy (measured monthly)

---

#### **Risk 2: User Abandons During Onboarding**

**Impact:** 🔴 CRITICAL
- 10-screen onboarding = 65-70% completion expected
- If <60%: Not enough activated users

**Probability:** High (50%)

**Mitigation Strategies:**
1. **Progressive Disclosure**
   - Add search functionality (filter 80 items → 5 relevant)
   - Grouping by category (collapse/expand)

2. **Visual Improvements**
   - Icons for each item
   - Progress bar ("4 of 10")
   - Estimated time ("2 minutes remaining")

3. **Skip Option**
   - "Use Default Restrictions" button
   - Can customize later in settings

4. **A/B Testing**
   - Test 10-screen vs 5-screen version
   - Measure completion + subsequent scan rate

**Success Metric:** 70%+ onboarding completion

---

#### **Risk 3: LLM API Costs Exceed Budget**

**Impact:** 🟡 HIGH
- Budget: $300/month for 10K users
- If costs 2x: $600/month → Negative margins

**Probability:** Low (20%)

**Mitigation Strategies:**
1. **Cost Monitoring**
   - Alert if daily costs exceed $15 (10% buffer)
   - Weekly cost review

2. **Optimization**
   - Client-side compression reduces image size 80%
   - Cache popular products (Phase 1.1)
   - Limit to 10 scans/min per user

3. **Tiered Response**
   - Only use Tier 2 (expensive) for 20-30% of scans
   - Most scans (70-80%) resolved by Tier 1

4. **Fallback Plan**
   - If costs spike: Temporarily reduce free tier (10 → 5 scans/month)
   - Accelerate monetization (launch Premium earlier)

**Success Metric:** Stay under $0.03/scan average

---

### Medium Risks

#### **Risk 4: Low Initial Traction**

**Impact:** 🟡 MEDIUM
- <100 users in Month 1 → Slow feedback loop
- Hard to validate product-market fit

**Probability:** Medium (40%)

**Mitigation:**
1. **Pre-Launch Community Building**
   - Post in Jain WhatsApp groups (Week -1)
   - Partner with temples for announcements
   - Personal outreach to diaspora communities

2. **Launch Strategy**
   - Soft launch Week 1: Friends & family (50 users)
   - Public launch Week 2: Community groups (150 users)
   - Paid ads Week 4 (if needed): Facebook/Instagram ($200 budget)

3. **Word-of-Mouth Incentive**
   - "Invite 3 friends → Extended free trial" (Phase 2)

**Success Metric:** 200+ users by Month 1

---

#### **Risk 5: Competitor Launch**

**Impact:** 🟢 LOW-MEDIUM
- Yuka, Fig could add religious diet features

**Probability:** Low (20%)

**Mitigation:**
1. **Speed to Market**
   - MVP in 4 weeks (faster than enterprise competitors)

2. **Community Focus**
   - Deep Jain/Vaishnava knowledge is moat
   - Generic competitors can't match customization

3. **Switching Costs**
   - User builds scan history (investment)
   - Customized preferences (effort to recreate)

**Success Metric:** Launch before any competitor

---

### Low Risks

#### **Risk 6: Supabase Downtime**

**Impact:** 🟢 LOW (temporary service disruption)

**Probability:** Very Low (5%)

**Mitigation:**
- Daily backups to S3
- Uptime monitoring (uptime.com)
- Supabase has 99.9% SLA

---

#### **Risk 7: Privacy Concerns**

**Impact:** 🟢 LOW (reputation risk)

**Probability:** Low (15%)

**Mitigation:**
- Clear privacy policy
- 90-day image deletion
- GDPR-compliant data export
- No data selling (ever)

---

## 11. GO-TO-MARKET STRATEGY

### Launch Plan (4-Week Timeline)

#### **Week 1: Soft Launch (Friends & Family)**

**Goal:** 50 users, iron out critical bugs

**Activities:**
1. Deploy to TestFlight (iOS) + Google Play Beta (Android)
2. Personal invites to 20 friends/family
3. Ask for brutal feedback
4. Fix critical bugs daily
5. Monitor crash rate (<1% acceptable)

**Success Criteria:**
- 50 sign-ups
- 30+ scans completed
- Crash rate <1%
- No critical bugs

---

#### **Week 2: Community Launch**

**Goal:** 150 users, validate product-market fit

**Activities:**
1. Post in Jain WhatsApp groups (20+ groups)
   - Message: "Built by a Jain, for Jains. Free forever. Feedback needed."
   - Include demo video (30 sec)

2. Reach out to temple leaders
   - Ask for announcement during services
   - Provide flyers for notice boards

3. Post on Reddit
   - r/Jainism, r/vegetarian, r/IndianFood

4. Monitor feedback closely
   - Respond to every user message
   - Fix reported bugs within 24 hours

**Success Criteria:**
- 150 total users
- 10+ positive reviews
- <5 critical bugs reported
- 70%+ onboarding completion

---

#### **Week 3: Diaspora Outreach**

**Goal:** 500 users, expand beyond initial community

**Activities:**
1. Facebook groups
   - "Jains in USA", "Jains in UK", "ISKCON Devotees"
   - Post with user testimonials

2. Instagram
   - Create @foodscannerapp account
   - Post daily tips ("Did you know E471 can be animal-based?")
   - User-generated content (repost scans)

3. Email outreach
   - Email 50 diaspora organizations
   - Offer free demo/training sessions

**Success Criteria:**
- 500 total users
- 30+ app store reviews (4.5+ stars)
- 60%+ Day 7 retention

---

#### **Week 4: Optimization & Scale**

**Goal:** 1,000 users, prepare for growth

**Activities:**
1. Analyze metrics
   - Which screens have high drop-off?
   - What errors are most common?
   - Where do users get stuck?

2. A/B tests
   - Test onboarding flow variations
   - Test CTA button text
   - Test result screen layouts

3. Performance optimization
   - Reduce API response time
   - Fix slow screens
   - Optimize image uploads

**Success Criteria:**
- 1,000 total users
- <3 sec average scan time
- 45%+ Day 7 retention

---

### Marketing Channels (Ranked by Priority)

#### **1. Community Outreach (Organic)**

**Channels:**
- WhatsApp groups (Jain, Vaishnava, Swaminarayan)
- Temple partnerships
- Community events

**Cost:** $0
**Expected CAC:** $0
**Expected Users (Month 1):** 500

**Why It Works:**
- High trust (recommended by community leaders)
- Word-of-mouth spreads fast
- Low barrier to try (free)

---

#### **2. Social Media (Organic + Paid)**

**Channels:**
- Instagram (@foodscannerapp)
- Facebook groups
- Reddit communities

**Cost:** $200/month (starting Month 2)
**Expected CAC:** $2-5
**Expected Users (Month 2):** 500

**Content Strategy:**
- Educational: "5 Hidden Animal Ingredients"
- User stories: "How I shop confidently now"
- Tips: "Best products for Jain diet in UK"

---

#### **3. Referral Program (Phase 2)**

**Incentive:** Invite 3 friends → 1 month free Premium

**Cost:** $2.97 in lost revenue per referrer
**Expected CAC:** $1
**Expected Users (Month 3+):** 20% of growth

**Why It Works:**
- Natural fit (users want to help friends)
- Low cost (only pay when conversion happens)
- Network effects

---

#### **4. SEO & Content Marketing (Phase 3)**

**Channels:**
- Blog (blog.app.com)
- YouTube tutorials
- SEO optimization

**Cost:** $0 (DIY content)
**Expected CAC:** $0
**Expected Users (Month 6+):** 30% of growth

**Content Ideas:**
- "Complete Guide to Jain Diet Abroad"
- "How to Read Food Labels (UK/US/EU)"
- "10 Safe Snacks for Vaishnava Diet"

---

### Launch Messaging

**Tagline:** "Eat with Confidence, Anywhere in the World"

**Key Messages:**

1. **Speed:** "Scan → Answer in 2 seconds"
2. **Accuracy:** "94% accuracy with AI-powered analysis"
3. **Trust:** "Built by Jains, for Jains (and Vaishnava, Swaminarayan, Vegans)"
4. **Privacy:** "Your data, your control. Delete anytime."
5. **Free:** "Free forever. No credit card required."

**Elevator Pitch (30 seconds):**

> "Ever stood in a foreign supermarket for 20 minutes trying to figure out if a product has onion powder? We solve that. Just scan the label, and our AI tells you instantly if it's safe for your Jain diet. 94% accuracy. Free forever. Built by Jains who understand your struggle."

---

## 12. COMPETITIVE LANDSCAPE

### Direct Competitors

| Competitor | Focus | Strengths | Weaknesses | Threat Level |
|------------|-------|-----------|------------|--------------|
| **Yuka** | Nutrition, additives | 70M+ users, strong brand | No religious diets | 🟡 Medium |
| **Fig** | Allergies, diets | Good UX, ingredient database | No Jain/Vaishnava | 🟢 Low |
| **MyFoodChecker** | Jain diet | Only Jain app | Poor UX, no AI | 🔴 High |
| **TagHalal** | Halal verification | Muslim community focus | Binary (halal/haram) | 🟢 Low |
| **Is It Vegan?** | Vegan products | Large database | No customization | 🟢 Low |

---

### Competitive Analysis Deep Dive

#### **Yuka (Nutrition & Additives Scanner)**

**Overview:**
- 70M+ downloads
- Nutrition score + additives analysis
- Barcode scanning primarily

**Strengths:**
- Massive user base
- Strong brand recognition
- Comprehensive database (EU/US)

**Weaknesses:**
- ❌ No religious diet support
- ❌ Focus on health, not compliance
- ❌ Doesn't understand "Jain but OK with potatoes"

**Why We're Different:**
- They do nutrition, we do religious compliance
- They're generic, we're community-specific
- They're database-driven, we're AI-powered

**Threat Level:** 🟡 Medium
- Could add religious filters later
- But deep expertise is our moat

---

#### **MyFoodChecker (Jain Diet Scanner)**

**Overview:**
- Only existing Jain-focused app
- Small user base (~5K)
- Manual database entry

**Strengths:**
- First mover in Jain space
- Some community trust

**Weaknesses:**
- ❌ Poor UX (outdated design)
- ❌ No AI (manual database lookup)
- ❌ Limited ingredient coverage
- ❌ Barcode-only (no label scanning)
- ❌ No user customization

**Why We're Better:**
- AI-powered (we can analyze ANY label)
- Better UX (modern, fast)
- User customization
- Multi-community support

**Threat Level:** 🔴 High
- Direct competitor in Jain space
- But we're significantly better

**Strategy:** Position as "MyFoodChecker 2.0" - modern, AI-powered upgrade

---

#### **Fig (Allergy & Diet Scanner)**

**Overview:**
- Well-designed app
- Focus on allergies + diets (vegan, keto, etc.)
- 500K+ users

**Strengths:**
- Clean UX
- Good allergen detection
- Active community

**Weaknesses:**
- ❌ No Jain/Vaishnava/Swaminarayan
- ❌ Generic "vegetarian" category
- ❌ Doesn't understand E-number sources

**Why We're Different:**
- We have deep religious diet knowledge
- They're Western-focused, we're India-focused

**Threat Level:** 🟢 Low
- Different target market
- Hard to replicate community expertise

---

### Our Competitive Advantages (Moats)

1. **Community-Specific Intelligence**
   - 80-100 Jain rules coded into system prompts
   - Vaishnava sattvic principles
   - Swaminarayan purity emphasis
   - Competitors can't replicate without deep knowledge

2. **User Customization**
   - "Jain but OK with potatoes"
   - Personal exceptions
   - Real-world flexibility
   - Competitors have rigid categories

3. **Regional Intelligence**
   - E631 source varies by country
   - Understand India vs US vs EU regulations
   - Search API provides context
   - Competitors use static databases

4. **Multi-Tier AI**
   - Confidence-based escalation
   - 94% accuracy through validation
   - Competitors use single-pass analysis

5. **Speed to Market**
   - MVP in 4 weeks
   - Faster than enterprise competitors
   - First-mover in AI-powered religious diet space

---

### Competitive Positioning

**Who We Are:**
> "The first AI-powered dietary compliance app built specifically for Jain, Vaishnava, and Swaminarayan communities. Instant verification, 94% accuracy, with the customization and regional intelligence these communities need."

**Who We're NOT:**
- Not a nutrition app (Yuka)
- Not a generic diet app (Fig)
- Not a manual database (MyFoodChecker)

**Our Unique Position:**
> "We're at the intersection of AI technology and deep religious community knowledge. No competitor has both."

---

## APPENDICES

### Appendix A: Glossary

**Terms:**
- **Jain Diet:** Strict vegetarian diet avoiding onion, garlic, root vegetables (except some), and animal products
- **Vaishnava Diet:** Sattvic diet for Krishna devotees, avoiding onion, garlic, mushrooms, caffeine
- **Swaminarayan Diet:** Lacto-vegetarian with emphasis on purity, avoiding specific vegetables and fermented foods
- **E-numbers:** European food additive codes (e.g., E631 = Disodium Inosinate)
- **Confidence Score:** AI's certainty level (0-100%) in its verdict

**Abbreviations:**
- **TAM:** Total Addressable Market
- **SAM:** Serviceable Addressable Market
- **SOM:** Serviceable Obtainable Market
- **CAC:** Customer Acquisition Cost
- **LTV:** Lifetime Value
- **DAU:** Daily Active Users
- **MAU:** Monthly Active Users
- **NPS:** Net Promoter Score

---

### Appendix B: References

1. Jain Dietary Guidelines: www.jainworld.com/education/food
2. ISKCON Vaishnava Diet: www.iskcon.org/food
3. BAPS Swaminarayan Diet: www.baps.org/spirituality
4. EU E-Number Database: www.food.gov.uk/additives
5. India FSSAI Regulations: www.fssai.gov.in
6. LLM Pricing (Jan 2026): OpenAI, Google Gemini pricing pages

---

### Appendix C: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2, 2026 | Product Team | Initial PRD approved for development |

---

## APPROVAL & SIGN-OFF

**Document Status:** 🟢 APPROVED FOR DEVELOPMENT

**Approved By:**
- Product Lead: [Name] - Jan 2, 2026
- Engineering Lead: [Name] - Jan 2, 2026
- Business Stakeholder: [Name] - Jan 2, 2026

**Next Steps:**
1. ✅ Review Technical Architecture (PRD 02)
2. ✅ Review UX Flows (PRD 03)
3. ✅ Review API Specs (PRD 04)
4. ✅ Review Data Models (PRD 05)
5. 🔄 Begin Sprint 1 (Week 1: Auth + Onboarding)

---

**END OF PRD 01: PRODUCT OVERVIEW**

**Related Documents:**
- PRD 02: Technical Architecture →
- PRD 03: User Experience & Flows →
- PRD 04: API Specifications →
- PRD 05: Data Models & Policies →
