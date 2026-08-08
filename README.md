# EAPSL / apneasport.ee

Eesti Apneaspordi Liidu kahe-keelne staatiline veeb. Eesti keel on vaikimisi ilma prefiksita;
ingliskeelsed URL-id algavad `/en/`.

## Stack

- Astro 7, TypeScript strictest ja staatiline HTML;
- Astro content collections + Zod skeemid;
- lokaalselt pakendatud Manrope ja Source Sans 3 variable-font;
- väikesed framework'ita TypeScripti täiustused dokumentide filtrile, Canvas-sügavusele ja 3D-tilt'ile;
- Cloudflare Pages Git integration, valikuline Pages Function Facebooki serveriadapterile.

## Käivitamine

Nõutud Node.js: `>=22.12.0`.

```bash
npm ci
npm run dev
```

Kvaliteedikontrollid:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run test:e2e
```

## Sisuallikad

Organisatsioonilise sisu esimene allikas on 08.08.2026 kinnitatud EAPSL-i põhikirja PDF
`public/documents/EAPSL_pohikiri_2026-08-08.pdf`. Registrikood ja avalik kontakt on kontrollitud
Eesti spordiregistri 20.05.2026 andmete põhjal. AIDA lingid viitavad ainult AIDA Internationali
ametlikule veebile.

Põhikirja kokkuvõtted ei asenda algdokumenti. Puuduv või kinnitamata ametlik sisu on koondatud
faili [`TODO_CONTENT.md`](./TODO_CONTENT.md).

## Keskkonnamuutujad

Kopeeri lokaalseks arenduseks `.env.example` failiks `.env`. Ära commiti väärtusi.

- `PUBLIC_FACEBOOK_PAGE_URL` - kinnitatud avalik lehe URL; tühi väärtus näitab fallback'i.
- `FACEBOOK_PAGE_ID` - serveripoolne Graph API ID.
- `FACEBOOK_PAGE_ACCESS_TOKEN` - ainult Cloudflare encrypted secret.
- `FACEBOOK_API_VERSION` - kinnitatud Graph API versioon, näiteks `vNN.N`.

## Deployment

Vaata [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md). `main` on kavandatud production branch;
feature-harud ja pull request'id saavad Cloudflare preview deployment'i. DNS-i ei muudeta repo kaudu.

GitHub Pages teenindab ajutiselt juurkausta sünkroniseeritud staatilist buildi. `.nojekyll` tagab, et
Astro `_astro` varad jõuavad avalikku veebi. `CNAME` jääb juurkausta kuni Cloudflare cutover on
eraldi kinnitatud.
