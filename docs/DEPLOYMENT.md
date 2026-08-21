# Cloudflare Pages deployment ja rollback

## Valitud viis

Kasuta Cloudflare Pages GitHub Git integration'it repositooriumiga
`meregrupp-cyber/apneasport-001`.

| Seade                  | Väärtus                                         |
| ---------------------- | ----------------------------------------------- |
| Production branch      | `main`                                          |
| Build command          | `npm run build`                                 |
| Build output directory | `dist`                                          |
| Node.js                | `22.12.0` või uuem toetatud 22.x                |
| Preview branches       | kõik non-production harud või vähemalt `feat/*` |

Git-integratsiooni valik on teadlik: PR-id saavad atomaarse preview URL-i ja Cloudflare'i check run'i.
Direct Upload projektile hiljem ümber lülituda ei saa ilma uut Pages projekti loomata.

## Preview enne tootmist

1. Ühenda GitHubi repo Cloudflare Pages projektiga.
2. Veendu, et production branch on `main`; ära ühenda veel custom domain'i.
3. Luba preview harud ning ava `feat/site-v1` preview.
4. Kontrolli buildi, ET/EN seoseid, mobiili, klaviatuuri, reduced-motion'it, dokumenti ja fallback'i.
5. Kontrolli preview vastusest `X-Robots-Tag: noindex`.
6. Lisa preview URL draft PR-i ning kogu review.

## Keskkonnamuutujad ja secrets

- `PUBLIC_FACEBOOK_PAGE_URL`: avalik build-muutuja. Kinnitatud vaikeväärtus on `src/data/site.ts`
  failis, seega seadista see ainult siis, kui keskkond vajab muud lehte.
- `FACEBOOK_PAGE_ID`: Pages Function environment value.
- `FACEBOOK_PAGE_ACCESS_TOKEN`: encrypted secret, mitte avalik build-muutuja.
- `FACEBOOK_API_VERSION`: Pages Function environment value.

Sait töötab ilma nende väärtusteta. Adapter vastab `status: unconfigured` ja UI näitab staatilist
fallback'i. Secret'i ei tohi lisada `.env`, `.dev.vars`, logisse ega brauserikoodi.

## Custom domain ja DNS - eraldi kinnitatav cutover

DNS-i ei muudeta selle branchi ega PR-i raames. Pärast kinnitatud preview'd:

1. lisa `apneasport.ee` Pages custom domain'ina;
2. kontrolli sertifikaati ja apex-domeeni canonicali;
3. lisa `www.apneasport.ee` 301 redirect apexile;
4. lisa projekti `pages.dev` hosti 301 redirect canonicalile, säilitades preview hostid;
5. kinnita alles siis vana GitHub Pages `CNAME` eemaldamine ja GitHub Pagesi väljalülitamine.

## Rollback

- Kui viga ilmneb enne merge'i, ära merge'i; preview ei mõjuta tootmist.
- Kui viga ilmneb pärast merge'i, vali Cloudflare Pages Deployments vaates viimane kinnitatud
  production deployment ja kasuta rollback'i.
- Paranda põhjus uues feature-harus ning korda preview/review protsessi.
- DNS-i rollback'i vajadus tekib ainult custom domain'i cutover'i ajal; säilita enne muutmist vana
  GitHub Pagesi kirjed ja TTL-id eraldi muudatusplaanis.

## Sportlasstaatuse avalduse vorm

Vabasukeldumise lehe vorm kasutab kahesammulist kinnitust: avaldust ei saadeta
liidule enne, kui taotleja on oma e-posti aadressi kinnitanud.

1. `POST /api/aida-athlete/apply` valideerib avalduse, paneb selle D1-sse ootele
   ja saadab taotleja aadressile kinnituslingi.
2. `GET /api/aida-athlete/verify?token=...` kinnitab avalduse, saadab selle
   `estonia@apneasport.ee` aadressile ja taotlejale lühikese kinnituskirja.
3. `POST /api/aida-athlete/resend` saadab kinnituskirja uuesti (kuni 3 korda).

Saaja aadress ja kodakondsus on funktsioonides fikseeritud ega tule kunagi
päringust. Kinnituslink kehtib 24 tundi, tokenist hoitakse ainult SHA-256
räsi ning avalduse isikuandmed kustutatakse baasist kohe pärast edastamist.
Kinnitamata read kustutatakse 48 tunni pärast: iga päring koristab aegunud
kirjed, seega eraldi ajastatud tööd pole vaja.

### Cloudflare seadistus

D1 andmebaas on juba loodud ja migreeritud (21.08.2026):

|             |                                                        |
| ----------- | ------------------------------------------------------ |
| Nimi        | `apneasport-athlete-applications`                      |
| Database id | `5e6d0032-2a39-4cb8-b5bb-ea2b9c947bd5`                 |
| Regioon     | EEUR (Ida-Euroopa, EL)                                 |
| Skeem       | `migrations/0001_athlete_applications.sql`, rakendatud |
| Binding     | `ATHLETE_APPLICATIONS`, kirjas `wrangler.jsonc` failis |

D1 loomise API ei võta eraldi jurisdiction-lippu; asukoht on määratud
`primary_location_hint` väärtusega `eeur`, seega baas asub EL-is.

Uue migratsiooni saab hiljem rakendada:

```bash
npx wrangler d1 execute apneasport-athlete-applications --remote --file migrations/<uus>.sql
```

Puudu on veel kaks secret'i, mis peavad olema Pages projekti keskkonnas
(mitte repos, mitte `PUBLIC_` prefiksiga):

- `RESEND_API_KEY`
- `APPLICATION_FROM_EMAIL` - saatja aadress kinnitatud domeenil

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name apneasport
npx wrangler pages secret put APPLICATION_FROM_EMAIL --project-name apneasport
```

`MAIL_API_URL` jäta seadmata: see on ainult kohalikuks testimiseks võlts-API vastu.

### Functions vajavad Cloudflare Pages deployment'i

Praegu teenindab `apneasport.ee` lehte GitHub Pages (vastuse päised tulevad
Fastly'lt), seega `functions/` kataloogi endpoint'e ei käivitata: nii
`/api/social/facebook` kui `/api/aida-athlete/*` vastavad avalikus veebis
`404`-ga. Avalduse vorm hakkab tööle alles siis, kui sait on Cloudflare
Pages'is deployitud ja custom domain sinna üle viidud - see cutover on
kirjeldatud allpool ning vajab eraldi kinnitust.

### Kohalik test

```bash
npm run build
npx wrangler d1 execute apneasport-athlete-applications --local \
  --persist-to .wrangler/state --file migrations/0001_athlete_applications.sql
npx wrangler pages dev dist --d1 ATHLETE_APPLICATIONS=<sama id mis wrangler.jsonc failis> \
  --binding RESEND_API_KEY=test --binding "APPLICATION_FROM_EMAIL=test@example.com" \
  --binding MAIL_API_URL=http://127.0.0.1:8790/emails
```

## Pages Function

`functions/api/social/facebook.ts` kasutab Graph API-d ainult siis, kui serveripoolsed väärtused on
olemas. Token ei jõua vastusesse. Cache TTL on 30 minutit, stale-if-error 24 tundi ning upstreami
timeout 4,5 sekundit.
