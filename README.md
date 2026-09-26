# BIS Sahayak (बीआईएस सहायक) 🇮🇳
### AI-Powered Intelligent Assistant for Indian Standards & BIS Services
**Smart India Hackathon 2026 • Problem Statement SIH26107**

---

## 📌 Problem Overview & Objectives (SIH26107)

In India, navigating the thousands of Indian Standards published by the **Bureau of Indian Standards (BIS)** is complex for both everyday consumers and MSME industrial manufacturers.

**SIH26107 (Consumer & Industry Assistance)**:
- Provide instant, bilingual (English & Hindi) guidance on product conformity, safety regulations, and mandatory **Quality Control Orders (QCOs)**.
- **Dual-Persona Experience**:
  - **Consumer Mode**: Plain language explanations, counterfeit prevention, ISI mark verification, and consumer protection rights.
  - **Industry Mode**: Technical specifications, testing parameters, numerical tolerance limits, conformity schemes, and HS codes.
- **Inspectable demonstration citations**: Interactive drawers show curated standard summaries and links to official BIS sources.
- **Web Speech API Audio Playback**: Read AI responses aloud in natural Hindi or Indian-accented English directly in the browser.
- **CM/L format checker**: 7/8-digit format checks, fictional demo records, and a handoff to BIS Care for official verification.

---

## 🚀 Key Features

- **🏛️ Dual Personas (Consumer vs. Industry)**:
  - *Consumer*: "Is my pressure cooker safe? How do I spot a fake ISI mark?"
  - *Industry*: "What is the minimum yield stress and elongation under IS 1786 for Fe 500D TMT bars?"
- **🌐 English and Hindi support**:
  - Complete UI, sample queries, citation chips, speech synthesis, and AI grounding in both English and Hindi.
- **🔍 Truthful Scheme-I ISI Mark Verifier (`/verify`)**:
  - Checks 7/8-digit CM/L number length, flags obvious test patterns, distinguishes demonstration records from unknown numbers, and links to the official BIS Care App (`com.bis.bisapp`) for verification.
- **📋 BIS Certification Schemes Guide (`/schemes`)**:
  - Detailed side-by-side comparison of Scheme-I (ISI Mark), CRS (Compulsory Registration Scheme), FMCS (Foreign Manufacturers), and Scheme-X.
- **💎 Hallmarking & HUID Guide (`/hallmarking`)**:
  - Guide to 3 mandatory gold hallmark signs, interactive 6-character HUID format tester, fineness levels (22K916, 18K750, 14K585), and consumer testing rights.
- **🔬 Official BIS Laboratory Discovery (`/labs`)**:
  - Searchable directory of Central (CL Sahibabad), Regional (WRL, ERL, SRL, NRL), and Branch testing laboratories with LIMS integration links.
- **🏭 MSME Licensing Roadmap (`/licensing`)**:
  - 6-step interactive licensing journey, document checklist, and Scheme-I annual minimum marking fee concessions linked to the current BIS notice.
- **📚 Standards Directory & Clause Inspector (`/standards`)**:
  - Searchable catalog of 21 Indian Standards with clause-by-clause inspection drawers, source provenance metadata, and direct e-BIS portal links.
- **⚡ Retrieval-backed assistant**:
  - Local demonstration-summary retrieval, source metadata, Gemini generation, and deterministic conversational fallback.
- **🔊 Web Speech API Audio Assist**:
  - Listen to AI responses in natural Hindi or Indian-accented English directly in the browser.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **AI & Retrieval**: Google Gemini 3.5 Flash-Lite (`@google/genai`), local weighted lexical and hashed-vector search
- **Database**: Neon Serverless PostgreSQL for optional database operations; production chat retrieval uses a local JSON index, not `pgvector`
- **Testing**: Vitest automated test suite (`tests/verifier.test.ts`, `tests/security-api.test.ts`, `tests/api-chat.test.ts`, `tests/ingestion.test.ts`)
- **Typography & Styling**: Plus Jakarta Sans, Outfit, warm saffron `#D97706` & navy `#0F172A` GovTech palette

---

## 📁 Repository Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Multi-turn RAG chat with sliding rate-limiting
│   │   ├── standards/route.ts     # Standards catalog API
│   │   ├── standards/[id]/route.ts# Individual standard details API
│   │   └── verify/route.ts        # Truthful CM/L license format verification API
│   ├── hallmarking/page.tsx       # 3 Mandatory marks & 6-char HUID tester
│   ├── labs/page.tsx              # BIS Central & Regional lab directory
│   ├── licensing/page.tsx         # 6-step MSME licensing & concession guide
│   ├── schemes/page.tsx           # Scheme-I, CRS, FMCS, Scheme-X comparisons
│   ├── standards/page.tsx         # Searchable Standards directory with filters
│   ├── standards/[id]/page.tsx    # Multi-tab standard inspection page with provenance
│   ├── verify/page.tsx            # Truthful ISI Mark & CM/L license verifier
│   └── page.tsx                   # Main AI Assistant conversation portal
├── components/
│   ├── Chat/                      # Grounded chat, citation chips, audio assist
│   ├── Hallmarking/               # Gold hallmarking rules & HUID validator
│   ├── Labs/                      # BIS laboratory search & LIMS links
│   ├── Licensing/                 # MSME licensing workflow & fee concessions
│   ├── Schemes/                   # Certification scheme matrices
│   ├── Standards/                 # Catalog cards, filters, and clause drawer
│   └── Verifier/                  # Truthful MarkVerifier with BIS Care handoff
├── data/
│   ├── licenses/                  # Demonstration license dataset (~1,000 records)
│   ├── standards/                 # 21 Indian Standards with sourceMetadata
│   └── standards-vectors.json     # Precomputed 768-dim embeddings & corpus
├── lib/
│   ├── gemini.ts                  # Gemini 3.5 Flash-Lite RAG & conversational fallback
│   ├── license-database.ts        # Verification engine with realistic statuses
│   ├── standards-data.ts          # Standards schema & provenance types
│   ├── translations.ts            # Complete English & Hindi dictionary
│   └── vector-store.ts            # Hybrid cosine + lexical search engine
├── tests/
│   ├── verifier.test.ts           # CM/L format, demo statuses, BIS Care handoff
│   ├── security-api.test.ts       # Rate-limiting, XSS prevention, input caps
│   ├── api-chat.test.ts           # RAG retrieval & citation unit tests
│   └── ingestion.test.ts          # Vector index integrity tests
└── scripts/
    └── deploy-demo-licenses.ts    # Local demonstration license deployment
```

---

## 🏃 Getting Started

### 1. Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/SIH2026-BIS-Assistant.git
cd SIH2026-BIS-Assistant

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:password@your-neon-endpoint.aws.neon.tech/neondb?sslmode=require
```

### 4. Run Automated Tests
```bash
npm run test
```
All automated test suites will execute and verify the ingestion corpus, RAG retrieval quality, and dual persona responses.

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🏆 Smart India Hackathon 2026 Alignment

| Problem Statement | Solution Component | Technical Implementation |
| :--- | :--- | :--- |
| **SIH26107** | Dual Persona AI Assistant + ISI Number Checker + Standards Directory | Multi-turn chat (`/api/chat`) using 21 demonstration standard summaries, interactive clause views, Web Speech audio, 7/8-digit CM/L number checks (`/verify`), and a searchable demonstration standards catalog (`/standards`). Official BIS sources remain the authority for standards and licences. |

---

## 📜 License & Acknowledgements
Developed for **Smart India Hackathon 2026 (SIH26107)**. Standard summaries and licence records are demonstration data; use the linked **Bureau of Indian Standards (BIS)** portals for current authoritative information.

## Current SIH pitch and reports

- [Editable six-slide idea deck](output/Logic_Lords_BIS_Sahayak_SIH2026_Current.pptx)
- [Slide-only submission PDF](output/pdf/Logic_Lords_BIS_Sahayak_SIH2026_Current.pdf)
- [Current project report](output/pdf/BIS_Sahayak_Current_Project_Report.pdf)
- [Current evaluation Q&A](output/pdf/SIH2026_Current_Evaluation_QA.pdf)
- [Past-winner research notes](output/SIH_Winner_Research_Notes.md)

Older presentation and report PDFs in the repository are archival and may contain outdated prototype claims. Use the files marked **Current** above. Add the registered team ID and confirm the problem title/theme in the SIH portal before submission.
