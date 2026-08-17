# Sisujuhend

## Allikate järjekord

1. EAPSL-i kinnitatud põhikiri.
2. EAPSL-i juhatuse kinnitatud dokumendid ja kontaktid.
3. AIDA Internationali ametlikud reeglid ja veebiallikad.
4. Eesti ametlikud spordi-, kutse-, antidopingu- ja turvalisuse allikad.

Ära leiuta isikuid, kontakte, kuupäevi, tasusid, tulemusi, rekordeid, kutsetasemeid ega menetlusi.
Puuduv väärtus läheb `TODO_CONTENT.md` faili ja avalik tekst ütleb, et info lisandub pärast kinnitamist.

## Kahekeelsus

- Igal sisul on püsiv `translationKey`.
- Eesti on põhikeel ja elab juur-URL-il; inglise keel kasutab `/en/` prefiksit.
- Keelevahetus peab säilitama sama sisu, mitte viima avalehele.
- Kinnitatud ingliskeelse dokumendi puudumisel märgi dokument `ET`, mitte `multi`.
- Veebitõlge ei tohi esineda kinnitatud õigusliku tõlkena.

## Dokumendid

Päris dokumendil peavad enne avaldamist olema vähemalt pealkiri, kategooria, tüüp, keel, stabiilne
URL, avaldamiskuupäev ja staatus. Placeholder võib erandina jätta faili URL-i ja kuupäeva tühjaks,
kuid peab kandma `placeholder: true` ja `status: draft`.

## Uudised

Uudis elab Markdown/MDX failis. `draft: true` sisu ei jõua avalikule lehele. Facebook on levikanal,
mitte uudiste arhiiv, ning automaatne import vajab serveripoolset API-d ja kinnitatud ligipääse.

## Välislingid ja meedia

- Ametlikud muutuvad välislingid hoia `src/data/external-links.ts` failis.
- Facebooki lehe URL on kinnitatud ja elab ainult `src/data/site.ts` failis; `PUBLIC_FACEBOOK_PAGE_URL`
  kirjutab selle keskkonnas üle. Ära korda URL-i komponentides ega uudistes.
- Lisa pildile tähenduslik alt-tekst; dekoratiivsel pildil kasuta tühja alt-teksti.
- Ära lisa AI-ga loodud logo ega esita AI-isikut päris sportlase või ametikandjana.
