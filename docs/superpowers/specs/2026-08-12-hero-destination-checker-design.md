# Hero Destination Checker

## Goal
Replace hero application fields (name/email/destination) with the two destination-checker dropdowns + result panel. Keep `Start application` always able to open checkout.

## Behavior
- Inputs: license issued country + travel destination (flags, search, source auto-detect)
- Result card shows when destination selected (status / format / price / condition note)
- No checker Apply CTA / trust line in hero
- `Start application` always opens checkout (`source=hero_form`)
- If dest selected → pass `country_travel`; if source selected → also `source_country`
- No form validation gating checkout

## Implementation
- Shared `js/idp-checker.js` + `css/idp-checker.css` (sourced from destination-checker)
- EN `index.html` hero card only for this change
- `destination-checker.html` switched to shared assets to avoid dual country data

## Out of scope
- Locale index pages
- Changing left-column hero CTAs / copy
