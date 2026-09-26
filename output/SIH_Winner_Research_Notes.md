# Research behind the Logic Lords SIH26107 pitch

Updated 26 September 2026. The new six-slide deck follows the supplied SIH 2026 idea template. Past winners informed structure only; their visuals, copy and metrics were not copied.

## SIH examples reviewed

| Example | Evidence reviewed | What informed this pitch |
|---|---|---|
| AWSAR, Team Hashtag, SIH 2020 | An 18-page presentation with problem evidence, workflow and use-case diagrams, features, deployment links, roadmap and team roles. The [team repository](https://github.com/PragatiVerma18/SIH2020_MK95_Hashtag) links its presentation. Its [mentor's retrospective](https://github.com/vinitshahdeo/vinitshahdeo/discussions/1) corroborates the win. | Show a concrete user task, explain the implementation, and make the live prototype easy to reach. We did not reuse its statistics. |
| VoCo, BCE/Team Vision, SIH 2022 | The [team repository](https://github.com/uzibytes/Voco_App), a [public main-deck transcript](https://pt.slideshare.net/slideshow/sih-ppt-22-for-reference-and-educatio-purpose/286053965), and an eight-page research proposal covering audience needs, accessibility, development phases, costs and a work plan. [Official SIH results](https://sih.gov.in/pdf/SIH-SOFTWARE-RESULT.pdf), page 11, identify RK774 / BCE/TEAM VISION as a winner. | Tie accessibility to actual users. Separate implemented functionality from the next development phase and make feasibility concrete. |

Downloaded deck/proposal copies came from a [public archive](https://github.com/JoysonBeera/sih-winning-presentations). Archive filenames are not sufficient proof of winner status. These examples suggest useful presentation choices, but do not establish that a particular slide format caused a win.

## BIS Sahayak evidence used

- The supplied six-slide SIH format and “SIH2026-IDEA-Presentation- BIS 2.pptx” reference. Team name: **Logic Lords**.
- The [live app](https://sih2026-bis-assistant.vercel.app/#chat), including consumer and industry modes, citations and official-verification handoffs. Slide 2 uses a conceptual AI-generated illustration, not a prototype screenshot. Judges should try the live link.
- Repository implementation: chat route, answer generation, retrieval, translations, standard records and licence lookup.
- Local test run on 26 September 2026: **32 tests passed across four test files**; lint and production build passed. This is implementation evidence, not regulatory accuracy or impact validation.

## Claims kept precise

- **21 curated standard records**, rather than a complete, audited BIS document corpus.
- **Local keyword/cosine retrieval**, matching the current code. Production pgvector retrieval and learned multilingual embeddings belong in the proposed expansion.
- **Gemini 3.5 Flash-Lite integration with deterministic fallback**, verified on the live endpoint. The API exposes a fallback flag; the chat UI does not currently show it.
- **Licence format checks and fictional demo records**, without implying official certification authority or universal registry coverage.
- **Proposed pilot targets**, visibly separated from measured results. No invented user adoption, cost savings, zero-hallucination guarantee or national-scale performance.

BIS already offers standards search, licence verification and laboratory information. The defensible contribution is conversational explanation adapted to the user's task, with an inspectable reference and an official next action. See [Know Your Standard](https://www.bis.gov.in/know-your-standard/?lang=en) and [BIS Care](https://www.bis.gov.in/bis-apps/?lang=en).

## Before submission

1. Enter the registered **team ID** on the cover. It was absent from the supplied reference.
2. Confirm the exact problem title and theme in your SIH portal. A [secondary SIH26107 listing](https://sih2026.vuce.in/ps/SIH26107) uses **Smart Automation**. The draft deck shows that theme with a verification reminder.
3. Use the speaker notes to rehearse the approximately five-minute pitch. Test the live demo again on presentation day.

The new PPTX is editable and contains speaker notes. The matching PDF is for portal submission after team metadata is confirmed. Neither file has been submitted anywhere.
