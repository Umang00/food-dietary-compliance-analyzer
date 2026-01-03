# PRD 05: DATA MODELS & POLICIES

## Food Dietary Compliance Analyzer

**Document Version:** 1.0  
**Date:** January 2, 2026  
**Part of:** PRD Suite (Document 5 of 5)

---

## DATABASE SCHEMA

### Tables Overview

```sql
-- Core tables
users               -- Managed by BetterAuth
profiles            -- User dietary preferences
scans               -- Scan history
error_reports       -- User feedback on scan accuracy

-- Reference tables (seed data)
communities         -- Jain, Vaishnava, etc.
restrictions        -- Dietary rules per community
```

---

### Table: users

-- BetterAuth creates these automatically
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- BetterAuth uses TEXT IDs
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,  -- 'google', 'email', etc.
  provider_account_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

**Data Retention:** Forever (or until user deletes account)

---

### Table: profiles

User dietary preferences and customization.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Community selection
  community TEXT NOT NULL CHECK (
    community IN ('Jain', 'Vaishnava', 'Swaminarayan', 'Vegan')
  ),
  
  -- User customization (JSONB for flexibility)
  exceptions JSONB DEFAULT '[]'::jsonb,  -- ["potatoes", "carrots"]
  allergies JSONB DEFAULT '[]'::jsonb,   -- ["peanuts", "gluten"]
  
  -- Context
  location TEXT,  -- "India", "UK", "US" (for regional ingredient lookup)
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_community ON profiles(community);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (
    user_id = (current_setting('request.jwt.claim.sub', true))
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (
    user_id = (current_setting('request.jwt.claim.sub', true))
  );
```

**Example Data:**

```json
{
  "id": "uuid-1",
  "user_id": "uuid-user-1",
  "community": "Jain",
  "exceptions": ["potatoes", "carrots"],
  "allergies": ["peanuts"],
  "location": "UK",
  "created_at": "2026-01-02T10:00:00Z",
  "updated_at": "2026-01-02T11:00:00Z"
}
```

**Data Retention:** Forever (or until user deletes account)

---

### Table: scans

Scan history with results.

CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- BetterAuth uses TEXT IDs
  
  -- Final Result
  verdict TEXT NOT NULL CHECK (verdict IN ('SAFE', 'UNSAFE', 'CAUTION', 'UNCERTAIN')),
  confidence DECIMAL(3,2) NOT NULL,
  reasoning TEXT NOT NULL,
  
  -- Ingredients
  ingredients JSONB NOT NULL,
  violations JSONB DEFAULT '[]'::jsonb,
  ambiguous_items JSONB DEFAULT '[]'::jsonb,  -- NEW
  
  -- LLM Metadata
  tier INTEGER NOT NULL CHECK (tier IN (1, 2)),
  model TEXT NOT NULL,
  
  -- Tier 1 Result (if Tier 2 was used)  -- NEW SECTION
  tier1_verdict TEXT,
  tier1_confidence DECIMAL(3,2),
  tier1_model TEXT DEFAULT 'gemini-3-flash',
  
  -- Image (Backblaze B2)
  image_url TEXT,  -- <https://f002.backblazeb2.com/file/>...
  
  -- Performance
  processing_time_ms INTEGER,
  
  -- User Context
  user_community TEXT NOT NULL,
  user_exceptions JSONB DEFAULT '[]'::jsonb,
  user_allergies JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans"
  ON scans FOR SELECT
  USING (
    user_id = (current_setting('request.jwt.claim.sub', true))
  );

CREATE POLICY "Users can insert own scans"
  ON scans FOR INSERT
  WITH CHECK (
    user_id = (current_setting('request.jwt.claim.sub', true))
  );

CREATE POLICY "Users can delete own scans"
  ON scans FOR DELETE
  USING (
    user_id = (current_setting('request.jwt.claim.sub', true))
  );

```

**Example Data:**

```json
{
  "id": "uuid-scan-1",
  "user_id": "uuid-user-1",
  "verdict": "SAFE",
  "confidence": 0.94,
  "reasoning": "This product contains only plant-based ingredients...",
  "ingredients": ["potatoes", "vegetable oil", "salt", "spices"],
  "violations": [],
  "ambiguous_items": [],
  "tier": 1,
  "model": "gemini-3-flash",
  "tier1_confidence": null,
  "tier1_verdict": null,
  "image_url": `https://f002.backblazeb2.com/file/food-scanner-scans/{userId}/{scanId}.jpg`
  "image_deleted_at": null,
  "processing_time_ms": 1850,
  "user_community": "Jain",
  "user_exceptions": ["potatoes", "carrots"],
  "user_location": "UK",
  "created_at": "2026-01-02T12:00:00Z"
}
```

**Data Retention:**

- **Images:** 90 days, then deleted (auto-cleanup cron job)
- **Metadata:** Forever (anonymized after 90 days if needed)
- **User can delete anytime:** Via app or GDPR request

---

### Table: error_reports

User feedback on scan accuracy.

```sql
CREATE TABLE error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Error details
  error_type TEXT NOT NULL CHECK (
    error_type IN ('wrong_verdict', 'missed_ingredient', 'other')
  ),
  user_comment TEXT,
  
  -- Internal tracking
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'reviewed', 'resolved', 'invalid')
  ),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_error_reports_scan_id ON error_reports(scan_id);
CREATE INDEX idx_error_reports_status ON error_reports(status);
CREATE INDEX idx_error_reports_created_at ON error_reports(created_at DESC);
```

**Example Data:**

```json
{
  "id": "uuid-report-1",
  "scan_id": "uuid-scan-1",
  "user_id": "uuid-user-1",
  "error_type": "wrong_verdict",
  "user_comment": "This product has onion but was marked safe",
  "status": "pending",
  "admin_notes": null,
  "reviewed_by": null,
  "reviewed_at": null,
  "created_at": "2026-01-02T12:30:00Z"
}
```

**Data Retention:** Forever (for model improvement)

---

### Seed Data Tables

#### Table: communities

Reference data for supported communities.

```sql
CREATE TABLE communities (
  slug TEXT PRIMARY KEY,  -- "jain", "vaishnava", etc.
  name TEXT NOT NULL,  -- "Jain", "Vaishnava"
  description TEXT,
  default_restrictions JSONB NOT NULL,  -- Default items to avoid
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO communities (slug, name, description, default_restrictions) VALUES
('jain', 'Jain', 'Jain dietary rules', '["meat", "poultry", "fish", "eggs", "onion", "garlic", "honey", ...]'),
('vaishnava', 'Vaishnava', 'ISKCON/Vaishnava rules', '["meat", "fish", "eggs", "onion", "garlic", "mushrooms", ...]'),
('swaminarayan', 'Swaminarayan', 'Swaminarayan rules', '["meat", "fish", "eggs", "onion", "garlic", ...]'),
('vegan', 'Vegan', 'Vegan diet', '["meat", "fish", "dairy", "eggs", "honey", ...]');
```

---

## DATA RETENTION POLICIES

### Image Retention (90 Days)

**Policy:** Images stored for 90 days, then auto-deleted.

**Why 90 days?**

- Error debugging (30 days sufficient)
- Legal protection (60 days buffer)
- Model improvement (collect edge cases)

**Implementation:**

```javascript
// Cron job runs daily at 2 AM
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

async function cleanupOldImages() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  // List old objects from B2
  const listCommand = new ListObjectsV2Command({
    Bucket: 'food-scanner-scans',
  });
  
  const { Contents } = await s3Client.send(listCommand);
  
  const oldObjects = Contents?.filter(obj => 
    obj.LastModified && obj.LastModified < ninetyDaysAgo
  );
  
  if (!oldObjects || oldObjects.length === 0) return;
  
  // Delete old objects
  await s3Client.send(new DeleteObjectsCommand({
    Bucket: 'food-scanner-scans',
    Delete: {
      Objects: oldObjects.map(obj => ({ Key: obj.Key })),
    },
  }));
  
  // Update database (optional sync)
  console.log(`Deleted ${oldObjects.length} images`);
}
```

**User Override:**
User can delete images immediately via:

- Delete scan from history (deletes image + metadata)
- Delete scan history (bulk delete)
- Delete account (deletes everything)

---

### Metadata Retention (Forever)

**Policy:** Scan metadata retained indefinitely for analytics and model improvement.

**Data Stored:**

- Verdict, confidence, reasoning
- Ingredients detected
- Tier used, model used
- Processing time
- User community (at time of scan)

**Privacy:** No PII stored in metadata after image deletion.

---

### User Account Deletion

**Policy:** User can delete account anytime (GDPR Right to be Forgotten).

**What Gets Deleted:**

1. User account (auth.users)
2. User profile (profiles)
3. All scans (scans table + images)
4. Error reports
5. Session tokens (invalidated)

**Implementation:**

```javascript
async function deleteUserAccount(userId: string) {
  // 1. Delete images from B2
  const { data: scans } = await supabase
    .from('scans')
    .select('image_url')
    .eq('user_id', userId);
  
  if (scans && scans.length > 0) {
    const imageKeys = scans
      .filter(s => s.image_url)
      .map(s => s.image_url.split('food-scanner-scans/')[1]); // Extract key
      
    // Delete from B2 using S3Client...
  }
  
  // 2. Delete error reports
  await supabase
    .from('error_reports')
    .delete()
    .eq('user_id', userId);
  
  // 3. Delete scans
  await supabase
    .from('scans')
    .delete()
    .eq('user_id', userId);
  
  // 4. Delete profile
  await supabase
    .from('profiles')
    .delete()
    .eq('user_id', userId);
  
  // 5. Delete auth user (BetterAuth)
  // await auth.api.deleteUser({ ... })
  
  console.log(`Deleted user ${userId} and all data`);
}
```

**Timeline:** Immediate (completes within 24 hours)

---

## GDPR COMPLIANCE

### Article 13: Right to Information

**Privacy Policy includes:**

- What data we collect (email, images, scan results)
- Why we collect it (provide service, improve accuracy)
- How long we keep it (images 90 days, metadata indefinitely)
- Who has access (user only, plus admins for error review)
- User rights (access, deletion, export)

---

### Article 15: Right of Access

**Implementation:** GET /account/export

User can request all their data in machine-readable format (JSON + CSV).

**Export includes:**

- User profile (JSON)
- Scan history (CSV with metadata)
- Image URLs (valid for 7 days if still available)

---

### Article 17: Right to be Forgotten

**Implementation:** DELETE /account

User can delete all data anytime.

**Confirmation required:** Must type "DELETE" to prevent accidental deletion.

---

### Article 25: Data Protection by Design

**Technical measures:**

- Row Level Security (RLS): Users can only access their own data
- Encryption at rest: Supabase encrypts all data
- Encryption in transit: TLS 1.3
- Minimal data collection: Only what's needed for service
- Pseudonymization: User IDs are UUIDs, not email addresses

---

## PRIVACY POLICY (Key Points)

**Full policy at:** <https://foodscanner.com/privacy>

### What We Collect

1. **Account Information**
   - Email address
   - Password (hashed with bcrypt)
   - Google account (if using OAuth)

2. **Scan Data**
   - Product images (stored 90 days)
   - Scan results (verdict, confidence, ingredients)
   - Timestamp and location (if provided)

3. **Usage Data**
   - App usage (PostHog analytics)
   - Error logs (Sentry)
   - IP address (temporary, for rate limiting)

### How We Use It

1. **Provide Service**
   - Analyze food products for dietary compliance
   - Store scan history for user reference

2. **Improve Service**
   - Train better AI models
   - Fix bugs and errors
   - Understand usage patterns

3. **Security**
   - Detect abuse and fraud
   - Rate limiting

### We Never

- ❌ Sell your data
- ❌ Share with third parties (except service providers)
- ❌ Use images for advertising
- ❌ Track you across other apps/websites

### Your Rights

- ✅ View your data (export)
- ✅ Delete your data (account deletion)
- ✅ Correct your data (edit profile)
- ✅ Opt out of analytics (settings)

### Image Storage (Backblaze B2)

**Storage Strategy:**

- Service: Backblaze B2 (S3-compatible)
- Bucket: `food-scanner-scans`
- Path structure: `{userId}/{scanId}.jpg`
- Retention: 90 days, then auto-delete
- Cost: $0 (under 10GB free tier)

**Image URLs:**

- Public URLs: `https://f002.backblazeb2.com/file/food-scanner-scans/{userId}/{scanId}.jpg`
- Or signed URLs (1-hour expiry) for private access

**Cleanup Job:**
Daily cron job at 2 AM deletes images >90 days old

### Children's Privacy

App not intended for users under 13. We don't knowingly collect data from children.

---

## SECURITY MEASURES

### Authentication

- **Password Hashing:** bcrypt (cost factor 10)
- **JWT Tokens:** RS256 signing, 24-hour expiration
- **OAuth:** Google OAuth 2.0 (delegated authentication)
- **Session Management:** Tokens stored securely (iOS Keychain, Android Keystore)

### Data Access

- **Row Level Security (RLS):** PostgreSQL policies enforce user isolation
- **API Authentication:** All endpoints require valid JWT
- **Admin Access:** Separate admin accounts, audit logged

### Network Security

- **TLS 1.3:** All communication encrypted
- **HTTPS Only:** No plain HTTP
- **Certificate Pinning:** (Phase 2) Prevent MITM attacks

### Infrastructure Security

- **DDoS Protection:** Render built-in
- **Rate Limiting:** Express rate limit middleware
- **Input Validation:** Express validator for all inputs
- **SQL Injection Protection:** Parameterized queries only

### Monitoring

- **Error Tracking:** Sentry (real-time alerts)
- **Audit Logs:** Database audit logs enabled
- **Anomaly Detection:** (Phase 2) Detect unusual patterns

---

## BACKUP & DISASTER RECOVERY

### Automated Backups

**Database (Supabase):**

- Daily full backups
- Point-in-time recovery (7 days)
- Retained for 30 days

**Images (Backblaze B2):**

- Not backed up separately (ephemeral data)
- Deleted after 90 days anyway

### Disaster Recovery Plan

**Scenario 1: Database Failure**

1. Supabase automatic failover (< 1 minute)
2. If complete failure: Restore from backup
3. Maximum data loss: 24 hours (since last backup)

**Scenario 2: Storage Failure**

1. Supabase replicates storage across zones
2. If complete failure: Images lost (acceptable, user can re-scan)
3. Metadata preserved in database

**Scenario 3: Backend Failure**

1. Render auto-restarts service
2. If persistent: Deploy from GitHub (5 minutes)
3. No data loss (stateless backend)

**RTO (Recovery Time Objective):** 4 hours  
**RPO (Recovery Point Objective):** 24 hours

---

## ANALYTICS & TRACKING

### Event Tracking (PostHog)

**Events Collected:**

```javascript
// User actions
analytics.track('app_opened');
analytics.track('signup_completed', { method: 'google' | 'email' });
analytics.track('onboarding_completed', { community, duration });
analytics.track('scan_initiated');
analytics.track('scan_completed', { verdict, confidence, tier });
analytics.track('history_viewed');
analytics.track('error_reported', { error_type });

// System events
analytics.track('llm_api_call', { tier, model, latency, tokens });
analytics.track('search_api_call', { provider, query_count });
```

**User Properties:**

```javascript
analytics.identify(userId, {
  community: 'Jain',
  signup_date: '2026-01-02',
  total_scans: 47,
  last_scan_date: '2026-01-15'
});
```

**Privacy:**

- No PII in events (user ID only)
- IP addresses masked
- User can opt out in settings
- GDPR-compliant (EU servers available)

---

### Error Tracking (Sentry)

**Captured:**

- Exceptions and crashes
- API errors (LLM, search)
- Performance issues (slow endpoints)
- User feedback (breadcrumbs)

**Privacy:**

- Sensitive data scrubbed (emails, passwords)
- User consent required (first app launch)

---

## DATA EXPORT FORMAT

### Export Structure

When user requests data export:

```
user_data_export_2026-01-02.zip
├── profile.json
├── scans.csv
├── error_reports.json
└── README.txt
```

**profile.json:**

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "community": "Jain",
  "exceptions": ["potatoes", "carrots"],
  "allergies": ["peanuts"],
  "location": "UK",
  "created_at": "2026-01-02T10:00:00Z",
  "total_scans": 47
}
```

**scans.csv:**

```csv
scan_id,verdict,confidence,ingredients,violations,tier,created_at,image_url
uuid-1,SAFE,0.94,"[""potatoes"",""oil"",""salt""]",[],1,2026-01-02T12:00:00Z,https://...
uuid-2,UNSAFE,0.91,"[""wheat"",""onion""]","[""onion""]",2,2026-01-02T11:00:00Z,https://...
```

**README.txt:**

```
Food Scanner Data Export
Generated: 2026-01-02

This archive contains all your data from Food Scanner:
- profile.json: Your account and dietary preferences
- scans.csv: Your scan history (images expire in 7 days)
- error_reports.json: Your feedback submissions

For questions: support@foodscanner.com
Privacy policy: https://foodscanner.com/privacy
```

---

## TERMS OF SERVICE (Key Points)

**Full terms at:** <https://foodscanner.com/terms>

### User Responsibilities

- Provide accurate dietary information
- Don't abuse the service (spam, hacking)
- Don't rely solely on app for medical decisions
- Verify with manufacturer when in doubt

### Our Responsibilities

- Provide best-effort dietary analysis
- Maintain 99% uptime (target)
- Protect user data
- Respond to support requests

### Disclaimers

- **Not Medical Advice:** App is for informational purposes only
- **Accuracy Not Guaranteed:** 94% accuracy target, but errors possible
- **Manufacturer Changes:** Products reformulate without notice
- **Regional Variations:** Same product may differ by country

### Liability

- We're not liable for allergic reactions or religious violations
- User assumes risk when trusting app results
- Maximum liability: Refund of subscription (if paid)

### Termination

- We can suspend accounts for abuse
- Users can delete accounts anytime
- No refunds for partial months

---

**END OF PRD 05: DATA MODELS & POLICIES**

**Related Documents:**
← PRD 04: API Specifications
← PRD 01: Product Overview

---

**END OF PRD SUITE**

All 5 documents completed:
✅ PRD 01: Product Overview
✅ PRD 02: Technical Architecture
✅ PRD 03: User Experience & Flows
✅ PRD 04: API Specifications
✅ PRD 05: Data Models & Policies

**Ready for Development: January 2, 2026**
