# LLM SYSTEM PROMPTS & FLOW SPECIFICATION

## Food Dietary Compliance Analyzer

**Version:** 1.0  
**Date:** January 3, 2026  
**Tech Stack:** BetterAuth + Supabase + Backblaze B2 + Brevo + Express

---

## TABLE OF CONTENTS

1. Complete System Flow (Tier 1 → Tier 2)
2. Confidence Threshold Logic (90% / 70% / <70%)
3. System Prompts (All 4 Communities)
4. JSON Input/Output Schemas
5. Search Integration (Gemini Grounding within LLM)
6. Conflict Resolution Rules
7. Database Storage Schema
8. Frontend Display Logic

---

## 1. COMPLETE SYSTEM FLOW

### End-to-End Flow (User → LLM → Database → Frontend)

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User Captures Images                               │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         User takes 1-3 photos of ingredient label
         Client compresses images (1200x1600, 70% JPEG)
         Images converted to base64
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Backend Receives Request                           │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         POST /scan
         Request body: {
           images: ["base64_img1", "base64_img2"]
         }
         Auth: Bearer Token (BetterAuth)
         User profile fetched: { community, exceptions, allergies }
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: TIER 1 - Gemini 3 Flash Analysis                   │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         Build system prompt (community-specific + exceptions)
         Call Gemini 3 Flash Vision API with:
           - System prompt
           - Base64 images
           - Gemini Grounding enabled (search within LLM)
                        │
                        ▼
         Gemini analyzes images
         IF ambiguous ingredients detected (E-numbers, "natural")
           → Gemini uses Grounding API internally
           → Searches: "E471 source India vegan"
           → Incorporates search results into analysis
                        │
                        ▼
         Gemini returns JSON:
         {
           verdict: "SAFE" | "UNSAFE" | "CAUTION",
           confidence: 0.92,
           reasoning: "...",
           ingredients: [...],
           violations: [...],
           ambiguous_items: [...]
         }
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Check Confidence Threshold                         │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         IF confidence >= 0.90:
           → HIGH confidence
           → Return Tier 1 result immediately
           → Skip Tier 2
                        │
         ELSE IF 0.70 <= confidence < 0.90:
           → MEDIUM confidence
           → Escalate to Tier 2
                        │
         ELSE (confidence < 0.70):
           → LOW confidence
           → Escalate to Tier 2
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: TIER 2 - GPT-5.2 Re-Analysis (if needed)           │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         Call GPT-5.2 with:
           - Same system prompt
           - Tier 1 results (for context)
           - Original ingredients list
           - Search results (if any from Tier 1)
                        │
                        ▼
         GPT-5.2 performs deeper reasoning
         Returns JSON (same schema as Tier 1)
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Conflict Resolution (if Tier 2 was called)         │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         Apply resolution rules:
         
         1. IF Tier 2 confidence >= 0.85:
              → Trust Tier 2 completely
         
         2. ELSE IF both confidence < 0.70:
              → Return UNCERTAIN verdict
         
         3. ELSE IF either says UNSAFE:
              → Return UNSAFE (safety-first bias)
         
         4. ELSE:
              → Trust higher confidence result
                        │
                        ▼
         Final result determined
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Upload Image to Backblaze B2                       │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         Upload compressed image to B2
         Path: {userId}/{scanId}.jpg
         Get signed URL (valid 90 days)
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Save to Database (Supabase PostgreSQL)             │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         INSERT INTO scans:
         {
           user_id: "uuid",
           verdict: "SAFE",
           confidence: 0.92,
           reasoning: "...",
           ingredients: [...],
           violations: [],
           tier: 1,
           model: "gemini-3-flash",
           tier1_confidence: null,  // or 0.75 if Tier 2 used
           tier1_verdict: null,     // or "CAUTION" if Tier 2 used
           image_url: "https://b2.url/...",
           processing_time_ms: 1850,
           user_community: "Jain",
           user_exceptions: ["potatoes"],
           created_at: NOW()
         }
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: Return Response to Frontend                        │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         Response (200 OK):
         {
           scanId: "uuid",
           verdict: "SAFE",
           confidence: 0.92,
           reasoning: "...",
           ingredients: [...],
           violations: [],
           tier: 1,
           model: "gemini-3-flash",
           processingTimeMs: 1850,
           createdAt: "2026-01-03T..."
         }
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 10: Frontend Displays Result                          │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
         Result Screen shows:
         - Big verdict badge (SAFE/UNSAFE/CAUTION/UNCERTAIN)
         - Confidence score (92%)
         - Color coding (green/red/yellow/gray)
         - Ingredients list
         - Violations (if any)
         - Reasoning explanation
```

---

## 2. CONFIDENCE THRESHOLD LOGIC

### Thresholds (FIXED)

```javascript
const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.90,      // >= 90% = High confidence
  MEDIUM: 0.70,    // 70-89% = Medium confidence
  LOW: 0.70        // < 70% = Low confidence
};

function determineAction(tier1Result) {
  if (tier1Result.confidence >= CONFIDENCE_THRESHOLDS.HIGH) {
    // High confidence (>= 90%)
    return {
      action: 'RETURN_IMMEDIATELY',
      escalate: false,
      reason: 'High confidence, no need for Tier 2'
    };
  } else if (tier1Result.confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    // Medium confidence (70-89%)
    return {
      action: 'ESCALATE_TO_TIER2',
      escalate: true,
      reason: 'Medium confidence, escalate for verification'
    };
  } else {
    // Low confidence (< 70%)
    return {
      action: 'ESCALATE_TO_TIER2',
      escalate: true,
      reason: 'Low confidence, needs deeper analysis'
    };
  }
}
```

### Escalation Logic (NO CODE IN PROMPTS)

**Tier 1 Result → Decision:**

- Confidence >= 90% → Return immediately (no Tier 2)
- Confidence 70-89% → Escalate to Tier 2
- Confidence < 70% → Escalate to Tier 2

**Example:**

```
Tier 1: { verdict: "SAFE", confidence: 0.75 }
→ Medium confidence (70-89%)
→ Escalate to Tier 2
→ Tier 2 analyzes same data
→ Returns: { verdict: "SAFE", confidence: 0.88 }
→ Trust Tier 2 (higher confidence)
```

---

## 3. SYSTEM PROMPTS (ALL 4 COMMUNITIES)

### A. JAIN DIETARY COMPLIANCE ANALYZER

```
You are a JAIN DIETARY COMPLIANCE ANALYZER with deep knowledge of Jain dietary restrictions.

CRITICAL: Use Gemini Grounding (search) ONLY when you encounter ambiguous ingredients whose sources you cannot confidently determine (E-numbers, "natural flavoring", regional variations). The search happens automatically within your analysis - you don't need to explicitly call a search function.

STRICT JAIN RULES (NEVER ALLOW):
1. NO meat, poultry, fish, seafood (any form)
2. NO eggs (whole, powder, albumin, lecithin from eggs)
3. NO onion (fresh, powder, paste, extract, dried)
4. NO garlic (fresh, powder, paste, extract, dried)
5. NO root vegetables: potatoes, carrots, beets, radishes, turnips, ginger, turmeric (root form)
6. NO honey
7. NO certain E-numbers:
   - E120 (Cochineal/Carmine - insect-derived red dye)
   - E542 (Bone phosphate)
   - E631 (Disodium Inosinate - may be fish-derived)
   - E627 (Disodium Guanylate - may be fish-derived)
   - E635 (Disodium Ribonucleotides - may be fish-derived)
   - E904 (Shellac - insect resin)
   - E441 (Gelatin - animal-derived)
8. NO gelatin, rennet, lard, tallow
9. NO fermented foods (except yogurt/curd for some Jains)
10. NO alcohol

ALLOWED:
- Dairy products (milk, yogurt, cheese, butter, ghee)
- Vegetables (above-ground only, unless user has exceptions)
- Fruits, grains, legumes, nuts, seeds
- Plant-based oils

USER EXCEPTIONS (if provided):
The user has indicated they are okay with: [EXCEPTIONS_PLACEHOLDER]
These items should be treated as ALLOWED even if normally restricted in Jain diet.

USER ALLERGIES (if provided):
The user has allergies to: [ALLERGIES_PLACEHOLDER]
Mark these as UNSAFE regardless of Jain rules.

ANALYSIS INSTRUCTIONS:
1. Extract ALL ingredients from the image(s)
2. For each ingredient, check against Jain rules + user exceptions + allergies
3. If you encounter ambiguous ingredients (E-numbers, "natural flavoring", etc.) whose source is unclear, use search to verify
4. Determine verdict: SAFE, UNSAFE, or CAUTION
5. Calculate confidence score (0.0-1.0):
   - 0.90-1.0 = High confidence (all ingredients clear)
   - 0.70-0.89 = Medium confidence (some ambiguity)
   - 0.0-0.69 = Low confidence (significant ambiguity or unclear ingredients)

RETURN JSON (strict format):
{
  "verdict": "SAFE" | "UNSAFE" | "CAUTION",
  "confidence": 0.92,
  "reasoning": "This product contains only plant-based ingredients that align with Jain dietary preferences. No animal products, root vegetables (except potatoes which user allows), or prohibited additives detected.",
  "ingredients": ["potatoes", "vegetable oil", "salt", "spices (verified no onion/garlic)"],
  "violations": [],
  "ambiguous_items": []
}

VERDICT RULES:
- SAFE: All ingredients comply with Jain rules + user preferences
- UNSAFE: Contains prohibited ingredients (onion, garlic, animal products, etc.)
- CAUTION: Contains ambiguous ingredients that may or may not be safe

CONFIDENCE CALCULATION:
- Start at 1.0
- Deduct 0.05 for each ambiguous ingredient
- Deduct 0.10 for each unreadable label section
- Deduct 0.15 if source language is unfamiliar
- Minimum confidence: 0.30

EXAMPLES:

Example 1 (SAFE):
Input: Lay's Classic Salted
Ingredients: Potatoes, Vegetable Oil, Salt
Output:
{
  "verdict": "SAFE",
  "confidence": 0.98,
  "reasoning": "Product contains only plant-based ingredients. Potatoes are allowed per user exception. No prohibited items.",
  "ingredients": ["potatoes", "vegetable oil", "salt"],
  "violations": [],
  "ambiguous_items": []
}

Example 2 (UNSAFE):
Input: Maggi Noodles
Ingredients: Wheat Flour, Palm Oil, Salt, Onion Powder, Garlic Powder
Output:
{
  "verdict": "UNSAFE",
  "confidence": 0.95,
  "reasoning": "Product contains onion powder and garlic powder, which are strictly prohibited in Jain diet.",
  "ingredients": ["wheat flour", "palm oil", "salt", "onion powder", "garlic powder"],
  "violations": ["onion powder", "garlic powder"],
  "ambiguous_items": []
}

Example 3 (CAUTION):
Input: Generic Cookies
Ingredients: Flour, Sugar, Natural Flavoring, E471
Output:
{
  "verdict": "CAUTION",
  "confidence": 0.72,
  "reasoning": "Product contains E471 (mono- and diglycerides) which can be plant or animal-derived depending on region. Natural flavoring source is also unclear. Recommend contacting manufacturer.",
  "ingredients": ["flour", "sugar", "natural flavoring", "E471"],
  "violations": [],
  "ambiguous_items": [
    {"ingredient": "natural flavoring", "reason": "Source unclear, could be plant or animal-based"},
    {"ingredient": "E471", "reason": "Can be plant-derived or animal-derived"}
  ]
}

CRITICAL REMINDERS:
- If you can't read the label clearly, lower confidence score
- If multiple languages and some sections are unclear, note this in reasoning
- Use search automatically when encountering E-numbers or ambiguous terms
- Regional variations matter (E631 in India vs Europe may have different sources)
- Always err on the side of caution for religious compliance
```

---

### B. VAISHNAVA DIETARY COMPLIANCE ANALYZER

```
You are a VAISHNAVA DIETARY COMPLIANCE ANALYZER with deep knowledge of ISKCON/Krishna consciousness dietary rules.

CRITICAL: Use Gemini Grounding (search) ONLY when you encounter ambiguous ingredients. Search happens automatically within your analysis.

STRICT VAISHNAVA RULES (NEVER ALLOW):
1. NO meat, poultry, fish, seafood (any form)
2. NO eggs (whole, powder, albumin)
3. NO onion (fresh, powder, paste, extract)
4. NO garlic (fresh, powder, paste, extract)
5. NO mushrooms (all types)
6. NO caffeine (coffee, tea, chocolate - unless specifically allowed)
7. NO alcohol
8. NO certain E-numbers (same as Jain: E120, E631, E627, E635, E904, E441)
9. NO excessive spices or stimulating foods
10. NO fermented foods (except yogurt/curd)

SATTVIC PRINCIPLE:
Food must be in mode of goodness (sattvic) - pure, fresh, wholesome.
Avoid tamasic (impure) and rajasic (overstimulating) foods.

ALLOWED:
- Dairy products (milk, yogurt, paneer, ghee)
- Fruits, vegetables (above-ground), grains
- Legumes, nuts (except excess chili/spices)
- Sweet preparations offered to Krishna

USER EXCEPTIONS: [EXCEPTIONS_PLACEHOLDER]
USER ALLERGIES: [ALLERGIES_PLACEHOLDER]

ANALYSIS INSTRUCTIONS: [Same as Jain]

RETURN JSON: [Same schema as Jain]

CONFIDENCE CALCULATION: [Same as Jain]
```

---

### C. SWAMINARAYAN DIETARY COMPLIANCE ANALYZER

```
You are a SWAMINARAYAN DIETARY COMPLIANCE ANALYZER with deep knowledge of BAPS Swaminarayan dietary rules.

CRITICAL: Use Gemini Grounding (search) ONLY when you encounter ambiguous ingredients.

STRICT SWAMINARAYAN RULES (NEVER ALLOW):
1. NO meat, poultry, fish, seafood (any form)
2. NO eggs (any form)
3. NO onion (any form)
4. NO garlic (any form)
5. NO certain vegetables: eggplant, potatoes (unless exception), drumsticks
6. NO intoxicants (alcohol, drugs)
7. NO fermented foods
8. NO certain E-numbers (same as Jain/Vaishnava)

PURITY EMPHASIS:
Swaminarayan diet emphasizes spiritual purity and non-violence.
Food should be pure, vegetarian, and prepared with devotion.

ALLOWED:
- Dairy products
- Vegetables (except prohibited)
- Fruits, grains, legumes

USER EXCEPTIONS: [EXCEPTIONS_PLACEHOLDER]
USER ALLERGIES: [ALLERGIES_PLACEHOLDER]

ANALYSIS INSTRUCTIONS: [Same as Jain]

RETURN JSON: [Same schema]
```

---

### D. VEGAN DIETARY COMPLIANCE ANALYZER

```
You are a VEGAN DIETARY COMPLIANCE ANALYZER.

CRITICAL: Use Gemini Grounding (search) ONLY when you encounter ambiguous ingredients.

STRICT VEGAN RULES (NEVER ALLOW):
1. NO meat, poultry, fish, seafood
2. NO dairy (milk, butter, cheese, yogurt, whey, casein, lactose)
3. NO eggs (whole, powder, albumin, lecithin)
4. NO honey
5. NO gelatin (E441)
6. NO certain E-numbers:
   - E120 (Cochineal - insect)
   - E542 (Bone phosphate)
   - E631, E627, E635 (may be fish-derived)
   - E904 (Shellac - insect)
   - E901 (Beeswax)
   - E913 (Lanolin - sheep)
7. NO animal-derived ingredients: lard, tallow, suet, rennet
8. NO unclear "natural flavoring" unless verified plant-based

ALLOWED:
- All plant-based foods
- Plant-based oils, milks, proteins

USER EXCEPTIONS: [EXCEPTIONS_PLACEHOLDER]
USER ALLERGIES: [ALLERGIES_PLACEHOLDER]

ANALYSIS INSTRUCTIONS: [Same as Jain]

RETURN JSON: [Same schema]
```

---

## 4. JSON INPUT/OUTPUT SCHEMAS

### Tier 1 API Call (Gemini 3 Flash)

**Request:**

```json
{
  "model": "gemini-3-flash",
  "system": "[System prompt with community + exceptions + allergies]",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze these ingredient labels for Jain dietary compliance:"
        },
        {
          "type": "image",
          "image": "base64_encoded_image_1"
        },
        {
          "type": "image",
          "image": "base64_encoded_image_2"
        }
      ]
    }
  ],
  "temperature": 0.2,
  "max_tokens": 2000,
  "response_format": { "type": "json" },
  "tools": [
    {
      "type": "google_search_grounding"
    }
  ]
}
```

**Response (JSON Schema):**

```typescript
interface Tier1Response {
  verdict: "SAFE" | "UNSAFE" | "CAUTION";
  confidence: number; // 0.0 - 1.0
  reasoning: string;
  ingredients: string[];
  violations: string[];
  ambiguous_items: Array<{
    ingredient: string;
    reason: string;
  }>;
}
```

**Example Response:**

```json
{
  "verdict": "SAFE",
  "confidence": 0.94,
  "reasoning": "This product contains only plant-based ingredients that align with Jain dietary preferences. No animal products, root vegetables (except potatoes which user allows), or prohibited additives detected.",
  "ingredients": [
    "potatoes",
    "vegetable oil",
    "salt",
    "spices (verified no onion/garlic)"
  ],
  "violations": [],
  "ambiguous_items": []
}
```

---

### Tier 2 API Call (GPT-5.2)

**Request:**

```json
{
  "model": "gpt-5.2",
  "system": "[Same system prompt as Tier 1]",
  "messages": [
    {
      "role": "user",
      "content": "Previous analysis (Tier 1) returned medium/low confidence. Please re-analyze:\n\nTier 1 Result:\nVerdict: CAUTION\nConfidence: 0.75\nReasoning: Contains E471 which may be plant or animal-derived\n\nIngredients detected: flour, sugar, natural flavoring, E471\n\nPlease provide a more thorough analysis with deeper reasoning."
    }
  ],
  "temperature": 0.1,
  "max_tokens": 1500,
  "response_format": { "type": "json" }
}
```

**Response (Same JSON Schema as Tier 1):**

```json
{
  "verdict": "CAUTION",
  "confidence": 0.82,
  "reasoning": "E471 (mono- and diglycerides) can be either plant-based or animal-derived. In India, it is typically palm oil-based, but in Europe it may be animal-derived. Natural flavoring source is also unclear. Without manufacturer confirmation, recommend caution.",
  "ingredients": ["flour", "sugar", "natural flavoring", "E471"],
  "violations": [],
  "ambiguous_items": [
    {
      "ingredient": "E471",
      "reason": "Can be plant-derived (palm oil) or animal-derived (beef/pork fat)"
    },
    {
      "ingredient": "natural flavoring",
      "reason": "Source not specified, could be plant or animal-based"
    }
  ]
}
```

---

## 5. SEARCH INTEGRATION (GEMINI GROUNDING)

### How Search Works (Within LLM Call)

**IMPORTANT:** Search is triggered AUTOMATICALLY by Gemini when it encounters ambiguous ingredients. It's NOT a separate API call - it happens WITHIN the LLM analysis.

**When Gemini Searches:**

1. LLM encounters "E471" in ingredients
2. LLM doesn't know if E471 is plant or animal-derived in this region
3. Gemini automatically uses Grounding to search: "E471 source India vegan"
4. Search returns: "E471 in India is typically palm oil-based"
5. Gemini incorporates this into its analysis
6. Returns verdict with higher confidence

**You DON'T write code like:**

```javascript
// WRONG - Search is NOT a separate step
if (hasAmbiguousIngredients) {
  const searchResults = await searchAPI.search("E471 source");
  // Pass to LLM
}
```

**Gemini handles it internally:**

```javascript
// CORRECT - Just call Gemini, it searches automatically
const result = await gemini.analyze({
  images: base64Images,
  systemPrompt: communityPrompt,
  tools: [{ type: 'google_search_grounding' }]  // Enable search
});
// Gemini used search internally if needed, returns final result
```

### Search Trigger Conditions (AUTOMATIC by LLM)

Gemini searches when it sees:

- E-numbers (E471, E631, E120, etc.)
- "Natural flavoring"
- "Natural colors"
- Unclear ingredient names
- Regional product variations

**NOT triggered by confidence score** - that's determined AFTER analysis.

---

### Domain Filtering (For Future Enhancement)

When we eventually use Tavily instead of Gemini Grounding:

**Include Domains (Authoritative sources):**

```javascript
const TRUSTED_DOMAINS = [
  // India
  'fssai.gov.in',
  'indianveganfood.org',
  
  // Europe
  'efsa.europa.eu',
  'food.gov.uk',
  
  // USA
  'fda.gov',
  'usda.gov',
  
  // International
  'who.int',
  'codexalimentarius.org',
  
  // Vegan/Vegetarian databases
  'vegsoc.org',
  'vegansociety.com',
  'vrg.org'
];
```

**Exclude Domains (Unreliable):**

```javascript
const BLOCKED_DOMAINS = [
  'reddit.com',
  'quora.com',
  'answers.yahoo.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  // Marketing sites
  'sponsored.com',
  'ads.google.com'
];
```

---

## 6. CONFLICT RESOLUTION RULES

### When Tier 2 is Called

```javascript
function resolveConflict(tier1, tier2) {
  // Rule 1: Trust high-confidence Tier 2
  if (tier2.confidence >= 0.85) {
    return {
      final_verdict: tier2.verdict,
      final_confidence: tier2.confidence,
      final_reasoning: tier2.reasoning,
      tier_used: 2,
      tier1_result: tier1
    };
  }
  
  // Rule 2: Both low confidence = UNCERTAIN
  if (tier1.confidence < 0.70 && tier2.confidence < 0.70) {
    return {
      final_verdict: "UNCERTAIN",
      final_confidence: Math.max(tier1.confidence, tier2.confidence),
      final_reasoning: "Cannot confidently determine safety. Both analyses returned low confidence. Recommend contacting manufacturer or avoiding product.",
      tier_used: 2,
      tier1_result: tier1,
      ambiguous_items: [...tier1.ambiguous_items, ...tier2.ambiguous_items]
    };
  }
  
  // Rule 3: Safety-first bias (either says UNSAFE)
  if (tier1.verdict === "UNSAFE" || tier2.verdict === "UNSAFE") {
    const unsafeResult = tier2.verdict === "UNSAFE" ? tier2 : tier1;
    return {
      final_verdict: "UNSAFE",
      final_confidence: unsafeResult.confidence,
      final_reasoning: unsafeResult.reasoning + " (Safety-first: At least one analysis detected unsafe ingredients)",
      violations: unsafeResult.violations,
      tier_used: 2,
      tier1_result: tier1
    };
  }
  
  // Rule 4: Trust higher confidence
  const higherConfidence = tier2.confidence > tier1.confidence ? tier2 : tier1;
  return {
    final_verdict: higherConfidence.verdict,
    final_confidence: higherConfidence.confidence,
    final_reasoning: higherConfidence.reasoning,
    tier_used: 2,
    tier1_result: tier1
  };
}
```

### Example Conflicts

**Conflict 1: Tier 1 Medium → Tier 2 High (Improvement)**

```javascript
Tier 1: { verdict: "CAUTION", confidence: 0.78 }
Tier 2: { verdict: "SAFE", confidence: 0.91 }

→ Apply Rule 1: Trust Tier 2 (confidence >= 0.85)
→ Final: "SAFE" with 91% confidence
```

**Conflict 2: Disagreement on Safety**

```javascript
Tier 1: { verdict: "SAFE", confidence: 0.82 }
Tier 2: { verdict: "UNSAFE", confidence: 0.88, violations: ["E631"] }

→ Apply Rule 3: Safety-first bias
→ Final: "UNSAFE" with 88% confidence
→ Reasoning: "...Tier 2 detected E631 which may be fish-derived"
```

**Conflict 3: Both Low Confidence**

```javascript
Tier 1: { verdict: "CAUTION", confidence: 0.62 }
Tier 2: { verdict: "CAUTION", confidence: 0.68 }

→ Apply Rule 2: Both < 0.70
→ Final: "UNCERTAIN" with 68% confidence
→ Recommendation: "Contact manufacturer or avoid"
```

---

## 7. DATABASE STORAGE SCHEMA

### Table: scans

```sql
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Final Result
  verdict TEXT NOT NULL CHECK (verdict IN ('SAFE', 'UNSAFE', 'CAUTION', 'UNCERTAIN')),
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT NOT NULL,
  
  -- Ingredients
  ingredients JSONB NOT NULL,
  violations JSONB DEFAULT '[]'::jsonb,
  ambiguous_items JSONB DEFAULT '[]'::jsonb,
  
  -- LLM Metadata
  tier INTEGER NOT NULL CHECK (tier IN (1, 2)),
  model TEXT NOT NULL,
  
  -- Tier 1 Result (if Tier 2 was used)
  tier1_verdict TEXT,
  tier1_confidence DECIMAL(3,2),
  tier1_reasoning TEXT,
  
  -- Image
  image_url TEXT,
  
  -- Performance
  processing_time_ms INTEGER,
  
  -- User Context (snapshot at scan time)
  user_community TEXT NOT NULL,
  user_exceptions JSONB DEFAULT '[]'::jsonb,
  user_allergies JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Example Storage

**Tier 1 Only (High Confidence):**

```json
{
  "id": "uuid-1",
  "user_id": "user-uuid",
  "verdict": "SAFE",
  "confidence": 0.94,
  "reasoning": "All ingredients comply...",
  "ingredients": ["potatoes", "oil", "salt"],
  "violations": [],
  "ambiguous_items": [],
  "tier": 1,
  "model": "gemini-3-flash",
  "tier1_verdict": null,
  "tier1_confidence": null,
  "tier1_reasoning": null,
  "image_url": "https://b2.url/...",
  "processing_time_ms": 1450,
  "user_community": "Jain",
  "user_exceptions": ["potatoes"],
  "user_allergies": [],
  "created_at": "2026-01-03T10:00:00Z"
}
```

**Tier 2 Used (Medium/Low Confidence):**

```json
{
  "id": "uuid-2",
  "user_id": "user-uuid",
  "verdict": "UNSAFE",
  "confidence": 0.88,
  "reasoning": "Tier 2 analysis confirms E631 is fish-derived...",
  "ingredients": ["wheat", "E631", "salt"],
  "violations": ["E631"],
  "ambiguous_items": [],
  "tier": 2,
  "model": "gpt-5.2",
  "tier1_verdict": "CAUTION",
  "tier1_confidence": 0.75,
  "tier1_reasoning": "E631 source unclear...",
  "image_url": "https://b2.url/...",
  "processing_time_ms": 3200,
  "user_community": "Jain",
  "user_exceptions": [],
  "user_allergies": ["peanuts"],
  "created_at": "2026-01-03T10:05:00Z"
}
```

---

## 8. FRONTEND DISPLAY LOGIC

### Result Screen Components

**SAFE Verdict:**

```jsx
<ResultCard>
  <VerdictBadge color="green">
    ✅ SAFE FOR JAIN DIET
  </VerdictBadge>
  
  <Confidence>94% Confidence</Confidence>
  
  <Reasoning>
    This product contains only plant-based ingredients that align 
    with your Jain dietary preferences. No animal products, root 
    vegetables (except potatoes which you allow), or prohibited 
    additives detected.
  </Reasoning>
  
  <IngredientsList>
    <IngredientItem icon="✅">Potatoes</IngredientItem>
    <IngredientItem icon="✅">Vegetable oil</IngredientItem>
    <IngredientItem icon="✅">Salt</IngredientItem>
  </IngredientsList>
  
  <Actions>
    <Button>Re-scan Product</Button>
    <Button>Report Error</Button>
  </Actions>
</ResultCard>
```

**UNSAFE Verdict:**

```jsx
<ResultCard>
  <VerdictBadge color="red">
    ❌ UNSAFE FOR JAIN DIET
  </VerdictBadge>
  
  <Confidence>91% Confidence</Confidence>
  
  <Violations>
    ❌ Onion powder
    ❌ Garlic powder
  </Violations>
  
  <Reasoning>
    This product contains onion powder and garlic powder, which 
    are strictly prohibited in Jain diet.
  </Reasoning>
  
  <IngredientsList>
    <IngredientItem icon="❌">Onion powder</IngredientItem>
    <IngredientItem icon="❌">Garlic powder</IngredientItem>
    <IngredientItem icon="✅">Wheat flour</IngredientItem>
    <IngredientItem icon="✅">Salt</IngredientItem>
  </IngredientsList>
</ResultCard>
```

**CAUTION Verdict:**

```jsx
<ResultCard>
  <VerdictBadge color="yellow">
    ⚠️ CAUTION
  </VerdictBadge>
  
  <Confidence>78% Confidence</Confidence>
  
  <Reasoning>
    This product contains E471 which can be either plant-based 
    or animal-derived depending on the manufacturer and region.
  </Reasoning>
  
  <AmbiguousItems>
    ⚠️ E471: Can be plant or animal-derived
    ⚠️ Natural flavoring: Source unclear
  </AmbiguousItems>
  
  <Recommendation>
    We recommend contacting the manufacturer to verify the 
    source of these ingredients.
  </Recommendation>
</ResultCard>
```

**UNCERTAIN Verdict:**

```jsx
<ResultCard>
  <VerdictBadge color="gray">
    ❓ UNCERTAIN
  </VerdictBadge>
  
  <Confidence>62% Confidence</Confidence>
  
  <Reasoning>
    We cannot confidently determine if this product is safe. 
    The label contains several ambiguous ingredients whose 
    sources we couldn't verify.
  </Reasoning>
  
  <AmbiguousItems>
    {ambiguous_items.map(item => (
      <AmbiguousItem>
        ⚠️ {item.ingredient}: {item.reason}
      </AmbiguousItem>
    ))}
  </AmbiguousItems>
  
  <Recommendation>
    <strong>We recommend avoiding this product</strong> to be 
    safe, or contact the manufacturer for clarification.
  </Recommendation>
  
  <ReportButton>
    Report for Expert Review
  </ReportButton>
</ResultCard>
```

---

## 9. COMPLETE CODE EXAMPLE (Backend)

### Express Endpoint

```typescript
// routes/scan.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { scanRateLimit } from '../middleware/rateLimit';
import { LLMService } from '../services/llm';
import { StorageService } from '../services/storage';
import { DatabaseService } from '../services/database';

const router = Router();
const llmService = new LLMService();
const storageService = new StorageService();
const dbService = new DatabaseService();

router.post('/', 
  authMiddleware,
  scanRateLimit,
  async (req, res, next) => {
    try {
      const { images } = req.body; // base64 array
      const userId = req.user.id;
      
      const startTime = Date.now();
      
      // 1. Fetch user profile
      const profile = await dbService.getUserProfile(userId);
      
      // 2. Tier 1 Analysis
      const tier1Result = await llmService.analyzeTier1({
        images,
        community: profile.community,
        exceptions: profile.exceptions,
        allergies: profile.allergies,
        location: profile.location
      });
      
      // 3. Check if escalation needed
      let finalResult;
      if (tier1Result.confidence >= 0.90) {
        // High confidence - return immediately
        finalResult = {
          ...tier1Result,
          tier: 1,
          model: 'gemini-3-flash'
        };
      } else {
        // Medium/Low confidence - escalate to Tier 2
        const tier2Result = await llmService.analyzeTier2({
          tier1Result,
          community: profile.community,
          exceptions: profile.exceptions,
          allergies: profile.allergies
        });
        
        // Resolve conflict
        finalResult = llmService.resolveConflict(tier1Result, tier2Result);
      }
      
      // 4. Upload image to Backblaze B2
      const imageUrl = await storageService.uploadImage(
        userId,
        images[0] // First image
      );
      
      // 5. Save to database
      const processingTime = Date.now() - startTime;
      const scan = await dbService.saveScan({
        userId,
        ...finalResult,
        imageUrl,
        processingTimeMs: processingTime,
        userCommunity: profile.community,
        userExceptions: profile.exceptions,
        userAllergies: profile.allergies
      });
      
      // 6. Return response
      res.json({
        scanId: scan.id,
        verdict: finalResult.verdict,
        confidence: finalResult.confidence,
        reasoning: finalResult.reasoning,
        ingredients: finalResult.ingredients,
        violations: finalResult.violations,
        ambiguousItems: finalResult.ambiguous_items,
        tier: finalResult.tier,
        model: finalResult.model,
        processingTimeMs: processingTime,
        createdAt: scan.created_at
      });
      
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

---

**END OF LLM PROMPTS & FLOWS SPECIFICATION**

This document defines:
✅ Complete system flow (Step 1-10)
✅ Confidence thresholds (90% / 70% / <70%)
✅ All 4 community prompts
✅ Exact JSON schemas
✅ Search integration (within LLM)
✅ Conflict resolution
✅ Database storage
✅ Frontend display
✅ Code example
