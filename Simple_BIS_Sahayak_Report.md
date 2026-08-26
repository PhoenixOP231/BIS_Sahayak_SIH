# 🇮🇳 BIS Sahayak (बीआईएस सहायक)
## Simple Project Guide & Complete Context

---

### 🌟 1. The Real-Life Problem: Why Did We Build This?

Imagine this everyday situation in India:

1. **A Mother Buying a Pressure Cooker or Toys:**
   - She goes to the market and sees a pressure cooker with a shiny **ISI mark** stamp.
   - *Is it authentic or a fake, dangerous duplicate?*
   - Sub-standard pressure cookers can explode, fake electrical wires can catch fire, and cheap uncertified toys can contain toxic heavy metals. 
   - Everyday citizens have no easy way to know what is safe and what is counterfeit.

2. **A Small Factory Owner (MSME) Making Steel or Cables:**
   - The Government issues strict **Quality Control Orders (QCOs)** stating that certain products *must* meet certified Bureau of Indian Standards (BIS) specifications.
   - To find the exact rules, the factory owner has to download 100-page, dense government gazette PDF documents full of complex engineering jargon.
   - Hiring expensive regulatory consultants costs a lot of money and delays manufacturing.

#### ❓ The Core Problem:
> **Indian Standards are safety-critical and legally mandatory, but they are locked in complicated legal PDFs that regular citizens cannot understand and small businesses struggle to search.**

---

### 💡 2. What is BIS Sahayak? (The Solution)

**BIS Sahayak (बीआईएस सहायक)** is a smart, 24/7 digital AI companion for product safety and Indian Standards.

It reads and understands thousands of pages of official **Bureau of Indian Standards (IS)** documents and answers any question instantly in plain, easy-to-understand language.

It has **two distinct modes (Dual-Persona)** depending on who is using it:

1. **🛒 Consumer Mode (For Everyday Citizens & Shoppers):**
   - Plain everyday language explanations
   - Spotting fake ISI marks and counterfeit warnings
   - What to check before buying products (cookers, water, helmets, toys)
   - Step-by-step guidance on filing complaints via the official BIS Care Mobile App

2. **🏭 Industry / MSME Mode (For Factory Owners, Engineers & Labs):**
   - Exact numerical test limits (tensile stress, burst pressure, voltage limits)
   - Mandatory QCO gazette notification dates and compliance rules
   - Routine vs. Type testing protocols
   - Harmonized System (HS) trade classification codes

---

### 🚶‍♂️ 3. End-to-End User Journey: How People Use It

#### 🛒 Scenario A: Everyday Citizen (Consumer Mode)
*Example: Ramesh wants to buy a pressure cooker and make sure it is safe.*

1. **Open the Website:** Ramesh opens https://sih2026-bis-assistant.vercel.app on his phone.
2. **Select Consumer Mode & Hindi:** He taps **Consumer Mode** and switches language to **हिन्दी**.
3. **Ask the Question:** He asks: *"Is my pressure cooker safe? What should I check?"*
4. **Instant Plain-Language Answer:**
   - The AI tells him: *"Domestic pressure cookers must be certified under IS 2347:2017. Look for the ISI mark with a 7 or 8-digit CM/L license number printed beneath it."*
   - It provides a 3-point checklist: (1) Check metallic safety valve, (2) Inspect gasket release system, (3) Never buy without a valid CM/L number.
5. **Listen to Audio (🔊):** Ramesh clicks the speaker button to hear the answer spoken out loud.
6. **Verify the ISI Mark (/verify):** He flips the box, enters the license number on the **Verify ISI Mark** page, and gets instant instructions on verifying the manufacturer on the **BIS Care App**.

#### 🏭 Scenario B: Small Business Owner / Manufacturer (Industry Mode)
*Example: Priya runs a steel mill and wants to manufacture Fe 500D TMT bars for construction.*

1. **Select Industry Mode:** Priya visits the portal and switches to **Industry / MSME Mode**.
2. **Ask Technical Query:** She asks: *"What are the mandatory tensile and elongation limits for Fe 500D under IS 1786?"*
3. **Exact Engineering Limits:**
   - Proof Stress / Yield Stress: Minimum **500.0 N/mm² (MPa)**
   - Tensile Strength (UTS): Minimum **565.0 N/mm²**
   - Percentage Elongation: Minimum **16.0%**
   - Mandatory QCO Status: Ministry of Steel gazette order mandates Scheme-I certification.
4. **Interactive Clause Inspection:** Priya clicks the badge **[IS 1786:2008]** right inside the chat. A slide-out drawer appears displaying Clause 8.1 (Chemical composition) and Clause 9.2 (Bend test parameters) without leaving the chat.

---

### 🛠️ 4. Key Superpowers & Features

- **Zero-Hallucination AI (RAG):** Unlike regular ChatGPT which can guess or make up numbers, BIS Sahayak only answers using authentic, pre-loaded Indian Standards documents.
- **4-Step ISI License Verifier (/verify):** Anyone can enter a 7 or 8-digit CM/L number and learn how to confirm the factory license on the official BIS Care mobile app.
- **Standards Directory (/standards):** A digital catalog where you can search through 21+ Indian Standards (helmets, drinking water, toys, LPG cylinders, footwear, electrical cables, cement).
- **100% Bilingual (English + हिन्दी):** Full UI and AI responses in natural Hindi (Devanagari) and English.
- **Speech Synthesis (Voice Assistant):** Built-in browser audio reading that speaks out answers in natural voices.
- **100% Uptime & Fast:** Built on Next.js 15. Even if external databases are down, a built-in memory engine keeps the app running.

---

### ⚙️ 5. How It Works Behind the Scenes (In Simple Terms)

Think of BIS Sahayak like an expert librarian:
1. **SEARCH:** When you ask a question, the assistant searches through indexed official BIS standards in less than 15 milliseconds.
2. **REASON:** Google Gemini 2.5 Flash reads the exact standard clauses and formats the answer for either a Consumer (simple) or an Engineer (technical).
3. **PRESENT:** The website shows a 2-sentence summary, expandable technical tables, clickable citation badges, and voice playback audio.

---

### 🏆 6. Why This Matters for Smart India Hackathon 2026

- **For Citizens:** Protects families from hazardous, fake goods (exploding cookers, gas leaks, electrical fires, toxic toys).
- **For MSMEs:** Boosts **"Make in India"** by making quality compliance fast, easy, and free of expensive consultancy fees.
- **For Government (BIS):** Increases public trust in ISI marks and boosts downloads and usage of the official **BIS Care Mobile App**.

---

### 🔗 Project Links
- **Live Website:** https://sih2026-bis-assistant.vercel.app
- **GitHub Repository:** https://github.com/PhoenixOP231/BIS_Sahayak_SIH
- **SIH 2026 Presentation PPTX:** BIS_Sahayak_SIH2026_Idea_Presentation.pptx
- **Detailed PDF Handbook:** BIS_Sahayak_Complete_Project_Guide.pdf
