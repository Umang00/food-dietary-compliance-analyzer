# PRD 02: TECHNICAL ARCHITECTURE

## Food Dietary Compliance Analyzer

**Document Version:** 1.0  
**Date:** January 2, 2026  
**Part of:** PRD Suite (Document 2 of 5)

---

## TABLE OF CONTENTS

1. Technology Stack Overview
2. System Architecture
3. Frontend Architecture (React Native)
4. Backend Architecture (Node.js)
5. LLM Integration Strategy
6. Database Design
7. Infrastructure & Deployment
8. Security & Privacy
9. Performance Requirements
10. Monitoring & Observability
11. Cost Analysis
12. Scalability Plan

---

## 1. TECHNOLOGY STACK OVERVIEW

### Final Stack (Approved Jan 2, 2026)

```
┌─────────────────────────────────────────────┐
│           FRONTEND (Mobile)                 │
│  React Native + Expo                        │
│  TypeScript                                 │
└─────────────────────────────────────────────┘
                    │
                    │ HTTPS/JSON
                    │
┌─────────────────────────────────────────────┐
│           BACKEND (API)                     │
│  Node.js + Express + TypeScript             │
│  Render.com (hosting)                       │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ┌───────────┼───────────┐
        │           │           │
┌───────▼──────┐ ┌─▼──────┐ ┌──▼─────────┐
│ Database     │ │  LLM   │ │  Search    │
│ (Supabase    │ │  APIs  │ │  APIs      │
│  Postgres)   │ │        │ │            │
└──────────────┘ └────────┘ └────────────┘
        │
┌───────▼──────┐
│  Auth        │
│ (BetterAuth) │
└──────────────┘
        │
┌───────▼──────┐
│  Storage     │
│ (Backblaze)  │
└──────────────┘
```

### Component Breakdown

### Final Stack (Approved January 3, 2026)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Authentication** | BetterAuth | Avoid vendor lock-in, modern features, TypeScript-first, Bearer Token support |
| **Database** | Supabase PostgreSQL | Managed Postgres, free tier, RLS for security |
| **Storage** | Backblaze B2 | 10GB free, S3-compatible, $5/TB at scale |
| **Email** | Brevo | 300 emails/day free (vs Resend 100/day) |
| **Backend** | Node.js + Express | Mature ecosystem, faster development |
| **Frontend** | React Native + Expo | Cross-platform, large community |
| **LLM Tier 1** | Gemini 3 Flash | Fast, $0.001/scan, vision + grounding |
| **LLM Tier 2** | GPT-5.2 | High accuracy, $0.005/scan |
| **LLM SDK** | Vercel AI SDK | Unified interface, provider switching |
| **Push Notifications** | OneSignal | Free tier, works when app closed |
| **Error Tracking** | Sentry | Real-time errors, free tier |
| **Analytics** | PostHog | Events, feature flags, free tier |
| **Hosting** | Render.com | $7/month, auto-deploy, SSL |

---

## 2. SYSTEM ARCHITECTURE

### High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                        MOBILE APP (React Native)                │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Onboarding   │  │    Camera    │  │   History    │        │
│  │   Screens    │  │    Scanner   │  │   & Profile  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              State Management (Zustand)                   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              API Client (Axios + Auth Interceptor)        │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬──────────────────────────────────┘
                              │
                              │ HTTPS (TLS 1.3)
                              │ JWT in Authorization header
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                   BACKEND API (Node.js + Express)              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Middleware Stack                       │ │
│  │  1. CORS  2. Helmet  3. Rate Limit  4. Auth (BetterAuth)  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │   Routes    │  │  Services   │  │    Utils    │           │
│  │  /auth      │  │  LLM Svc    │  │  Validation │           │
│  │  /scan      │  │  Search Svc │  │  Image Proc │           │
│  │  /history   │  │  Image Svc  │  │  Error Hand │           │
│  │  /profile   │  │  DB Svc     │  │             │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
└────────────┬───────────────┬──────────────┬────────────────────┘
             │               │              │
             │               │              │
    ┌────────▼────────┐ ┌───▼────────┐ ┌──▼──────────────┐
    │   Supabase      │ │  LLM APIs  │ │  External APIs  │
    │  (PostgreSQL)   │ │            │ │                 │
    │                 │ │ Gemini 3   │ │ Gemini Grounding│
    │                 │ │ Flash      │ │ (or Tavily)     │
    │                 │ │            │ │                 │
    │                 │ │ GPT-5.2    │ │ Brevo (Email)   │
    │                 │ │            │ │                 │
    │                 │ │            │ │ OneSignal       │
    │   BetterAuth    │ │            │ │ (Push)          │
    │     (Auth)      │ │            │ │                 │
    │                 │ │            │ │ Sentry          │
    │   Backblaze B2  │ │            │ │ (Errors)        │
    │    (Storage)    │ │            │ │                 │
    │                 │ │            │ │ PostHog         │
    └─────────────────┘ └────────────┘ │ (Analytics)     │
                                        └─────────────────┘
```

### Architecture Decisions & Rationale

#### **Why Node.js (Not Rust or Python)?**

**Decision:** Node.js + Express + TypeScript

**Rationale:**

1. ✅ **LLM SDK Maturity**: Official SDKs from OpenAI, Google (Gemini)
2. ✅ **Development Speed**: Faster MVP development (4 weeks achievable)
3. ✅ **Talent Pool**: Easier to hire/onboard developers
4. ✅ **Ecosystem**: Rich middleware (auth, rate limiting, validation)
5. ✅ **Sufficient Performance**: Bottleneck is LLM API (1-2 sec), not Node.js (5ms)

**Rejected Alternatives:**

- ❌ Rust: Steeper learning curve, LLM SDKs immature, slower development
- ❌ Python FastAPI: Good but Node.js has better Vercel AI SDK integration

#### **Why Vercel AI SDK (Not Direct Libraries)?**

**Decision:** Vercel AI SDK for LLM calls

**Rationale:**

1. ✅ **Unified Interface**: Single API for Gemini + OpenAI
2. ✅ **Provider Switching**: Change models without code rewrite
3. ✅ **Streaming Support**: Built-in (useful for future chat features)
4. ✅ **Has Required Parameters**: Temperature, max_tokens, vision support

#### **Why BetterAuth (Not Supabase Auth)?**

**Decision:** BetterAuth

**Rationale:**

1. ✅ **Vendor Agnostic**: Doesn't tie us to Supabase's specific auth implementation
2. ✅ **Bearer Token Support**: Good for Rest API/Mobile app usage
3. ✅ **Modern Features**: Easy plugins for Two Factor, Passkeys etc.

#### **Why Backblaze B2 (Not Supabase Storage)?**

**Decision:** Backblaze B2

**Rationale:**

1. ✅ **Cheaper**: $5/TB vs Supabase $25/TB (after free tier)
2. ✅ **AWS S3 Compatible**: Industry standard API
3. ✅ **Generous Free Tier**: 10GB free

**Trade-off Accepted:**

- ⚠️ New features lag 2-3 months (e.g., Gemini thinking_level)
- ⚠️ For MVP (Gemini 3 Flash + GPT-5.2), this is acceptable

#### **Why Supabase (Not Firebase or Custom)?**

**Decision:** Database

**Rationale:**

1. ✅ **PostgreSQL**: Relational data model fits our use case
2. ✅ **Row Level Security (RLS)**: Automatic data isolation per user based on BetterAuth IDs
3. ✅ **Free Tier**: 500MB DB, 1GB storage, 50K MAU

**Rejected Alternatives:**

- ❌ Firebase: NoSQL not ideal for relational scan data
- ❌ Custom PostgreSQL: More DevOps overhead

---

## 3. FRONTEND ARCHITECTURE (REACT NATIVE)

### Tech Stack Details

```
React Native 0.73+
├── Expo SDK 50+ (Camera, ImageManipulator, Location)
├── TypeScript 5.3+
├── Zustand (State Management)
├── React Navigation 6+ (Navigation)
├── Axios (HTTP Client)
├── React Query (Server State)
└── Expo Dev Client (Development)
```

### Project Structure

```
/mobile
├── /app                    # Expo Router (file-based routing)
│   ├── (auth)
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (onboarding)
│   │   ├── welcome.tsx
│   │   ├── community.tsx
│   │   ├── restrictions-[category].tsx
│   │   ├── allergies.tsx
│   │   └── summary.tsx
│   ├── (tabs)
│   │   ├── _layout.tsx
│   │   ├── scan.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── /components
│   ├── /ui                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── /features          # Feature-specific components
│   │   ├── CameraView.tsx
│   │   ├── ScanResult.tsx
│   │   └── HistoryList.tsx
│   └── /layout
│       └── SafeArea.tsx
├── /services
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth service
│   ├── camera.ts         # Camera utils
│   └── storage.ts        # Local storage
├── /store
│   ├── authStore.ts      # Auth state (Zustand)
│   ├── scanStore.ts      # Scan state
│   └── profileStore.ts   # User profile state
├── /hooks
│   ├── useAuth.ts
│   ├── useScan.ts
│   └── useHistory.ts
├── /types
│   └── index.ts          # TypeScript types
├── /constants
│   ├── colors.ts
│   ├── communities.ts    # Jain, Vaishnava, etc.
│   └── restrictions.ts   # Dietary rules
├── app.json              # Expo config
├── package.json
└── tsconfig.json
```

### State Management Strategy

**Zustand for Client State:**

```typescript
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```

**React Query for Server State:**

```typescript
// hooks/useScanHistory.ts
import { useQuery } from '@tanstack/react-query';

export function useScanHistory() {
  return useQuery({
    queryKey: ['scanHistory'],
    queryFn: async () => {
      const response = await api.get('/scans');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Image Compression (Client-Side)

**Why Client-Side:**

- Reduces upload size 80% (500KB → 100KB)
- Faster upload times
- Lower server bandwidth costs

**Implementation:**

```typescript
// services/camera.ts
import * as ImageManipulator from 'expo-image-manipulator';

export async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }], // Max width 1200px
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  
  return result.uri;
}

export async function compressMultipleImages(uris: string[]): Promise<string[]> {
  return Promise.all(uris.map(compressImage));
}
```

### Camera Integration

```typescript
// components/features/CameraView.tsx
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';

export function CameraView() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [images, setImages] = useState<string[]>([]);
  
  if (!permission?.granted) {
    return <PermissionRequest onRequest={requestPermission} />;
  }
  
  async function takePicture() {
    if (cameraRef.current && images.length < 3) {
      const photo = await cameraRef.current.takePictureAsync();
      const compressed = await compressImage(photo.uri);
      setImages([...images, compressed]);
    }
  }
  
  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} type={CameraType.back} style={styles.camera}>
        {/* Framing guide overlay */}
        <View style={styles.frame} />
      </Camera>
      
      <Button onPress={takePicture}>
        Capture ({images.length}/3)
      </Button>
    </View>
  );
}
```

---

## 4. BACKEND ARCHITECTURE (NODE.JS)

### Tech Stack Details

```
Node.js 20 LTS
├── Express 4.18+ (Web framework)
├── TypeScript 5.3+
├── better-auth (Authentication)
├── @supabase/supabase-js (DB client)
├── @aws-sdk/client-s3 (Backblaze B2 client)
├── Vercel AI SDK (LLM integration)
├── Axios (HTTP client for external APIs)
├── Helmet (Security headers)
├── Express Rate Limit (Rate limiting)
├── Express Validator (Input validation)
├── Winston (Logging)
└── Jest + Supertest (Testing)
```

### Project Structure

```
/backend
├── /src
│   ├── /routes
│   │   ├── auth.ts          # /auth/* endpoints
│   │   ├── scan.ts          # /scan/* endpoints
│   │   ├── history.ts       # /history/* endpoints
│   │   └── profile.ts       # /profile/* endpoints
│   ├── /services
│   │   ├── llm.ts           # LLM integration
│   │   ├── search.ts        # Gemini Grounding / Tavily
│   │   ├── image.ts         # Image processing
│   │   ├── database.ts      # DB queries
│   │   └── notification.ts  # Push + Email
│   ├── /middleware
│   │   ├── auth.ts          # JWT verification
│   │   ├── rateLimit.ts     # Rate limiting
│   │   ├── errorHandler.ts  # Error handling
│   │   └── validation.ts    # Request validation
│   ├── /utils
│   │   ├── prompts.ts       # System prompts (Jain, Vaishnava, etc.)
│   │   ├── confidence.ts    # Confidence scoring
│   │   └── logger.ts        # Winston logger
│   ├── /types
│   │   └── index.ts         # TypeScript types
│   ├── server.ts            # Express app
│   └── index.ts             # Entry point
├── /tests
│   ├── /unit
│   └── /integration
├── package.json
├── tsconfig.json
└── .env.example
```

### Middleware Stack

```typescript
// server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// BetterAuth setup
import { auth } from './auth';
import { toNodeHandler } from 'better-auth/node';

const app = express();

// 1. Security headers
app.use(helmet());

// 2. CORS (allow React Native app)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// 3. Body parsing (10MB limit for base64 images)
app.use(express.json({ limit: '10mb' }));

// 4. Request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 5. Global rate limit
const globalLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests'
});
app.use('/api/', globalLimit);

// 6. Authentication (BetterAuth Bearer Token)
app.use('/api/*', authMiddleware);

// BetterAuth API handler
app.all("/api/auth/*", toNodeHandler(auth));

// 7. Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/profile', profileRoutes);

// 8. Error handler (must be last)
app.use(errorHandler);

export default app;
```

### LLM Service Architecture

```typescript
// services/llm.ts
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

interface AnalysisRequest {
  images: string[]; // base64
  userProfile: UserProfile;
  searchResults?: string[];
}

interface AnalysisResult {
  verdict: 'SAFE' | 'UNSAFE' | 'CAUTION' | 'UNCERTAIN';
  confidence: number;
  reasoning: string;
  ingredients: string[];
  violations: string[];
  tier: 1 | 2;
}

export class LLMService {
  /**
   * Tier 1: Gemini 3 Flash with built-in Grounding
   * Search happens AUTOMATICALLY within LLM when it encounters ambiguous ingredients
   */
  async analyzeTier1(request: AnalysisRequest): Promise<AnalysisResult> {
    const systemPrompt = this.buildSystemPrompt(request.userProfile);
    
    const response = await generateText({
      model: google('gemini-3-flash'),
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze these ingredient labels:' },
          ...request.images.map(img => ({
            type: 'image',
            image: Buffer.from(img, 'base64')
          }))
        ]
      }],
      temperature: 0.2,
      maxTokens: 2000,
      responseFormat: { type: 'json' },
      tools: [
        { type: 'google_search_grounding' }  // Enable automatic search
      ]
    });
    
    const result = JSON.parse(response.text);
    result.tier = 1;
    result.model = 'gemini-3-flash';
    
    return result;
  }
  
  /**
   * Tier 2: GPT-5.2 for deeper analysis
   * Only called if Tier 1 confidence < 90%
   */
  async analyzeTier2(tier1Result: AnalysisResult, request: AnalysisRequest): Promise<AnalysisResult> {
    const systemPrompt = this.buildSystemPrompt(request.userProfile);
    
    const response = await generateText({
      model: openai('gpt-5.2'),
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Previous analysis returned ${tier1Result.confidence} confidence.
        
        Tier 1 Result:
        Verdict: ${tier1Result.verdict}
        Reasoning: ${tier1Result.reasoning}
        Ingredients: ${JSON.stringify(tier1Result.ingredients)}
        
        Please re-analyze with deeper reasoning.`
      }],
      temperature: 0.1,
      maxTokens: 1500,
      responseFormat: { type: 'json' }
    });
    
    const result = JSON.parse(response.text);
    result.tier = 2;
    result.model = 'gpt-5.2';
    
    return result;
  }
  
  /**
   * Main analysis orchestration
   */
  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    // Step 1: Tier 1 analysis (with automatic search)
    const tier1 = await this.analyzeTier1(request);
    
    // Step 2: Check confidence threshold
    if (tier1.confidence >= 0.90) {
      // High confidence - return immediately
      return tier1;
    }
    
    // Step 3: Medium/Low confidence - escalate to Tier 2
    const tier2 = await this.analyzeTier2(tier1, request);
    
    // Step 4: Resolve conflict
    return this.resolveConflict(tier1, tier2);
  }
}

/**
 * Search Integration via Gemini Grounding
 * 
 * IMPORTANT: Search happens AUTOMATICALLY inside Gemini LLM call.
 * Gemini triggers search when IT detects ambiguous ingredients.
 * We don't manually trigger search based on confidence scores.
 * 
 * Gemini searches when it encounters:
 * - E-numbers (E471, E631, etc.)
 * - "Natural flavoring"
 * - Unfamiliar ingredient names
 * - Regional variations
 * 
 * The confidence score is calculated AFTER the search results
 * are incorporated into the analysis.
 */

// NO separate search function needed!
// Gemini handles it internally via google_search_grounding tool
```

### System Prompts

```typescript
// utils/prompts.ts
export const SYSTEM_PROMPTS = {
  Jain: `You are a JAIN DIETARY COMPLIANCE ANALYZER.

STRICT JAIN RULES:
1. NO meat, poultry, fish, seafood
2. NO eggs (any form)
3. NO onion, garlic (fresh, powder, paste, extract)
4. NO root vegetables: potatoes, carrots, beets, radishes, turnips, ginger
5. NO honey
6. NO certain E-numbers:
   - E120 (Cochineal - insect dye)
   - E631, E627, E635 (may be fish-derived)
   - E904 (Shellac - insect resin)
7. NO gelatin, rennet
8. NO fermented foods (except yogurt for some)

ANALYZE ingredients and return JSON:
{
  "verdict": "SAFE" | "UNSAFE" | "CAUTION" | "UNCERTAIN",
  "confidence": 0.0-1.0,
  "reasoning": "1-2 sentence explanation",
  "ingredients": ["list of detected ingredients"],
  "violations": ["list of prohibited items found, if any"]
}`,

  Vaishnava: `You are a VAISHNAVA DIETARY COMPLIANCE ANALYZER...`,
  
  Swaminarayan: `You are a SWAMINARAYAN DIETARY COMPLIANCE ANALYZER...`,
  
  Vegan: `You are a VEGAN DIETARY COMPLIANCE ANALYZER...`
};
```

---

## 5. LLM INTEGRATION STRATEGY

### Multi-Tier Architecture

```
User Scans Product
       │
       ▼
┌──────────────────────┐
│   Tier 1: Gemini 3   │  ← Fast, cost-effective
│   Flash (Vision)     │     $0.001 per scan
└──────────────────────┘     94% of scans
       │
       │ Confidence Score
       │
       ├─────> ≥90%: Return immediately (High confidence)
       │
       ├─────> 70-90%: Escalate to Tier 2 (Medium confidence)
       │
       └─────> <70%: Escalate to Tier 2 (Low confidence)
               │
               ▼
        ┌──────────────────────┐
        │   Tier 2: GPT-5.2    │  ← High accuracy
        │   (Text Reasoning)   │     $0.005 per scan
        └──────────────────────┘     6% of scans
               │
               ▼
        Conflict Resolution
               │
               ▼
        Final Verdict
```

### Cost Optimization

**Tier Distribution (Expected):**

```
Total Scans: 10,000/month

Tier 1 Only (High confidence ≥90%): 70% = 7,000 scans
  Cost: 7,000 × $0.001 = $7

Tier 1 + Tier 2 (Medium/Low confidence): 30% = 3,000 scans
  Tier 1: 3,000 × $0.001 = $3
  Tier 2: 3,000 × $0.005 = $15
  Total: $18

Grand Total: $7 + $18 = $25/month
Per-scan average: $0.0025
```

### Search Integration

**When to Search:**

- Ambiguous ingredients detected (i.e. E-numbers, "natural flavoring")
- Confidence score <0.70
- Regional variations matter (user location provided)

**Search Strategy:**

```typescript
// services/search.ts
export class SearchService {
  // Try Gemini Grounding first (free 5K/month)
  async searchIngredients(
    ingredients: string[],
    location: string
  ): Promise<string[]> {
    try {
      return await this.searchWithGemini(ingredients, location);
    } catch (error) {
      // Fallback to Tavily if Gemini fails or quota exceeded
      return await this.searchWithTavily(ingredients, location);
    }
  }
  
  private async searchWithGemini(
    ingredients: string[],
    location: string
  ): Promise<string[]> {
    const queries = ingredients.map(ing => 
      `${ing} source origin ${location} vegetarian vegan`
    );
    
    // Gemini Grounding API call
    const results = await geminiGroundingAPI.search(queries);
    return results.map(r => r.content);
  }
  
  private async searchWithTavily(
    ingredients: string[],
    location: string
  ): Promise<string[]> {
    const tavily = new TavilyClient(process.env.TAVILY_API_KEY);
    
    const results = await Promise.all(
      ingredients.map(ing => 
        tavily.search(`${ing} source ${location}`, {
          search_depth: 'advanced',
          include_domains: [
            'fda.gov',
            'efsa.europa.eu',
            'fssai.gov.in'
          ],
          exclude_domains: [
            'reddit.com',
            'quora.com'
          ]
        })
      )
    );
    
    return results.map(r => r.results[0]?.content || '');
  }
}
```

---

## 6. DATABASE DESIGN

### Schema Overview

```sql
-- Users table (managed by BetterAuth, extended here if needed)
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- BetterAuth uses text IDs
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles (dietary preferences)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community TEXT NOT NULL CHECK (community IN ('Jain', 'Vaishnava', 'Swaminarayan', 'Vegan')),
  exceptions JSONB DEFAULT '[]'::jsonb, -- ["potatoes", "carrots"]
  allergies JSONB DEFAULT '[]'::jsonb,  -- ["peanuts", "gluten"]
  location TEXT, -- "India", "UK", "US"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Scans (scan history)
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Result
  verdict TEXT NOT NULL CHECK (verdict IN ('SAFE', 'UNSAFE', 'CAUTION', 'UNCERTAIN')),
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT NOT NULL,
  
  -- Ingredients
  ingredients JSONB NOT NULL, -- ["potato", "oil", "salt"]
  violations JSONB DEFAULT '[]'::jsonb, -- ["onion powder"]
  
  -- LLM metadata
  tier INTEGER NOT NULL CHECK (tier IN (1, 2)),
  model TEXT NOT NULL, -- "gemini-3-flash", "gpt-5.2"
  tier1_confidence DECIMAL(3,2), -- Store Tier 1 result if escalated
  
  -- Images
  image_url TEXT, -- Backblaze B2 URL
  image_deleted_at TIMESTAMP WITH TIME ZONE, -- When image was deleted
  
  -- Timing
  processing_time_ms INTEGER, -- How long analysis took
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_scans_user_id (user_id),
  INDEX idx_scans_verdict (verdict),
  INDEX idx_scans_created_at (created_at DESC)
);

-- Error reports (user feedback)
CREATE TABLE error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  error_type TEXT NOT NULL CHECK (error_type IN ('wrong_verdict', 'missed_ingredient', 'other')),
  user_comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Users can only read their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (
    -- BetterAuth user ID matching
    user_id = (current_setting('request.jwt.claim.sub', true))
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (
     user_id = (current_setting('request.jwt.claim.sub', true))
  );

-- Users can only access their own scans
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
```

### Image Retention Policy

**Automated Cleanup (Cron Job):**

```typescript
// jobs/cleanupImages.ts
import { createClient } from '@supabase/supabase-js';

export async function cleanupOldImages() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  
  // Find scans with images >90 days old
  const { data: oldScans } = await supabase
    .from('scans')
    .select('id, image_url')
    .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))
    .not('image_url', 'is', null);
  
  if (!oldScans || oldScans.length === 0) return;
  
  // Delete images from storage
  const imagePaths = oldScans.map(s => s.image_url.split('/').pop());
  await supabase.storage.from('scans').remove(imagePaths);
  
  // Update database
  await supabase
    .from('scans')
    .update({ image_url: null, image_deleted_at: new Date() })
    .in('id', oldScans.map(s => s.id));
  
  console.log(`Deleted ${oldScans.length} images`);
}

// Run daily at 2 AM
cron.schedule('0 2 * * *', cleanupOldImages);
```

---

## 7. INFRASTRUCTURE & DEPLOYMENT

### Hosting: Render.com

**Why Render:**

- ✅ Simple setup (connect GitHub → deploy)
- ✅ Auto-deploy on push
- ✅ Free SSL/TLS
- ✅ Built-in DDoS protection
- ✅ No surprise bills ($7/month predictable)

**Deployment Config:**

```yaml
# render.yaml
services:
  - type: web
    name: food-scanner-api
    env: node
    plan: starter # $7/month
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
    healthCheckPath: /health
    autoDeploy: true
```

### CI/CD Pipeline

**GitHub Actions:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run lint
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Environment Variables

```bash
# .env.example
NODE_ENV=production
PORT=10000

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_KEY=eyJxxx

# LLM APIs
GEMINI_API_KEY=AIzxxx
OPENAI_API_KEY=sk-xxx

# Search APIs
GEMINI_GROUNDING_API_KEY=AIzxxx
TAVILY_API_KEY=tvly-xxx

# External Services
Brevo_API_KEY=re_xxx
ONESIGNAL_APP_ID=xxx
ONESIGNAL_API_KEY=xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
POSTHOG_API_KEY=phc_xxx
```

---

## 8. SECURITY & PRIVACY

### Authentication Flow

```
1. User signs up with email + password
   │
   ├─> App calls /api/auth/sign-in
   ├─> Returns Session Object
   └─> Frontend extracts token and stores in SecureStorage
   
   
2. User makes API request
   │
   ├─> Adds "Authorization: Bearer {token}" header
   │
3. Backend authMiddleware verifies token
   │
   ├─> Calls betterAuth.api.getSession({ headers: req.headers })
   ├─> If valid: Attach session.user to req.user
   └─> If invalid: Return 401
   
4. RLS policies enforce data isolation
   │
   └─> User can only access their own scans
```

### Search Domain Filtering (Future: Tavily Migration)

**Trusted Domains (Include):**

```javascript
const TRUSTED_DOMAINS = [
  // Government food authorities
  'fssai.gov.in',      // India
  'fda.gov',           // USA
  'efsa.europa.eu',    // Europe
  'food.gov.uk',       // UK
  'foodstandards.gov.au', // Australia
  
  // International organizations
  'who.int',
  'codexalimentarius.org',
  'fao.org',
  
  // Vegan/Vegetarian resources
  'vegsoc.org',
  'vegansociety.com',
  'vrg.org',
  'jainworld.com',
  'iskcon.org',
  
  // Academic/Scientific
  'nih.gov',
  'pubmed.ncbi.nlm.nih.gov',
  'sciencedirect.com'
];
```

**Blocked Domains (Exclude):**

```javascript
const BLOCKED_DOMAINS = [
  // Social media
  'reddit.com',
  'quora.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'pinterest.com',
  
  // Forums
  'answers.yahoo.com',
  
  // Marketing/Ads
  'ads.google.com',
  'sponsored.com',
  
  // Low-quality content farms
  'wikihow.com',
  'ehow.com'
];
```

### BetterAuth Setup

**Why BetterAuth over Supabase Auth:**

- ✅ No vendor lock-in (works with any database)
- ✅ Modern features (passkeys, MFA, social auth)
- ✅ TypeScript-first
- ✅ Full control over auth logic

**Installation:**

```bash
npm install better-auth
```

**Configuration:**

```typescript
// server/auth.config.ts
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

export const auth = betterAuth({
  database: new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
```

**Mobile Integration (React Native):**

```typescript
// mobile/services/auth.ts
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'https://api.foodscanner.com',
});

// Sign up
await authClient.signUp.email({
  email: 'user@example.com',
  password: 'securePass123',
});

// Google OAuth
await authClient.signIn.social({
  provider: 'google',
  callbackURL: 'foodscanner://auth/callback',
});

// For every API request, add header:
// Authorization: Bearer <token>
```

**Database Setup:**
BetterAuth auto-creates these tables:

- `users`
- `sessions`
- `accounts` (for OAuth)
- `verificationTokens`

No manual migrations needed!

### Backblaze B2 Storage Setup

**Why Backblaze B2:**

- ✅ 10GB free storage
- ✅ S3-compatible API
- ✅ $5/TB storage (vs Supabase $21/TB)
- ✅ First 3x storage = free egress

**Installation:**

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Configuration:**

```typescript
// services/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  endpoint: 'https://s3.us-west-002.backblazeb2.com',
  region: 'us-west-002',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
  },
});

export class StorageService {
  async uploadImage(userId: string, scanId: string, imageBuffer: Buffer): Promise<string> {
    const key = `${userId}/${scanId}.jpg`;
    
    await s3Client.send(new PutObjectCommand({
      Bucket: 'food-scanner-scans',
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    }));
    
    // Return public URL
    return `https://f002.backblazeb2.com/file/food-scanner-scans/${key}`;
  }
  
  async getSignedUrl(imagePath: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: 'food-scanner-scans',
      Key: imagePath,
    });
    
    // URL valid for 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }
}
```

**CORS Setup (B2 Dashboard):**

```json
{
  "corsRules": [
    {
      "corsRuleName": "allow-mobile-app",
      "allowedOrigins": ["https://foodscanner.com", "foodscanner://"],
      "allowedOperations": ["s3_put", "s3_get"],
      "allowedHeaders": ["authorization", "content-type"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

**Image Cleanup (90-day retention):**

```typescript
// jobs/cleanupImages.ts
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

export async function cleanupOldImages() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  // List old objects
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
  
  console.log(`Deleted ${oldObjects.length} old images`);
}

// Run daily via cron
cron.schedule('0 2 * * *', cleanupOldImages);
```

### Brevo Email Service

**Why Brevo:**

- ✅ 300 emails/day free (9,000/month)
- ✅ vs Resend: 100 emails/day (3,000/month)
- ✅ SMS included (20/day free)
- ✅ Marketing features (newsletters, CRM)

**Trade-off Accepted:**

- ⚠️ Lower deliverability (95-97% vs Resend 99.9%)
- ⚠️ Worth the trade-off for MVP (save $20/month at 1K users)

**Installation:**

```bash
npm install @getbrevo/brevo
```

**Configuration:**

```typescript
// services/email.ts
import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export class EmailService {
  async sendVerificationEmail(email: string, token: string) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = 'Verify your Food Scanner account';
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.htmlContent = `
      <h1>Welcome to Food Scanner!</h1>
      <p>Click here to verify your account:</p>
      <a href="https://foodscanner.com/verify?token=${token}">Verify Email</a>
    `;
    sendSmtpEmail.sender = { 
      name: 'Food Scanner', 
      email: 'noreply@foodscanner.com' 
    };
    
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  }
  
  async sendPasswordReset(email: string, resetLink: string) {
    // Similar implementation
  }
}
```

**Email Templates:**

- Verification email
- Password reset
- Scan result ready (optional)
  
### Security Best Practices

**1. Input Validation:**

```typescript
// middleware/validation.ts
import { body, validationResult } from 'express-validator';

export const validateScanRequest = [
  body('images')
    .isArray({ min: 1, max: 3 })
    .withMessage('Must provide 1-3 images'),
  
  body('images.*')
    .isBase64()
    .withMessage('Images must be base64 encoded'),
  
  body('images.*')
    .custom((value) => {
      const size = Buffer.byteLength(value, 'base64');
      return size <= 5 * 1024 * 1024; // 5MB max
    })
    .withMessage('Image size must be ≤5MB'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

**2. Rate Limiting:**

```typescript
// Per-user scan limit
const scanRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 scans per minute
  keyGenerator: (req) => req.user.id,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Maximum 10 scans per minute'
    });
  }
});

app.post('/api/scan', scanRateLimit, scanController);
```

**3. Data Encryption:**

- ✅ **In Transit:** TLS 1.3 (Render automatic)
- ✅ **At Rest:** Supabase encrypts all data
- ✅ **Images:** Backblaze B2 encryption

**4. GDPR Compliance:**

```typescript
// Delete user data (GDPR Article 17)
async function deleteUserData(userId: string) {
  // 1. Delete images from storage
  const { data: scans } = await supabase
    .from('scans')
    .select('image_url')
    .eq('user_id', userId);
  
  const imagePaths = scans.map(s => s.image_url.split('/').pop());
  await supabase.storage.from('scans').remove(imagePaths);
  
  // 2. Delete scans
  await supabase.from('scans').delete().eq('user_id', userId);
  
  // 3. Delete profile
  await supabase.from('profiles').delete().eq('user_id', userId);
  
  // 4. Delete auth user
  await supabase.auth.admin.deleteUser(userId);
}
```

---

## 9. PERFORMANCE REQUIREMENTS

### Target Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **API Response Time** | <500ms (p95) | PostHog performance monitoring |
| **Scan Processing Time** | <3 sec (p95) | Server logs |
| **Image Upload Time** | <2 sec (p95) | Client-side tracking |
| **App Launch Time** | <2 sec | React Native Performance Monitor |
| **Crash Rate** | <0.1% | Sentry |

### Optimization Strategies

**1. Image Compression (Client-Side):**

- Reduces upload size 80%
- Target: 100KB per image

**2. API Response Caching (Post-MVP):**

- Redis cache for popular products
- 60% cache hit rate expected
- Reduces LLM calls 60%

**3. Database Indexing:**

```sql
-- Speed up history queries
CREATE INDEX idx_scans_user_created 
ON scans(user_id, created_at DESC);

-- Speed up filtering
CREATE INDEX idx_scans_verdict 
ON scans(verdict) WHERE verdict IS NOT NULL;
```

**4. Connection Pooling:**

```typescript
// database.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    db: {
      poolOptions: {
        max: 10,
        idleTimeoutMillis: 30000
      }
    }
  }
);
```

---

## 10. MONITORING & OBSERVABILITY

### Tools

**1. Sentry (Error Tracking):**

```typescript
// server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1 // Sample 10% of transactions
});

// Automatic error catching
app.use(Sentry.Handlers.errorHandler());
```

**2. PostHog (Analytics):**

```typescript
// client-side (React Native)
import posthog from 'posthog-react-native';

posthog.init(process.env.POSTHOG_API_KEY, {
  host: 'https://app.posthog.com'
});

// Track events
posthog.capture('scan_completed', {
  verdict, confidence, tier, processing_time
});
```

**3. Custom Logging:**

```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Scan completed', {
  userId, scanId, verdict, confidence, processingTime
});
```

### Alerts

**Slack Notifications:**

```typescript
// utils/alerts.ts
async function sendSlackAlert(message: string) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      text: `🚨 Food Scanner Alert: ${message}`
    })
  });
}

// Trigger on critical errors
if (errorCount > 10) {
  sendSlackAlert('High error rate detected: 10+ errors in last minute');
}
```

---

## 11. COST ANALYSIS

### Monthly Costs (Breakdown)

**At 100 Users:**

```
Render (backend): $7
Supabase (auth+DB+storage): $0 (free tier)
Gemini 3 Flash: $6
Tavily: $0 (free tier)
GPT-5.2: $3
Brevo: $0
OneSignal: $0
Sentry: $0
PostHog: $0

TOTAL: $16/month
Per-user: $0.16/month
```

**At 1,000 Users:**

```
Render: $25
Supabase: $0
Gemini 3 Flash: $6
Tavily: $11
GPT-5.2: $3
Brevo: $0
OneSignal: $0
Others: $0

TOTAL: $45/month
Per-user: $0.045/month
```

**At 10,000 Users:**

```
Render: $50
Supabase: $25
Gemini 3 Flash: $6
Tavily: $136
GPT-5.2: $3
Brevo: $20
OneSignal: $39
Others: $0

TOTAL: $279/month
Per-user: $0.028/month
```

### Cost Optimization Strategies

1. **Add Redis cache at 1K users** → Save $17/month
2. **Use Gemini Grounding (free 5K)** → Save $40/month initially
3. **Batch image uploads** → Reduce bandwidth costs
4. **Optimize LLM prompts** → Reduce token usage 20%

---

## 12. SCALABILITY PLAN

### Phase 1: MVP (0-1K Users)

**Current Setup Sufficient:**

- Render Starter ($7/month) handles 10K requests/day
- Supabase free tier handles 500MB DB
- No caching needed

### Phase 2: Growth (1K-10K Users)

**Upgrades Needed:**

1. **Add Redis Cache:**
   - Render Redis ($7/month)
   - Cache popular products
   - 60% hit rate = 60% cost reduction

2. **Upgrade Render:**
   - Starter → Standard ($25/month)
   - 2 instances for redundancy

3. **Database Optimization:**
   - Add indexes
   - Connection pooling
   - Query optimization

### Phase 3: Scale (10K-100K Users)

**Major Changes:**

1. **Supabase Pro:**
   - $25/month → $599/month
   - 8GB database
   - 250GB storage

2. **Render Pro:**
   - Multiple regions
   - Load balancing
   - Auto-scaling

3. **CDN for Images:**
   - CloudFlare R2
   - Reduce Supabase bandwidth costs

4. **LLM Cost Optimization:**
   - Aggressive caching
   - Batch processing
   - Consider fine-tuned models

---

## TESTING STRATEGY

### Unit Tests

```typescript
// tests/unit/llm.test.ts
describe('LLMService', () => {
  it('should return SAFE for product with no violations', async () => {
    const result = await llmService.analyzeTier1({
      images: [mockSafeProductImage],
      userProfile: mockJainProfile
    });
    
    expect(result.verdict).toBe('SAFE');
    expect(result.confidence).toBeGreaterThan(0.90);
  });
  
  it('should return UNSAFE for product with onion', async () => {
    const result = await llmService.analyzeTier1({
      images: [mockOnionProductImage],
      userProfile: mockJainProfile
    });
    
    expect(result.verdict).toBe('UNSAFE');
    expect(result.violations).toContain('onion');
  });
});
```

### Integration Tests

```typescript
// tests/integration/scan.test.ts
describe('POST /api/scan', () => {
  it('should scan product and return verdict', async () => {
    const response = await request(app)
      .post('/api/scan')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        images: [mockBase64Image]
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('verdict');
    expect(response.body).toHaveProperty('confidence');
  });
  
  it('should reject scan without auth', async () => {
    const response = await request(app)
      .post('/api/scan')
      .send({ images: [mockBase64Image] });
    
    expect(response.status).toBe(401);
  });
});
```

### Load Testing

```javascript
// tests/load/k6-scan.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s
  },
};

export default function () {
  const response = http.post(
    'https://api.foodscanner.com/scan',
    JSON.stringify({
      images: [mockBase64]
    }),
    {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'has verdict': (r) => r.json().verdict !== undefined
  });
  
  sleep(1);
}
```

---

## DEPLOYMENT CHECKLIST

### Pre-Launch

- [ ] All environment variables configured
- [ ] Supabase RLS policies enabled
- [ ] SSL certificates valid
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (PostHog) configured
- [ ] Rate limiting enabled
- [ ] Database backups enabled (Supabase automatic)
- [ ] Monitoring alerts configured
- [ ] Load testing passed (100 concurrent users)
- [ ] Security audit completed
- [ ] GDPR compliance verified

### Launch Day

- [ ] Deploy to Render production
- [ ] Verify health check endpoint
- [ ] Test authentication flow
- [ ] Test scan flow end-to-end
- [ ] Monitor error rate (Sentry)
- [ ] Monitor performance (PostHog)
- [ ] Monitor costs (Render + Supabase + LLM APIs)

### Post-Launch

- [ ] Daily error review (first week)
- [ ] Weekly cost review
- [ ] Monthly performance review
- [ ] User feedback collection

---

**END OF PRD 02: TECHNICAL ARCHITECTURE**

**Related Documents:**
← PRD 01: Product Overview
→ PRD 03: User Experience & Flows
→ PRD 04: API Specifications
→ PRD 05: Data Models & Policies
