# BIS Sahayak: current project report

**Smart India Hackathon 2026, SIH26107**  
**Team:** Logic Lords, Arvind Gavali College of Engineering, Satara  
**Updated:** 26 September 2026  
**Prototype:** https://sih2026-bis-assistant.vercel.app

## Problem and proposed answer

Consumers and MSMEs often struggle to identify a relevant Indian Standard, understand technical material, and find the next BIS service. BIS Sahayak is an independent conversational prototype. It explains curated standard summaries in English or Hindi, in consumer or industry mode, then links users to an inspectable summary and official BIS source. It is not an authorised BIS service.

## Working prototype

- Chat retrieves from 21 local **demonstration** standard summaries, then sends selected context to Gemini 3.5 Flash-Lite. If the model is unavailable, the API returns a deterministic fallback and marks it with a fallback flag.
- The standards directory and citation drawer expose summary metadata and official-source links. They are not licensed full-text standards.
- The CM/L checker validates 7- or 8-digit format and searches fictional demonstration licence records. Unknown plausible numbers remain **unverified**. Users must confirm current status in BIS Care or e-BIS.
- Separate pages explain conformity schemes, hallmarking and HUID, BIS laboratories, and a six-step MSME licensing route. Lab details and fee concessions link to BIS sources.
- The interface offers English/Hindi modes, consumer/industry modes, sample questions, responsive layout, and browser speech playback.

## Architecture

Next.js 15, React 19, TypeScript and Tailwind CSS run the app. A local JSON index supports chat retrieval. `lib/vector-store.ts` uses weighted lexical matching and cosine similarity over 768-dimensional **hashed** word vectors. `lib/gemini.ts` selects up to five relevant chunks and prepares persona/language instructions for Gemini. The current production chat path does **not** query pgvector. Neon connection code exists for optional database operations; it should not be presented as a proven production vector-search backend.

The public app is deployed on Vercel. The chatbot has a 1,000-character query limit, capped conversation history and an in-memory per-instance rate limiter. The limiter does not provide global, multi-instance protection.

## Data and safety boundaries

The 21 standards records are educational summaries. Metadata and official links do not establish that every clause or number is current. The licence dataset is fictional demonstration data. A local match must never be described as a legal BIS certification decision. The product does not claim zero hallucinations, universal QCO coverage, guaranteed uptime, or measurable consumer impact.

Current official references include [Know Your Standard](https://www.bis.gov.in/know-your-standard/?lang=en), [BIS Care](https://www.bis.gov.in/bis-apps/?lang=en), [BIS laboratory information](https://lims.bis.gov.in/home/bis_labs/), [hallmarking FAQs](https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en), and the [Scheme-I concession notice](https://www.bis.gov.in/wp-content/uploads/2026/03/Scheme-1-Concession-Extension-31May2029.pdf). Check these sources again before a public or regulatory decision.

## Verification as of 26 September 2026

- Four Vitest suites: **32/32 tests passed**.
- ESLint and Next.js production build passed.
- Production dependency audit reported zero vulnerabilities.
- Public pages and API smoke checks passed. A live chat request returned a Gemini response without fallback.

These checks establish software behavior for the tested cases, not clause correctness or real-world user outcomes.

## Pilot before official use

1. Obtain lawful access to current BIS content, version every record, and have subject-matter reviewers sign off on high-risk numerical guidance.
2. Test consumer and MSME tasks against manual BIS portal search. The pitch proposes 20 consumers and 10 MSME users, plus 100 reviewed queries. The targets are **not achieved results**.
3. Add consent, retention limits and redaction if chat queries are logged. Measure model cost, answer latency, fallback frequency, citation precision, and unsupported numerical claims.
4. Consider broader indexing or a vector database only after the evaluated corpus requires it.

## Submission status

The six-slide idea deck follows the supplied SIH template. The registered team ID is missing. Confirm the exact problem title/theme in the SIH portal before exporting or uploading the final submission. The team has not submitted this prototype or deck to BIS.
