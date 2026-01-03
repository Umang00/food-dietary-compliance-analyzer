# PRD 04: API SPECIFICATIONS

## Food Dietary Compliance Analyzer

**Document Version:** 1.0  
**Date:** January 2, 2026  
**Part of:** PRD Suite (Document 4 of 5)

---

## BASE URL

**Production:** `https://api.foodscanner.com`  
**Staging:** `https://staging-api.foodscanner.com`

---

## AUTHENTICATION (BetterAuth)

**Base URL:** `https://api.foodscanner.com`
**Headers:** `Authorization: Bearer <token>`

#### POST /api/auth/sign-up/email

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePass123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "cuid_string",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false
  },
  "session": {
    "token": "eyJhbGci...",
    "expiresAt": "2026-01-10T10:00:00Z"
  }
}
```

#### POST /api/auth/sign-in/email

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePass123"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "cuid_string",
    "email": "user@example.com"
  },
  "session": {
    "token": "eyJhbGci...",
    "expiresAt": "2026-01-10T10:00:00Z"
  }
}
```

#### POST /api/auth/sign-in/social

**Request:**

```json
{
  "idToken": "google_id_token",
  "callbackURL": "foodscanner://auth/callback"
}
```

**Response (200):**

```json
{
  "user": {
    "id": "cuid_string",
    "email": "user@gmail.com",
    "name": "John Doe",
    "image": "https://..."
  },
  "session": {
    "token": "eyJhbGci...",
    "expiresAt": "2026-01-10T10:00:00Z"
  },
  "isNewUser": false
}
```

---

### 2. PROFILE

#### GET /profile

Get current user's profile.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "userId": "cuid_string",
  "community": "Jain",
  "exceptions": ["potatoes", "carrots"],
  "allergies": ["peanuts"],
  "location": "India",
  "createdAt": "2026-01-02T10:00:00Z",
  "updatedAt": "2026-01-02T10:00:00Z"
}
```

---

#### PUT /profile

Update user profile.

**Request:**

```json
{
  "community": "Jain",
  "exceptions": ["potatoes", "carrots", "beets"],
  "allergies": ["peanuts", "gluten"],
  "location": "UK"
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "community": "Jain",
  "exceptions": ["potatoes", "carrots", "beets"],
  "allergies": ["peanuts", "gluten"],
  "location": "UK",
  "updatedAt": "2026-01-02T11:00:00Z"
}
```

**Errors:**

- 400: Invalid community value
- 400: Exceptions/allergies must be arrays

---

### 3. SCAN

#### POST /scan

Analyze food product images.

**Request:**

```json
{
  "images": [
    "base64_encoded_image_1",
    "base64_encoded_image_2"
  ]
}
```

**Constraints:**

- 1-3 images required
- Each image ≤5MB
- Base64 encoded JPEG/PNG

**Response (200 OK):**

```json
{
  "scanId": "uuid",
  "verdict": "SAFE",
  "confidence": 0.94,
  "reasoning": "This product contains only plant-based ingredients that align with your Jain dietary preferences. No animal products, root vegetables (except potatoes which you allow), or prohibited additives detected.",
  "ingredients": [
    "potatoes",
    "vegetable oil",
    "salt",
    "spices (verified no onion/garlic)"
  ],
  "violations": [],
  "ambiguousItems": [],
  "tier": 1,
  "model": "gemini-3-flash",
  "processingTimeMs": 1850,
  "createdAt": "2026-01-02T12:00:00Z"
}
```

**Response for UNSAFE (200 OK):**

```json
{
  "scanId": "uuid",
  "verdict": "UNSAFE",
  "confidence": 0.91,
  "reasoning": "This product contains onion powder and garlic powder, which are not allowed in Jain diet.",
  "ingredients": [
    "wheat flour",
    "palm oil",
    "salt",
    "onion powder",
    "garlic powder",
    "spices"
  ],
  "violations": [
    "onion powder",
    "garlic powder"
  ],
  "ambiguousItems": [],
  "tier": 2,
  "model": "gpt-5.2",
  "tier1Result": {
    "verdict": "CAUTION",
    "confidence": 0.75,
    "model": "gemini-3-flash"
  },
  "processingTimeMs": 3200,
  "createdAt": "2026-01-02T12:00:00Z"
}
```

**Response for UNCERTAIN (200 OK):**

```json
{
  "scanId": "uuid",
  "verdict": "UNCERTAIN",
  "confidence": 0.62,
  "reasoning": "Cannot confidently determine safety. Contains ambiguous ingredients whose sources are unclear.",
  "ingredients": [
    "flour",
    "sugar",
    "natural flavoring",
    "E471"
  ],
  "violations": [],
  "ambiguousItems": [
    {
      "ingredient": "natural flavoring",
      "reason": "Source unclear, could be plant or animal-based"
    },
    {
      "ingredient": "E471",
      "reason": "Mono- and diglycerides can be plant or animal-derived"
    }
  ],
  "recommendation": "Contact manufacturer or avoid this product to be safe",
  "tier": 2,
  "processingTimeMs": 3500,
  "createdAt": "2026-01-02T12:00:00Z"
}
```

**Errors:**

- 400: Invalid image format
- 400: Image too large (>5MB)
- 400: Must provide 1-3 images
- 401: Authentication required
- 429: Rate limit exceeded (10 scans/minute)
- 500: LLM API error

---

### 4. HISTORY

#### GET /scans

Get user's scan history.

**Query Parameters:**

- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `verdict` (optional): Filter by verdict (SAFE|UNSAFE|CAUTION|UNCERTAIN)
- `startDate` (optional): ISO 8601 date
- `endDate` (optional): ISO 8601 date

**Example:**

```
GET /scans?limit=10&verdict=UNSAFE&startDate=2026-01-01
```

**Response (200 OK):**

```json
{
  "scans": [
    {
      "id": "uuid",
      "verdict": "SAFE",
      "confidence": 0.94,
      "ingredients": ["potatoes", "oil", "salt"],
      "violations": [],
      "tier": 1,
      "imageUrl": "https://f002.backblazeb2.com/file/food-scanner-scans/user_id/scan_id.jpg",
      "createdAt": "2026-01-02T12:00:00Z"
    },
    {
      "id": "uuid",
      "verdict": "UNSAFE",
      "confidence": 0.91,
      "ingredients": ["wheat", "onion powder"],
      "violations": ["onion powder"],
      "tier": 2,
      "imageUrl": "https://f002.backblazeb2.com/file/food-scanner-scans/user_id/scan_id.jpg",
      "createdAt": "2026-01-02T11:00:00Z"
    }
  ],
  "pagination": {
    "total": 47,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

#### GET /scans/:scanId

Get detailed scan result.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "verdict": "SAFE",
  "confidence": 0.94,
  "reasoning": "...",
  "ingredients": ["potatoes", "oil", "salt"],
  "violations": [],
  "tier": 1,
  "model": "gemini-3-flash",
  "imageUrl": "https://f002.backblazeb2.com/file/food-scanner-scans/user_id/scan_id.jpg",
  "processingTimeMs": 1850,
  "createdAt": "2026-01-02T12:00:00Z"
}
```

**Errors:**

- 404: Scan not found
- 403: Not authorized (not your scan)

---

#### DELETE /scans/:scanId

Delete a scan from history.

**Response (204 No Content)**

**Errors:**

- 404: Scan not found
- 403: Not authorized

---

### 5. ERROR REPORTING

#### POST /scans/:scanId/report

Report an error in scan result.

**Request:**

```json
{
  "errorType": "wrong_verdict",
  "comment": "This product actually contains onion but was marked safe"
}
```

**Error Types:**

- `wrong_verdict`: Verdict was incorrect
- `missed_ingredient`: Ingredient not detected
- `other`: Other issue

**Response (201 Created):**

```json
{
  "reportId": "uuid",
  "status": "pending",
  "createdAt": "2026-01-02T12:30:00Z"
}
```

---

### 6. ACCOUNT MANAGEMENT

#### DELETE /account

Delete user account and all data.

**Request:**

```json
{
  "confirmation": "DELETE"
}
```

**Response (204 No Content)**

**Errors:**

- 400: Invalid confirmation text

---

#### GET /account/export

Request data export (GDPR).

**Response (202 Accepted):**

```json
{
  "exportId": "uuid",
  "status": "processing",
  "estimatedCompletionTime": "2026-01-03T12:00:00Z",
  "message": "We'll email you when your data is ready"
}
```

Export includes:

- User profile (JSON)
- Scan history (CSV)
- Images not included (download separately via URLs)

---

## RATE LIMITS

| Endpoint | Rate Limit | Window |
|----------|-----------|--------|
| `/api/auth/*` | 5 requests | 1 minute |
| `/scan` | 10 requests | 1 minute |
| `/scans` (GET) | 30 requests | 1 minute |
| `/profile` | 20 requests | 1 minute |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1704196800
```

**Rate Limit Response (429):**

```json
{
  "error": "Rate limit exceeded",
  "message": "Maximum 10 scans per minute. Please wait.",
  "retryAfter": 45
}
```

---

## ERROR RESPONSES

### Standard Error Format

```json
{
  "error": "Error type",
  "message": "Human-readable message",
  "code": "ERROR_CODE",
  "details": {
    "field": "email",
    "reason": "Invalid format"
  }
}
```

### Common Error Codes

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing/invalid auth token |
| 403 | `FORBIDDEN` | Not allowed to access resource |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | Resource already exists |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `SERVICE_UNAVAILABLE` | Temporary outage |

---

## WEBHOOKS (Future Feature)

Reserved for Phase 2:

```
POST /webhooks/subscribe
POST /webhooks/unsubscribe
```

Events:

- `scan.completed`
- `scan.failed`
- `profile.updated`

---

**END OF PRD 04: API SPECIFICATIONS**

**Related Documents:**
← PRD 03: User Experience & Flows
→ PRD 05: Data Models & Policies
