# PRD 03: USER EXPERIENCE & FLOWS

## Food Dietary Compliance Analyzer

**Document Version:** 1.0  
**Date:** January 2, 2026  
**Part of:** PRD Suite (Document 3 of 5)

---

## COMPLETE SCREEN SPECIFICATIONS

### 1. AUTHENTICATION SCREENS

#### Screen: Login

**Route:** `/auth/login`

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│         🥫 Food Scanner             │
│         Eat with Confidence         │
│                                     │
│   Email                             │
│   [________________]                │
│                                     │
│   Password                          │
│   [________________]  👁️            │
│               Forgot Password?      │
│   ┌───────────────────────────┐    │
│   │   Sign In                 │    │
│   └───────────────────────────┘    │
│                                    │
│   ──────── or continue with ────   │
│                                     │
│   ┌───────────────────────────┐    │
│   │  🔵 Continue with Google  │    │
│   └───────────────────────────┘    │
│                                     │
   Don't have an account? Sign Up                          │
│                                     │
└─────────────────────────────────────┘
```

**User Actions:**

- Enter email + password → Sign in
- Tap Google → OAuth flow
- Tap "Forgot Password" → Password reset flow
- Tap "Sign Up" → Sign up screen

**Validation:**

- Email: Valid format
- Password: Min 8 characters
- Error: "Invalid email or password"

---

#### Screen: Sign Up

**Route:** `/auth/signup`

**Layout:**

```
┌─────────────────────────────────────┐
│                                     │
│         🥫 Food Scanner             │
│         Create Account              │
│                                     │
│   Full Name                         │
│   [________________]                │
│                                     │
│   Email                             │
│   [________________]                │
│                                     │
│   Password                          │
│   [________________]  👁️            │
│                                     │
│   Confirm Password                  │
│   [________________]  👁️            │
│                                     │
│   ┌───────────────────────────┐    │
│   │   Create Account          │    │
│   └───────────────────────────┘    │
│                                     │
│   ──────── or sign up with ─────   │
│                                     │
│   ┌───────────────────────────┐    │
│   │  🔵 Sign up with Google   │    │
│   └───────────────────────────┘    │
│                                     │
│   Already have an account? Login    │
│                                     │
│   By joining, you agree to our      │
│   Terms & Privacy Policy            │
│                                     │
└─────────────────────────────────────┘
```

**User Actions:**

- Enter Name, Email, Password, Confirm → Create Account
- Tap Google → OAuth flow
- Tap "Login" → Login screen
- Tap "Terms" or "Privacy" → Webview

**Validation:**

- Name: Required
- Email: Valid format, not already registered
- Password: Min 8 chars, 1 number, 1 special char
- Confirm Password: Must match

---

### 2. ONBOARDING SCREENS (10 Total)

Visual Progress Bar:

Screen 1 (Welcome): 0% complete
Screen 2 (Community): 10% complete
Screens 3-7 (Restrictions): 20%, 40%, 60%, 80%, 90%
Screen 8 (Allergies): 95%
Screen 9 (Summary): 100%

#### Screen 1: Welcome

```
┌─────────────────────────────────────┐
│                                     │  ← Progress bar 
│       🙏 Food Scanner               │
│                                     │
│  Eat with Confidence                │
│  Know what's safe for you           │
│                                     │
│  [Image: Person scanning food]      │
│                                     │
│  We help you find products          │
│  that match your dietary            │
│  beliefs and allergies.             │
│                                     │
│  Simple 3 steps:                    │
│  1. Tell us your diet               │
│  2. Scan a product                  │
│  3. We'll tell if it's safe         │
│                                     │
│  ┌───────────────────────────┐     │
│  │  Get Started →            │     │
│  └───────────────────────────┘     │
└─────────────────────────────────────┘
```

#### Screen 2: Community Selection

```
┌─────────────────────────────────────┐
│  ━━━                                │  ← Progress bar 
│  What's Your Dietary Path?          │
│  (You must select one)              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🙏 Jain                     │   │
│  │ No meat, onion, garlic,     │   │
│  │ root vegetables             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🕉️ Vaishnava               │   │
│  │ Sattvic diet, no meat       │   │
│  │ onion, garlic               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🕉️ Swaminarayan            │   │
│  │ Lacto-vegetarian, pure      │   │
│  │ foods only                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ☘️ Vegan                    │   │
│  │ Plant-based, no animal      │   │
│  │ products                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Next →]                           │
└─────────────────────────────────────┘
```

**User Actions:**

- Must select one community
- "Next" button disabled until selection
- Selection highlighted with border + checkmark

#### Screens 3-7: Restrictions by Category (5 Screens)

**Screen 3: Proteins & Meat**

```
┌─────────────────────────────────────┐
│  ━━━━━━━━━                          │  ← Progress bar 
│  Your Jain Restrictions             │
│  Category 1 of 5: Proteins & Meat   │
│  ━━━━━━━━━━━━━━━                   │
│                                     │
│  [🔍 Search restrictions...]        │
│                                     │
│  🍖 Meat & Protein                  │
│  [●─────] Meat (all types)          |
│  [─────○] Poultry                   |
│  [─────○] Dairy                      │  
│   
     ON (avoiding)                      │
│   OFF (allowing)                     │
│  [Previous]  [Next →]               │
└─────────────────────────────────────┘
```

**Features:**

- Search box filters items in real-time
- Tap checkbox to toggle
- Defaults pre-checked based on community
- Progress indicator: "Screen 3 of 10"

**Screen 4:** Vegetables & Roots (5 items)
**Screen 5:** Additives & E-Numbers (7 items)
**Screen 6:** Fermented & Honey (5 items)
**Screen 7:** Other Items (4 items)

#### Screen 8: Allergies

```
┌─────────────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━                 │  ← Progress bar 
│  Do you have any allergies?         │
│                                     │
│  [🔍 Search allergies...]           │
│                                     │
│  Common Allergies:                  │
│  [●─────] Peanuts                    │
│  [─────○] Tree Nuts                   │
│  [─────○] Gluten                       │
│  [─────○] Soy                         │
│  [─────○] Dairy                       │
│  [─────○] Eggs                         │
│  [●─────] Shellfish                  │
│  [─────○] Fish                       │
│                                     │
│  [+ Add Custom Allergy]             │
│                                     │
│  Selected: None                     │
│                                     │
│  [Previous]  [Next →]               │
└─────────────────────────────────────┘
```

#### Screen 9: Summary

```
┌─────────────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━        │  ← Progress bar 
│  Your Dietary Profile               │
│                                     │
│  🙏 Community: Jain                 │
│                                     │
│  ✅ Following 18 restrictions       │
│  • No meat, poultry, fish           │
│  • No onion, garlic                 │
│  • No root vegetables               │
│  • (View all →)                     │
│                                     │
│  ✓ Exceptions (2)                   │
│  • Potatoes                         │
│  • Carrots                          │
│                                     │
│  ⚠️ Allergies (1)                   │
│  • Peanuts                          │
│                                     │
│  [Edit] [Go Back]                   │
│                                     │
│  ┌───────────────────────────┐     │
│  │  ✓ Confirm & Start        │     │
│  └───────────────────────────┘     │
└─────────────────────────────────────┘
```

---

### 3. MAIN APP (POST-ONBOARDING)

#### Tab 1: Scan/Home Screen

**Empty State (First Time):**

```
┌─────────────────────────────────────┐
│  Food Scanner          ⚙️            │
├─────────────────────────────────────┤
│                                     │
│         🥫                          │
│      Scan a Product                 │
│                                     │
│   Point your camera at the          │
│   ingredients list to check if      │
│   it matches your Jain diet         │
│                                     │
│                                     │
│   Tips for best results:            │
│   • Good lighting                   │
│   • Clear ingredients label         │
│   • Hold camera steady              │
│                                     │
└─────────────────────────────────────┘
│  History    Scan      Profile       │
│    📋        📷         👤          │
└─────────────────────────────────────┘
```

#### History Screen

```
┌─────────────────────────────────────┐
│  Food Scanner          ⚙️            │
├─────────────────────────────────────┤
│                                     │
│   Recent Scans                      │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ 🟢 SAFE         2 min ago   │  │
│   │ Lay's Classic Salted        │  │
│   │ Confidence: 94%             │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ 🔴 UNSAFE       1 hour ago  │  │
│   │ Maggi Noodles               │  │
│   │ Contains: Onion powder      │  │
│   └─────────────────────────────┘  │
│                                     │
│   View All History →                │
└─────────────────────────────────────┘
```

#### Camera Screen

Request During First Scan
User taps "Scan Product"
  ↓
IF camera permission NOT granted:
  Show permission dialog:
  "Food Scanner needs camera access to scan labels"
  [Don't Allow] [OK]
  ↓
IF camera granted:
  Open camera screen
  ↓
AFTER first successful scan:
  Show one-time tip: "💡 Enable location for better accuracy? Helps identify regional ingredient variations."
  [Maybe Later] [Enable Location]

```
Step 1: Camera Screen (Before any photos)
┌─────────────────────────────────────┐
│  ✕                          💡       │  ← Just close + flash
├─────────────────────────────────────┤
│                                     │
│        [CAMERA VIEWFINDER]          │
│                                     │
│     ┌─────────────────────┐        │  ← Framing guide
│     │                     │        │
│     │                     │        │
│     │                     │        │
│     └─────────────────────┘        │
│                                     │
│                                     │
│            ⭕ CAPTURE                │  ← Big button
│                                     │
│         No photos yet               │  ← Status
└─────────────────────────────────────┘

Step 2: After 1st Photo Taken
┌─────────────────────────────────────┐
│  ← Back                    ✓        │
├─────────────────────────────────────┤
│                                     │
│   [📷 Photo Preview]                │
│                                     │
│   Photo 1 of 1                      │
│                                     │
│   ┌───────────────────────────┐    │
│   │  🔄 Retake This Photo      │    │
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │  ✓ Start Scanning          │    │  ← Scan with 1 photo
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │  📷 Add Another Photo      │    │  ← Take 2nd photo (optional)
│   └───────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘

Step 3: After 2nd Photo (Optional)
┌─────────────────────────────────────┐
│  ← Back                    ✓        │
├─────────────────────────────────────┤
│                                     │
│   [📷 Photo Preview]                │
│                                     │
│   Photo 2 of 2                      │
│                                     │
│   ┌───────────────────────────┐    │
│   │  🔄 Retake This Photo      │    │
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │  ✓ Start Scanning          │    │
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │  📷 Add Another Photo      │    │  ← Take 3rd photo (max)
│   └───────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘

Step 4: After 3rd Photo (Max Reached)
┌─────────────────────────────────────┐
│  ← Back                    ✓        │
├─────────────────────────────────────┤
│                                     │
│   [📷 Photo Preview]                │
│                                     │
│   Photo 3 of 3                      │
│                                     │
│   ┌───────────────────────────┐    │
│   │  🔄 Retake This Photo      │    │
│   └───────────────────────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │  ✓ Start Scanning          │    │
│   └───────────────────────────┘    │
│                                     │
│   (Max 3 photos reached)            │
│                                     │
└─────────────────────────────────────┘

Step 5: User taps "Start Scanning"
→ Navigate to Processing Screen
→ Show progress + "Did You Know" tip
→ After 2-3 seconds, show Result Screen
```

**Features:**

- Framing guide (rectangle overlay)
- Flash toggle (💡)
- Multi-photo support (up to 3)
- Photo thumbnails at bottom
- "Next" appears after 1st photo

#### Processing Screen

```
┌─────────────────────────────────────┐
│                                     │
│         🔄 Analyzing...             │
│                                     │
│   [=====>              ] 35%        │
│                                     │
│   Extracting ingredients...         │
│                                     │
│   💡 Did you know?                  │
│   E631 can be fish-derived or       │
│   plant-based depending on region   │
└─────────────────────────────────────┘
```

// Constant array stored in app
const DID_YOU_KNOW_TIPS = [
  "E471 can be plant-based or animal-derived depending on the region.",
  "Gelatin is made from animal bones and is not vegetarian.",
  "Natural flavoring doesn't always mean plant-based.",
  "Shellac (E904) is derived from insects and coats many candies.",
  "Worcestershire sauce traditionally contains fish.",
  "Some food dyes like E120 (Cochineal) are insect-derived.",
  "Sugar can be processed with bone char in some countries.",
  "Honey is avoided in Jain diet as it may harm bees.",
  "Onion and garlic are considered tamasic in sattvic diets.",
  "Root vegetables are avoided in strict Jain diet to prevent harm to microorganisms.",
];

// Show random tip during processing
function getRandomTip(): string {
  const randomIndex = Math.floor(Math.random() * DID_YOU_KNOW_TIPS.length);
  return DID_YOU_KNOW_TIPS[randomIndex];
}

// Usage in processing screen
<ProcessingScreen>
  <ProgressBar value={progress} />
  <StatusText>Extracting ingredients...</StatusText>
  
  <TipBox>
    <TipIcon>💡</TipIcon>
    <TipText>Did you know? {getRandomTip()}</TipText>
  </TipBox>
</ProcessingScreen>

**States:**

1. "Compressing images..." (10%)
2. "Uploading..." (20%)
3. "Extracting ingredients..." (40%)
4. "Checking dietary rules..." (60%)
5. "Verifying ambiguous items..." (80%)
6. "Finalizing results..." (95%)

#### Result Screen - SAFE

```
┌─────────────────────────────────────┐
│  ← Back                    Share    │
├─────────────────────────────────────┤
│   [Product Image]                   │
│                                     │
│   ┌─────────────────────────────┐  │
│   │   ✅  SAFE FOR JAIN         │  │
│   │   Confidence: 94%           │  │
│   └─────────────────────────────┘  │
│                                     │
│   Lay's Classic Salted              │
│   Scanned just now                  │
│                                     │
│   ✅ Ingredients (4 detected)       │
│   • Potatoes                        │
│   • Vegetable oil                   │
│   • Salt                            │
│   • Spices (verified no onion)      │
│                                     │
│   ▶ Show full analysis              │
│                                     │
│   🔄 Re-scan Product                │
│   ⚠️ Report Error                   │
│                                     │
│   ┌───────────────────────────┐    │
│   │  Done                     │    │
│   └───────────────────────────┘    │
└─────────────────────────────────────┘
```

#### Result Screen - UNSAFE

```
┌─────────────────────────────────────┐
│  ← Back                              │
├─────────────────────────────────────┤
│   [Product Image]                   │
│                                     │
│   ┌─────────────────────────────┐  │
│   │   ❌  UNSAFE FOR JAIN       │  │
│   │   Confidence: 91%           │  │
│   └─────────────────────────────┘  │
│                                     │
│   Maggi 2-Minute Noodles            │
│   Scanned 2 minutes ago             │
│                                     │
│   ❌ Violations Found (2)           │
│   • Onion powder                    │
│   • Garlic powder                   │
│                                     │
│   Why It's Unsafe                   │
│   This product contains onion and   │
│   garlic powder, which are not      │
│   allowed in Jain diet.             │
│                                     │
│   ▶ View all ingredients            │
│                                     │
│   🔄 Re-scan Product                │
│   ⚠️ Report Error                   │
└─────────────────────────────────────┘
```

#### Result Screen - UNCERTAIN

```
┌─────────────────────────────────────┐
│  ← Back                              │
├─────────────────────────────────────┤
│   [Product Image]                   │
│                                     │
│   ┌─────────────────────────────┐  │
│   │   ❓  UNCERTAIN              │  │
│   │   Confidence: 62%           │  │
│   └─────────────────────────────┘  │
│                                     │
│   Generic Cookies                   │
│   Scanned just now                  │
│                                     │
│   ⚠️ Cannot Determine               │
│   We cannot confidently determine   │
│   if this is safe.                  │
│                                     │
│   Ambiguous Items:                  │
│   • "Natural flavoring" (source     │
│     unclear)                        │
│   • E471 (could be plant or animal) │
│                                     │
│   💡 Recommendation:                │
│   Contact manufacturer or avoid     │
│   this product to be safe.          │
│                                     │
│   ⚠️ Report Product for Review      │
└─────────────────────────────────────┘
```

---

### 4. HISTORY TAB

```
┌─────────────────────────────────────┐
│  History                  🔍  ⋮     │
├─────────────────────────────────────┤
│  ▼ Today                            │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ 🟢 Lay's Classic            │  │
│   │ 2:15 PM • Safe • 94%        │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ 🔴 Maggi Noodles            │  │
│   │ 10:30 AM • Unsafe           │  │
│   │ Onion powder detected       │  │
│   └─────────────────────────────┘  │
│                                     │
│  ▼ Yesterday                        │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ 🟢 Amul Milk                │  │
│   │ 8:45 PM • Safe • 98%        │  │
│   └─────────────────────────────┘  │
└─────────────────────────────────────┘
│  History    Scan      Profile       │
│    📋        📷         👤          │
└─────────────────────────────────────┘
```

**Features:**

- Swipe left on item → Delete
- Tap item → Detail view
- Search bar (🔍)
- Filter menu (⋮)

**Filter Options:**

```
┌─────────────────────────────────────┐
│  Filter Scans                       │
│                                     │
│  Verdict                            │
│  [ ] Safe                           │
│  [ ] Unsafe                         │
│  [ ] Caution                        │
│  [ ] Uncertain                      │
│                                     │
│  Date Range                         │
│  [Today ▼]                          │
│                                     │
│  [Cancel]  [Apply]                  │
└─────────────────────────────────────┘
```

---

### 5. PROFILE TAB

```
┌─────────────────────────────────────┐
│  Profile                            │
├─────────────────────────────────────┤
│        👤                           │
│    Your Name                        │
│    name@email.com                   │
│    Jain Diet                        │
│                                     │
│   📊 Your Activity                  │
│   ┌─────────────────────────────┐  │
│   │  Total Scans: 47            │  │
│   │  This Month: 12             │  │
│   │  Safe Products: 38          │  │
│   └─────────────────────────────┘  │
│                                     │
│   ⚙️  Account                      │
│   • Edit Dietary Preferences        │
│   • Email & Password                │
│   • Delete Account                  │
│                                     │
│   🔒 Privacy & Data                │
│   • Download My Data                │
│   • Delete Scan History             │
│   • Privacy Policy                  │
│                                     │
│   🛠️  Settings                     │
│   • Notifications                   │
│   • Permissions                     │
│                                     │
│   💬 Support                        │
│   • Contact Us                      │
│   • Report a Bug                    │
│   • FAQs                            │
│                                     │
│   🚪 Log Out                        │
└─────────────────────────────────────┘
```

---

## USER FLOWS

### Flow 1: First Time User Journey

```
1. Download App
   ↓
2. Open App → Login/Signup Screen
   ↓
3. Sign Up (Google or Email)
   ↓
4. Onboarding Screen 1: Welcome
   ↓
5. Onboarding Screen 2: Select Community (Jain)
   ↓
6-10. Onboarding Screens 3-7: Customize Restrictions
   ↓
11. Onboarding Screen 8: Add Allergies
   ↓
12. Onboarding Screen 9: Review Summary
   ↓
13. Lands on Home/Scan Tab (Empty State)
   ↓
14. Taps "Scan Product"
   ↓
15. Permission Request (Camera)
   ↓
16. Camera Screen Opens
   ↓
17. Takes 1-2 Photos
   ↓
18. Reviews Photos → "Looks Good"
   ↓
19. Processing Screen (2-3 seconds)
   ↓
20. Result Screen (SAFE/UNSAFE/CAUTION/UNCERTAIN)
   ↓
21. Taps "Done" → Returns to Home
   ↓
22. Recent Scans Now Shows Last Scan
```

**Drop-off Points to Monitor:**

- Onboarding Screen 3 (30% expected)
- Camera permissions (10% expected)
- First scan completion (5% expected)

**Success Metric:** 70% reach first scan completion

---

### Flow 2: Returning User Journey

```
1. Open App
   ↓
2. Auto-login (JWT stored)
   ↓
3. Lands on Home/Scan Tab (Shows Recent Scans)
   ↓
4. Taps "Scan Product"
   ↓
5. Camera Opens (No Permission Request)
   ↓
6. Takes Photo → Processing → Result
   ↓
7. Views Result → Taps "Done"
   ↓
8. Back to Home
```

**Time to First Scan:** <30 seconds (target)

---

### Flow 3: Edit Dietary Preferences

```
1. Profile Tab
   ↓
2. Tap "Edit Dietary Preferences"
   ↓
3. Shows Current Settings:
   - Community: Jain
   - Exceptions: Potatoes, Carrots
   - Allergies: Peanuts
   ↓
4. Tap "Change Community" → Re-onboarding (simplified)
   OR
   Tap "+ Add Exception" → Modal with search
   OR
   Tap "× Remove" on exception → Confirmation
   ↓
5. Tap "Save Changes"
   ↓
6. Confirmation: "Preferences updated"
   ↓
7. Returns to Profile Tab
```

---

### Flow 4: Report Error

```
1. Result Screen (any verdict)
   ↓
2. Tap "⚠️ Report Error"
   ↓
3. Error Report Form:
   ┌─────────────────────────────────────┐
   │  Report an Error                    │
   │                                     │
   │  What's wrong?                      │
   │  ○ Wrong verdict                    │
   │  ○ Missed ingredient                │
   │  ○ Other                            │
   │                                     │
   │  Tell us more:                      │
   │  ┌─────────────────────────────┐   │
   │  │ [Text area]                 │   │
   │  └─────────────────────────────┘   │
   │                                     │
   │  [Cancel]  [Submit]                 │
   └─────────────────────────────────────┘
   ↓
4. Submit → "Thank you for your feedback"
   ↓
5. Backend logs error report
   ↓
6. Team reviews weekly, improves prompts
```

## COMPLETE USER FLOW: FIRST SCAN

### Flow Diagram

User opens app (first time)
↓
Onboarding (10 screens with progress bar)
↓
Home Screen (empty state, no scans)
Shows: Tips + "Tap Scan to get started"
↓
User taps "Scan" in bottom tab bar
↓
IF camera permission NOT granted:
System dialog: "Allow camera access?"
↓
Camera Screen opens
Shows: Viewfinder + framing guide
↓
User positions label in frame
↓
User taps CAPTURE button
↓
Photo Preview Screen (Photo 1 of 1)
Shows: Captured image
Options: [Retake] [Start Scanning] [Add Another]
↓
User taps "Start Scanning"
↓
Frontend:

Compress image (1200x1600, 70% JPEG)
Convert to base64
POST /scan with base64 + JWT token
↓
Backend receives request:
Verify JWT (BetterAuth)
Fetch user profile from database
Build Tier 1 system prompt (community + exceptions)
↓
Tier 1 LLM Call (Gemini 3 Flash):
Send images + system prompt
Gemini Grounding enabled (auto-search if needed)
Gemini analyzes ingredients
Returns JSON: {verdict, confidence, reasoning, ...}
↓
Check confidence threshold:
IF >= 0.90: Return Tier 1 result
ELSE: Escalate to Tier 2
↓
Tier 2 LLM Call (if needed - GPT-5.2):
Re-analyze with deeper reasoning
Returns JSON
↓
Conflict Resolution:
Apply rules (trust higher confidence, safety-first, etc.)
Determine final verdict
↓
Upload image to Backblaze B2:
Path: {userId}/{scanId}.jpg
Returns: Public URL
↓
Save to Supabase database:
INSERT INTO scans (verdict, confidence, ingredients, ...)
Returns: scan ID
↓
Return response to frontend:
{scanId, verdict, confidence, reasoning, ...}
↓
Frontend receives response
↓
Navigate to Result Screen
Shows: Big verdict badge + confidence + reasoning
↓
User views result:
Reads verdict (SAFE/UNSAFE/CAUTION/UNCERTAIN)
Reads reasoning
Sees ingredient list
Options: [Done] [Re-scan] [Report Error]
↓
User taps "Done"
↓
Navigate back to Home Screen
Now shows: Recent scan in list
---

## INTERACTION PATTERNS

### Navigation

**Tab Bar (Bottom):**

- History (left)
- Scan (center, primary)
- Profile (right)

**Gesture Controls:**

- Swipe left on history item → Delete
- Pull to refresh → Refresh history
- Tap outside modal → Dismiss

### Loading States

**Skeleton Screens:**

- History loading → Show 3 gray rectangles
- Profile loading → Show gray circles + lines

**Progress Indicators:**

- Scan processing → Progress bar + tips
- Image upload → Spinner

### Error States

**Network Error:**

```
┌─────────────────────────────────────┐
│   ❌ No Internet Connection         │
│                                     │
│   Please check your connection      │
│   and try again.                    │
│                                     │
│   [Retry]                           │
└─────────────────────────────────────┘
```

**Camera Permission Denied:**

```
┌─────────────────────────────────────┐
│   📷 Camera Access Required         │
│                                     │
│   We need camera access to scan     │
│   product labels.                   │
│                                     │
│   [Open Settings]                   │
└─────────────────────────────────────┘
```

---

## ACCESSIBILITY

### Requirements

- **VoiceOver (iOS) / TalkBack (Android):** All interactive elements labeled
- **Dynamic Type:** Support text size preferences
- **Color Contrast:** WCAG AA minimum (4.5:1)
- **Touch Targets:** Minimum 44x44 points
- **Reduced Motion:** Respect system preference

### Implementation

```typescript
// Accessibility labels
<Button 
  onPress={handleScan}
  accessible={true}
  accessibilityLabel="Scan product"
  accessibilityHint="Opens camera to scan product label"
>
  📷 Scan Product
</Button>

// Dynamic type
<Text style={{
  fontSize: Platform.select({
    ios: 17, // iOS default
    android: 16
  }),
  // Scales with user preferences
  maxFontSizeMultiplier: 1.3
}}>
  Your Dietary Profile
</Text>
```

---

**END OF PRD 03: USER EXPERIENCE & FLOWS**

**Related Documents:**
← PRD 02: Technical Architecture
→ PRD 04: API Specifications
→ PRD 05: Data Models & Policies
