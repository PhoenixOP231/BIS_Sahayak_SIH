# BIS Sahayak in simple words

**Team Logic Lords | SIH26107 | Updated 26 September 2026**

## The problem

Indian product standards and BIS services can be hard to find and understand. A customer may want to check an ISI mark. A small manufacturer may need to find the applicable standard, testing lab, or licence process.

## What our prototype does

BIS Sahayak lets a person ask in English or Hindi. The person can choose a consumer or industry mode. The app searches 21 demonstration summaries of Indian Standards and gives an explanation with references. It also has pages for certification schemes, hallmarking, BIS labs and MSME licensing. A browser can read chat replies aloud.

For an ISI licence number, the app checks the CM/L format and a fictional demo directory. It **cannot confirm** that a real licence exists or remains valid. The official BIS Care app and e-BIS portal must provide that answer.

## What has been tested

The website is live at https://sih2026-bis-assistant.vercel.app. On 26 September 2026, 32 automated tests passed. The production build and lint checks passed. A live chat request used Gemini successfully. These checks do not prove the standards content is accurate enough for regulatory decisions.

## What still needs work

The team needs authorised, current BIS material and expert review before official use. It should test real users, verify citations and numerical values, measure running cost, and set privacy rules for any stored chat queries. The current records are demonstration summaries, not the full BIS collection.

Use the [official BIS standards service](https://www.bis.gov.in/know-your-standard/?lang=en) and [BIS Care](https://www.bis.gov.in/bis-apps/?lang=en) for authoritative decisions.
