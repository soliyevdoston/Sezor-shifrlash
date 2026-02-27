# Project Passport

## 1. Identity

- Project name: Sezor Cipher Studio
- Type: Frontend web application
- Domain area: Text cryptography utilities
- Version: 1.0.0

## 2. Goal

Deliver a professional Caesar cipher product with cryptii-like UX and multilingual support (UZ/RU/EN), ready for deployment.

## 3. Functional Scope

- Input plaintext and generate ciphertext
- Encode/decode mode per operation card
- Shift control (0..25)
- Preserve-case toggle
- Operation chaining in a horizontal pipeline
- Insert operation at exact position using connector `+`
- Reorder and delete operation cards
- Copy output result

## 4. UX/UI Requirements

- Horizontal card flow similar to cryptii
- Language selector aligned to top-right in header
- Mobile support with horizontal scroll for pipeline
- Clear visual hierarchy and readable typography

## 5. Localization

- Supported languages: Uzbek, Russian, English
- All visible UI strings localized from a translation map
- Selected language persisted in localStorage key: `sezor.language`

## 6. SEO & Discoverability

Implemented:
- Meta title/description/keywords/robots/theme-color
- Open Graph and Twitter tags
- JSON-LD (`WebApplication`)
- `robots.txt`
- `sitemap.xml` (domain placeholder requires replacement)
- `site.webmanifest`
- `favicon.svg`
- `og-image.svg`

## 7. Build & Delivery

Scripts:
- `npm run dev`
- `npm run build`
- `npm run preview`

Build status:
- Production build passes successfully.

## 8. Repository Hygiene

`.gitignore` covers:
- `node_modules`
- `dist`
- `.env*`
- logs
- IDE/system artifacts
- coverage/temp files

## 9. Pre-Deploy Checklist

1. Replace placeholder domain in `public/sitemap.xml`.
2. Verify metadata texts for final brand/legal wording.
3. Run `npm run build` and `npm run preview`.
4. Deploy static `dist/` to hosting (Vercel/Netlify/Nginx).
