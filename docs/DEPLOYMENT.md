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

Vabasukeldumise lehe vorm postitab `/api/athlete-application` Pages Functionile,
mis saadab avalduse e-kirjaga aadressile `estonia@apneasport.ee`. Saaja aadress ja
kodakondsus on funktsioonis fikseeritud ega tule kunagi päringust.

Vajalikud Cloudflare secret'id (mitte `PUBLIC_` prefiksiga, mitte repos):

- `RESEND_API_KEY` - Resendi API võti.
- `APPLICATION_FROM_EMAIL` - kinnitatud saatja, näiteks `AIDA Estonia <noreply@apneasport.ee>`.

Enne esimest kasutust tuleb Resendis kinnitada saatja domeen (SPF/DKIM kirjed).
Kui secret'id puuduvad, vastab endpoint `503` ja vorm näitab kasutajale veateadet -
avaldust vaikselt kaotsi ei lähe.

Vorm on kaitstud honeypot-väljaga ja ühe avaldusega minutis IP kohta.

## Pages Function

`functions/api/social/facebook.ts` kasutab Graph API-d ainult siis, kui serveripoolsed väärtused on
olemas. Token ei jõua vastusesse. Cache TTL on 30 minutit, stale-if-error 24 tundi ning upstreami
timeout 4,5 sekundit.
