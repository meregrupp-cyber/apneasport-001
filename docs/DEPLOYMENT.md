# Deployment ja rollback

## Kaks eraldi sihtkohta

| Osa                       | Host              | Kuidas jõuab tootmisse                                                   |
| ------------------------- | ----------------- | ------------------------------------------------------------------------ |
| Veebisait `apneasport.ee` | GitHub Pages      | juurkausta sünkroniseeritud `dist/` build, `main` harust                 |
| API `api.apneasport.ee`   | Cloudflare Worker | `worker/` kataloog, `npx wrangler deploy --config worker/wrangler.jsonc` |

Sait jääb GitHub Pages'ile. Cloudflare'i alt käib ainult üks hostinimi -
`api.apneasport.ee` - ja see kuulub Workerile. `apneasport.ee` DNS-i ja origin'it
ei muudeta; Cloudflare Pages projekti selle saidi jaoks ei looda.

## Sait: GitHub Pages

`main` haru juurkaust ongi avaldatav sait. Peale `npm run build` sünkroniseeritakse
`dist/` sisu juurkausta ja commititakse; `.nojekyll` hoiab `_astro` varad alles ning
`CNAME` seob apex-domeeni.

Rollback: revert vigane commit `main` harus, ehita ja sünkroniseeri uuesti.

## Keskkonnamuutujad ja secrets

Saidi build:

- `PUBLIC_FACEBOOK_PAGE_URL`: avalik build-muutuja. Kinnitatud vaikeväärtus on `src/data/site.ts`
  failis, seega seadista see ainult siis, kui keskkond vajab muud lehte.
- `PUBLIC_API_BASE_URL`: suunab buildi mujal jooksva Workeri peale. Tootmises jäta seadmata -
  vaikimisi kasutatakse `https://api.apneasport.ee`.

`FACEBOOK_*` väärtused kuuluvad `functions/api/social/facebook.ts` adapterile, mis oli mõeldud
Pages Functions'ile. GitHub Pages'il see ei käivitu ja UI näitab staatilist fallback'i.

## Sportlasstaatuse avaldus: api.apneasport.ee Worker

Vorm saidil kutsub Workerit teiselt originilt. Avaldust ei saadeta liidule enne,
kui taotleja on oma e-posti aadressi kinnitanud.

1. `POST https://api.apneasport.ee/aida-athlete/apply` valideerib avalduse, paneb
   selle D1-sse ootele ja saadab taotleja aadressile kinnituslingi.
2. `GET https://api.apneasport.ee/aida-athlete/verify?token=...` kinnitab avalduse,
   saadab selle `estonia@apneasport.ee` aadressile, saadab taotlejale kviitungi ja
   suunab brauseri tagasi saidile (`?application=confirmed`), ilma tokenita.
3. `POST https://api.apneasport.ee/aida-athlete/resend` saadab kinnituskirja uuesti
   (kuni 3 korda).

CORS lubab ainult `https://apneasport.ee`; muu origin saab `403` ega saa CORS-päist.
Saaja aadress ja kodakondsus on koodis fikseeritud. Kinnituslink kehtib 24 tundi,
tokenist hoitakse ainult SHA-256 räsi, isikuandmed kustutatakse baasist kohe pärast
edastamist ja kinnitamata read 48 tunni pärast.

### Worker deployment

```bash
npx wrangler deploy --config worker/wrangler.jsonc
```

`wrangler.jsonc` sisaldab custom domain'i `api.apneasport.ee`, D1 bindingut ja
avalikku konfiguratsiooni. Esimene deploy loob custom domain'i ja selle DNS-kirje
automaatselt; `apneasport.ee` kirjeid see ei puuduta.

### D1

|             |                                                               |
| ----------- | ------------------------------------------------------------- |
| Nimi        | `apneasport-athlete-applications`                             |
| Database id | `5e6d0032-2a39-4cb8-b5bb-ea2b9c947bd5`                        |
| Regioon     | EEUR (Ida-Euroopa, EL)                                        |
| Skeem       | `worker/migrations/0001_athlete_applications.sql`, rakendatud |
| Binding     | `ATHLETE_APPLICATIONS`                                        |

```bash
npx wrangler d1 execute apneasport-athlete-applications --remote \
  --config worker/wrangler.jsonc --file worker/migrations/<uus>.sql
```

### Ainus secret

```bash
npx wrangler secret put RESEND_API_KEY --config worker/wrangler.jsonc
```

`APPLICATION_FROM_EMAIL`, `SITE_ORIGIN` ja `API_ORIGIN` ei ole salajased ja elavad
`worker/wrangler.jsonc` failis. `MAIL_API_URL` on ainult kohalikuks testimiseks.

Enne esimest kasutust tuleb Resendis kinnitada saatja domeen `send.apneasport.ee`.
Kui secret puudub, vastab API `503` ja vorm näitab kasutajale veateadet.

### Kohalik test

```bash
PUBLIC_API_BASE_URL=http://127.0.0.1:8787 npm run build
npx wrangler d1 execute apneasport-athlete-applications --local --persist-to .wrangler/state \
  --config worker/wrangler.jsonc --file worker/migrations/0001_athlete_applications.sql
npx wrangler dev --config worker/wrangler.jsonc --port 8787 --persist-to .wrangler/state \
  --var RESEND_API_KEY:test --var "SITE_ORIGIN:http://127.0.0.1:4321" \
  --var "API_ORIGIN:http://127.0.0.1:8787" --var "ALLOWED_ORIGINS:http://127.0.0.1:4321"
npx astro preview --port 4321
```

## Pages Function

`functions/api/social/facebook.ts` kasutab Graph API-d ainult siis, kui serveripoolsed väärtused on
olemas. Token ei jõua vastusesse. Cache TTL on 30 minutit, stale-if-error 24 tundi ning upstreami
timeout 4,5 sekundit.
