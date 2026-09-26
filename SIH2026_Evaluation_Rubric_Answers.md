# BIS Sahayak: SIH26107 evaluation brief

**Team:** Logic Lords, Arvind Gavali College of Engineering, Satara  
**Category:** Software | **Theme:** Smart Automation (confirm on the registered SIH portal)  
**Prototype:** https://sih2026-bis-assistant.vercel.app  
**Repository:** https://github.com/PhoenixOP231/BIS_Sahayak_SIH  
**Updated:** 26 September 2026

The team ID is not present in the supplied materials. Add it before submission. This is an independent student prototype, not a BIS service or endorsement.

## Thirty-second pitch

Consumers and small manufacturers often need the next useful action from a standard, not another long search. BIS Sahayak offers English and Hindi conversations with consumer and industry modes. It retrieves from 21 demonstration standard summaries, links to the relevant view, and routes licence checks to BIS Care or e-BIS. We have a working public prototype. Authorised BIS content and independent accuracy review are the next steps before any official deployment.

## Answers aligned to the evaluation rubric

### 1. Novelty and innovation

**Answer:** The contribution is task-based explanation across two audiences. Consumers get plain-language guidance and official verification handoffs. MSMEs get a route to relevant standards, schemes, labs and licensing steps. Citations open a local summary with an official BIS link. BIS already offers standards search and licence services; we do not claim to replace them.

### 2. Relevance to SIH26107

**Answer:** The prototype covers natural-language standards questions, product guidance, certification schemes, hallmarking, laboratory discovery, licensing and multilingual interaction. These match the expected capabilities described in the [public SIH26107 listing](https://sih2026.vuce.in/ps/SIH26107). That listing is secondary; confirm the final problem title and theme in the official team portal.

### 3. Technical approach

**Answer:** Next.js 15 and React 19 run the interface. The current retrieval path indexes 21 local JSON demonstration summaries. It combines weighted terms with cosine similarity over 768-dimensional hashed vectors. Up to five chunks are passed to Gemini 3.5 Flash-Lite with consumer or industry and language instructions. If the model fails, a deterministic fallback response is returned. The API exposes whether fallback occurred. The current production retrieval path does **not** query pgvector.

### 4. Feasibility and viability

**Answer:** The public app is deployed and the current local check passed 32 automated tests across four suites, lint and production build. This proves the prototype runs; it does not establish regulatory accuracy or national scale. A six-week pilot is proposed: source-permission and version audit, user-task testing, then independent review of outcomes and costs. Database, model, maintenance and content-review costs must be measured; there is no zero-cost claim.

### 5. Prototype demonstration

**Answer:** Show one consumer question about pressure cookers and open its IS 2347 summary. Switch to industry mode and ask about test requirements. Next, enter an unknown plausible CM/L number in the verifier: it must show *unverified*, never *certified*. End at the official BIS Care or e-BIS link. The demo licence directory is fictional and labelled as such.

### 6. Impact and scalability

**Answer:** Potential benefit is less navigation effort and a clearer route to official services. It has not been measured. Proposed pilot: 20 consumers and 10 MSME users; compare task completion with manual portal search. Review 100 queries for citation relevance and unsupported numerical safety limits. Proposed targets on the deck are goals, not outcomes.

### 7. User experience and accessibility

**Answer:** The app offers English and Hindi UI modes, consumer and industry modes, mobile layouts, sample prompts and browser speech playback. Voice quality and accessibility still require real-device testing, including screen-reader checks and Hindi voice availability.

### 8. Sustainability and ethics

**Answer:** Local demonstration records never establish a current BIS licence. Unknown numbers route to official verification. AI responses may still be wrong, so the product links sources and needs independent review. The chat route can log queries when a database is configured; obtain consent and define retention and redaction before a broader pilot.

### 9. Presentation and questions

**Answer:** Keep the live demo to one question, one citation and one unverified licence lookup. If the network fails, explain the deterministic fallback and show the prepared deck. Never present a fallback as live model output or claim a zero-hallucination guarantee.

### 10. Teamwork

**Answer:** Assign and confirm actual team members for domain research, retrieval/data, frontend/accessibility and testing/demo roles before the jury. Do not claim unverified individual contributions.

## Likely jury challenges

**Does this verify ISI licences?** No. It checks CM/L format and searches a fictional demonstration set. For current legal status, use the [official BIS Care app](https://www.bis.gov.in/bis-apps/?lang=en) or e-BIS.

**Are your cited clauses official full text?** No. The 21 records are demonstration summaries with metadata and official-source links. An authorised BIS corpus, version control and reviewer sign-off are needed for production.

**Can you guarantee no hallucinations?** No. Retrieval and low-temperature prompting reduce unsupported answers but cannot guarantee correctness. Evaluate citations and numerical values independently; refuse uncertain safety claims.

**Why not use BIS search directly?** BIS portals remain the authority. The assistant aims to help users understand which portal, standard or process to inspect next. The pilot must test whether it actually saves time.

**Where does pgvector fit?** It is a possible expansion after lawful data access and retrieval evaluation. The current production chat path uses a local in-memory index.

**How will you handle outdated QCOs and fee rules?** Link to current official notices and date each curated record. The [BIS Scheme-I concession notice](https://www.bis.gov.in/wp-content/uploads/2026/03/Scheme-1-Concession-Extension-31May2029.pdf) concerns annual minimum marking fees, not a blanket application-fee discount.

## Submission checklist

1. Insert registered team ID and confirm exact problem title and theme in the team portal.
2. Recheck the public demo and official links on presentation day.
3. Submit the six-slide PDF if the portal follows the [SIH idea-format instructions](https://www.cmrit.ac.in/wp-content/uploads/2024/10/SIH2024_IDEA_Presentation_Format.pdf); keep the editable PPTX for rehearsal.
4. Do not describe demonstration standards or licences as official BIS data.
