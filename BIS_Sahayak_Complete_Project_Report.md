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
- **Real-Time Clause Citations**: Interactive drawer standard inspectors allowing clause-by-clause inspection with one click.
- **Web Speech API Audio Playback**: Read AI responses aloud in natural Hindi or Indian-accented English directly in the browser.
- **4-Step ISI Mark Authenticity Verifier**: Live 7/8-digit CM/L license format validation with step-by-step BIS Care App integration instructions.

---

## 🚀 Key Features

- **🏛️ Dual Personas (Consumer vs. Industry)**:
  - *Consumer*: "Is my pressure cooker safe? How do I spot a fake ISI mark?"
  - *Industry*: "What is the minimum yield stress and elongation under IS 1786 for Fe 500D TMT bars?"
- **🌐 100% Bilingual Support (English / हिन्दी)**:
  - Complete UI, sample queries, citation chips, speech synthesis, and AI grounding in both English and Hindi.
- **🔍 4-Step ISI Mark Authenticity Verifier (`/verify`)**:
  - Live 7/8-digit CM/L license pattern validator with BIS Care App integration guidelines.
- **📚 Standards Directory & Clause Inspector (`/standards`)**:
  - Searchable catalog of 21 authentic Indian Standards across Steel, Electrical, Safety, Food & Water, Electronics, Toys, Footwear, Cement, and Batteries with multi-tab detailed view.
- **⚡ Hybrid RAG Pipeline**:
  - Serverless PostgreSQL vector retrieval powered by **Neon `pgvector`** with fallback in-memory cosine similarity and domain-aware stop-word filtering.
- **🔊 Web Speech API Audio Assist**:
  - Listen to AI responses in natural Hindi or Indian-accented English directly in the browser.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **AI & Grounding**: Google Gemini 2.5 Flash (`@google/genai`), 768-dimensional normalized embeddings
- **Database & Vector Search**: Neon Serverless PostgreSQL with `pgvector` & in-memory vector index
- **Testing**: Vitest automated test suite (`tests/api-chat.test.ts`, `tests/ingestion.test.ts`)
- **Typography & Styling**: Plus Jakarta Sans, Outfit, warm saffron `#D97706` & navy `#0F172A` GovTech palette

---

## 📁 Repository Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Multi-turn RAG chat API endpoint
│   │   ├── standards/route.ts     # Standards catalog API
│   │   └── standards/[id]/route.ts# Individual standard details API
│   ├── globals.css                # Tailwind CSS tokens & GovTech variables
│   ├── layout.tsx                 # Root layout with fonts & Navbar/Footer
│   ├── page.tsx                   # Main AI Assistant conversation portal
│   ├── standards/page.tsx         # Searchable Standards directory with filters
│   ├── standards/[id]/page.tsx    # Multi-tab standard inspection page
│   └── verify/page.tsx            # ISI Mark & CM/L license verifier
├── components/
│   ├── Chat/
│   │   ├── ChatInterface.tsx      # Interactive chat with audio & citations
│   │   ├── ChatMessageContent.tsx # Formatted chat message with expandable details
│   │   └── CitationChip.tsx       # Clickable standard pill trigger
│   ├── Standards/
│   │   ├── StandardCard.tsx       # Standard summary card
│   │   ├── StandardDrawer.tsx     # Slide-out clause inspector
│   │   └── StandardFilter.tsx     # Filter toolbar
│   ├── Verifier/
│   │   └── MarkVerifier.tsx       # 4-step ISI mark validation tool
│   ├── HeroSection.tsx            # GovTech hero banner with sample pills
│   ├── Navbar.tsx                 # Mode switcher & language toggle
│   └── Footer.tsx                 # Official BIS links & SIH attribution
├── data/
│   ├── standards/                 # 21 authentic Indian Standards JSON docs
│   └── standards-vectors.json     # Precomputed 768-dim embeddings & corpus
├── lib/
│   ├── gemini.ts                  # Gemini 2.5 Flash RAG prompt engineering
│   ├── prisma.ts                  # Neon PostgreSQL connection pooling
│   ├── standards-data.ts          # Strongly-typed standards schema
│   ├── translations.ts            # Complete English & Hindi dictionary
│   └── vector-store.ts            # Hybrid cosine + lexical search engine
├── tests/
│   ├── api-chat.test.ts           # RAG retrieval & citation unit tests
│   └── ingestion.test.ts          # Vector index integrity tests
└── scripts/
    ├── build_clean_vectors.py     # Clean vector generation pipeline
    ├── ingest_to_neon.py          # Vector ingestion to Neon pgvector
    └── seed-standards.ts          # Ingestion script for standards corpus
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
| **SIH26107** | Dual Persona AI Assistant + ISI Verifier + Standards Directory | Multi-turn RAG chat (`/api/chat`) grounded on 21 authentic IS standards, interactive clause citations with drawer inspection, Web Speech audio synthesis, 7/8-digit CM/L license validation (`/verify`), and searchable standards registry (`/standards`). |

---

## 📜 License & Acknowledgements
Developed for **Smart India Hackathon 2026 (SIH26107)**. Data sourced and structured in compliance with publicly available **Bureau of Indian Standards (BIS)** notifications, Quality Control Orders, and Ministry of Consumer Affairs circulars.
