# BIS Sahayak — SIH26107 Audit & Engineering Progress Report

**Review Date:** 2026-09-26
**Problem Statement:** SIH26107 — *Intelligent Assistant for Indian Standards & BIS Services*  
**Repository:** `D:\SIH2026-BIS-Assistant`  
**Hackathon:** Smart India Hackathon 2026 (Internal / College Level Evaluation)

---

## 1. Executive Summary of Audit & Rectifications

An engineering audit addressed unsafe verification claims, API security, and missing SIH26107 features. Standard summaries and licence records remain demonstration data; official BIS portals provide authoritative information.

---

## 2. Priority 0: Truthful & Safe Verification Architecture

### Root Cause
Previously, any arbitrary 7 or 8-digit number queried against the local database was treated as `regional_verified` or authentic if it matched length requirements, giving users a false sense that unverified products possessed official Bureau of Indian Standards (BIS) conformity licenses. Furthermore, the codebase claimed "live synchronisation with e-BIS Manakonline", which was not technically truthful.

### Engineering Fixes
1. **Honest Status Lifecycle**:
   - `operative`: A status shown only for fictional records in the local demonstration dataset; it is not official BIS confirmation.
   - `format_valid_unverified`: Returned for 7 or 8-digit CM/L numbers not present in the local cache. Plausible length does not prove an active BIS licence or identify a regional office.
   - `expired`, `suspended`, `cancelled`: Retained and explicitly surfaced with distinct UI badges and regulatory alerts.
   - `suspicious_pattern`: Flagged for test patterns (e.g., `11111111`, `12345678`, `0000000`) without making unfounded criminal or legal accusations.
   - `invalid`: Returned for inputs failing CM/L syntax.
2. **Authoritative Verification Handoff**:
   - Every verification response provides a prominent, direct handoff to the official **BIS Care Mobile App** (`com.bis.bisapp`) and the official **e-BIS Manakonline portal** (`services.bis.gov.in`).
   - Fixed outdated and invalid package IDs across the UI to the correct Google Play package: `com.bis.bisapp`.
3. **Transparent Data Boundaries**:
   - Renamed `scripts/sync-bis-database.ts` to `scripts/deploy-demo-licenses.ts` and updated npm script to `deploy:demo-licenses`.
   - Every verification result explicitly tags `isDemoData: true` and states that the local directory is a mock demonstration dataset of ~1,000 licenses.

---

## 3. Priority 0: Source Provenance & Grounded Citations

### Engineering Fixes
1. **Structured Source Metadata**:
   - Enriched all 21 Indian Standards in `data/standards/*.json` and `data/standards/standards-index.json` with comprehensive `sourceMetadata`:
     - `officialUrl` / `officialSourceUrl`: Canonical link to `services.bis.gov.in`.
     - `documentTitle`: Full gazetted standard title.
     - `editionYear`: Year of revision/edition.
     - `clausePageReference`: Specific clause and section numbers.
     - `retrievalDate`: Snapshot date (`2026-09-22`).
     - `classification`: Explicitly labeled `demonstration_summary`.
2. **Provenance in UI**:
   - Citation chips display edition years, provenance badges, and clause numbers.
   - Standard detail pages (`/standards/[id]`) and slide-out drawers display official BIS portal links and disclaimers clarifying that summaries are educational hackathon models.
3. **AI Grounding Prompting (`lib/gemini.ts`)**:
   - Migrated to the modern official `@google/genai` SDK; default model updated to Gemini 3.5 Flash-Lite after the configured key received 404 on Gemini 2.5 Flash.
   - Grounding prompt configured with low temperature (`0.2`), forbidding guessing of tolerance values, and instructing the AI to explicitly state when information is unavailable in the retrieved corpus.
   - Replaced all unsubstantiated "zero hallucination" claims with honest "source-grounded retrieval" terminology.
   - Added `fallback: true/false` indicator in responses to honestly communicate whether the answer was generated via live Gemini RAG or offline conversational NLP.

---

## 4. Priority 1: SIH26107 Functional UI Modules

To fully satisfy the problem statement requirements beyond simple Q&A, four dedicated, source-backed modules were built:

1. **Certification Schemes (`/schemes`)**:
   - Covers Scheme-I (ISI Mark for domestic manufacturers), CRS (Compulsory Registration Scheme for electronics/IT), FMCS (Foreign Manufacturers Certification Scheme), and Scheme-X (Capital goods & machinery).
   - Interactive comparison table with processing times, audit requirements, and surveillance frequencies.
2. **Hallmarking & HUID Guide (`/hallmarking`)**:
   - Comprehensive breakdown of the 3 mandatory marks on gold jewelry: BIS Logo, Purity in Karat & Fineness (22K916, 18K750, 14K585), and 6-character alphanumeric HUID (Hallmark Unique Identification).
   - Interactive 6-character HUID format tester and consumer rights guide (BIS lists ₹200 for consumer fire-assay testing; ₹45 is a separate hallmarking charge).
3. **BIS Laboratory Discovery (`/labs`)**:
   - Directory of official BIS Testing Laboratories: Central Laboratory (CL Sahibabad), Regional Laboratories (WRL Mumbai, ERL Kolkata, SRL Chennai, NRL Mohali), and Branch Laboratories (BL Bengaluru).
   - Search by discipline (Chemical, Mechanical, Electrical, Microbiological) and direct link to the LIMS portal.
4. **MSME Licensing & Concessions Workflow (`/licensing`)**:
   - 6-step visual licensing roadmap: Standard Identification -> Eligible Testing Arrangement -> Manakonline Submission -> Factory Inspection -> Sample Testing -> Grant of License.
   - Document checklist and Scheme-I annual minimum marking fee concessions from the March 2026 BIS notice (80% micro/startup, 50% small, additional 10% for eligible women-led enterprises through May 2029).

---

## 5. Priority 1: Security & API Hardening

1. **Elimination of `dangerouslySetInnerHTML`**:
   - Replaced raw HTML rendering in `components/Chat/ChatMessageContent.tsx` with `parseInlineMarkdown`, parsing bold text, links, and formatting into safe React element trees. Codebase has 0 occurrences of `dangerouslySetInnerHTML`.
2. **Input Validation & Sanitization (`app/api/chat/route.ts`)**:
   - Query string length capped at 1,000 characters.
   - Conversation history capped at 20 messages, with each message content capped at 2,000 characters.
   - Allowed roles strictly validated to `user` and `assistant`.
   - Mode validated against `'consumer' | 'industry'`, and language against `'en' | 'hi'`.
   - Standard 500 error responses sanitized to prevent leaking stack traces or environment secrets.
3. **In-Memory Rate Limiting**:
   - Sliding-window IP rate limiter restricting requests to 30 requests per minute per IP address with `429 Too Many Requests` responses.

---

## 6. Test Suite & Verification Results

### Automated Test Suite (Vitest)
All 4 test suites pass offline and deterministically without requiring paid API keys:

- `tests/verifier.test.ts` (13 tests):
   - Validates format checks and operative demo records without guessing jurisdiction.
  - Verifies unknown valid CM/L returns `format_valid_unverified` with official BIS Care handoff.
  - Verifies sequential/repeated numbers return `suspicious_pattern` without defamation.
  - Verifies EXPIRED, SUSPENDED, and CANCELLED statuses.
  - Verifies `getStandardById(undefined)` and invalid IDs return `undefined` (404-safe).
- `tests/security-api.test.ts` (9 tests):
  - Enforces 400 Bad Request on empty queries and query > 1000 chars.
  - Rejects oversized history (> 20 messages or message > 2000 chars).
  - Enforces sliding-window rate limit (429).
  - Confirms zero occurrences of `dangerouslySetInnerHTML` across `components/` and `app/`.
  - Verifies structured `sourceMetadata` on all 21 standards.
  - Verifies honest fallback flag in API responses.
- `tests/api-chat.test.ts` (6 tests):
  - Verifies consumer pressure cooker citations (`IS 2347`).
  - Verifies bilingual Hindi response handling (`IS 14543`).
  - Verifies casual greeting and slang handling without hallucinated standards.
- `tests/ingestion.test.ts` (4 tests):
  - Verifies loading of all 21 seeded standards.
  - Verifies 768-dimensional normalized embedding vectors.
  - Verifies document chunking and vector retrieval.

**Overall Test Results:**
- **Test Files:** 4 passed (4 total)
- **Tests:** 32 passed (32 total)
- **Run date:** 26 September 2026

### ESLint & TypeScript Status
- `npm run lint`: **0 errors, 0 warnings** (Clean)

---

## 7. Current Pitch & Report Artifacts

- `output/Logic_Lords_BIS_Sahayak_SIH2026_Current.pptx`: editable six-slide SIH-template deck with speaker notes.
- `output/pdf/Logic_Lords_BIS_Sahayak_SIH2026_Current.pdf`: matching slide-only PDF for portal submission after team details are confirmed.
- `BIS_Sahayak_Complete_Project_Report.md` and `output/pdf/BIS_Sahayak_Current_Project_Report.pdf`: current implementation, limitations and pilot proposal.
- `SIH2026_Evaluation_Rubric_Answers.md` and `output/pdf/SIH2026_Current_Evaluation_QA.pdf`: current jury Q&A.
- `Simple_BIS_Sahayak_Report.md` and `output/SIH_Winner_Research_Notes.md`: updated plain-language summary and researched pitch rationale.

Legacy PPTX/PDF files remain untouched as historical copies; their old claims are not submission-ready. The private `.ppt-build/` directory holds validation and render files and is git-ignored. The new deck passed PPTX package/layout checks and every slide was visually inspected.

Before submission, add the registered team ID, confirm the exact problem title and theme in the SIH team portal, and retest the live demo.
