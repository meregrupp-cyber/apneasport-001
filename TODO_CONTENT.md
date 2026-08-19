# TODO: kinnitamist vajav ametlik sisu

Selles failis on väärtused, mida MVP ei leiuta. Avalikul lehel kasutatakse nende asemel
selget teadet „Info lisandub pärast kinnitamist” / “Information will be added after approval”.

## Organisatsioon ja juhtimine

- [ ] Kinnitada 08.08.2026 põhikirja redaktsiooni registrikande/jõustumise kuupäev.
- [ ] Kinnitada avaldatavad juhatuse liikmed, president, rollid, volituste tähtajad ja kontaktid.
- [ ] Kinnitada moodustatud komisjonid/töörühmad, nende ülesanded ja koosseisud.
- [ ] Selgitada spordiregistri organisatsiooniliigi uuendamine: 20.05.2026 seisuga on liik „Spordiklubi”.
- [ ] Mitte väita kuulumist tulumaksusoodustusega ühingute nimekirja enne registri kinnitust; 20.05.2026 ESR-i seis on „Ei”.

## Dokumendid ja menetlused

- [ ] Eetikakoodeks.
- [ ] Ohutusreeglid ja juhtumitest teatamise kord.
- [ ] Antidopingu ja ausa spordi EAPSL-i kord.
- [ ] Laste/noorte kaitse ning väärkohtlemise ennetamise kord.
- [ ] Võistlustulemuste manipuleerimise vastane kord.
- [ ] Huvide konflikti, distsiplinaar- ja vaidemenetluse kord.
- [ ] Liikmeks astumise avaldus, nõutavad lisad ning sisseastumis-/liikmemaksud.
- [ ] Majandusaasta aruanded ja muud avaldatavad juhtimisdokumendid.
- [ ] Dokumentide versioonid, vastuvõtjad, jõustumisajad ja asendusseosed.
- [ ] Põhikirja ja teiste dokumentide kinnitatud ingliskeelsed versioonid.

## Treenerid, võistlused ja sport

- [ ] EAPSL-i ametlik roll Eesti treenerikutse süsteemis.
- [ ] Kutseandja/hindamiskomisjon, tasemed, nõuded, tähtajad, tasud ja vormid.
- [ ] EAPSL-i koolitused, õppematerjalid ning koolituskalender.
- [ ] Allveevõitluse lõplik terminoloogia, võistlus- ja ohutusreeglid.
- [ ] Merineitsispordi koolitustee, võistlusdistsipliinid ja hindamiskriteeriumid.
- [ ] Võistluskalender, tulemused, rekordid, litsentsid, koondis ning valikukord.
- [ ] Vabasukeldumise sportlaste registri kinnitatud andmed: staatused, distsipliinide tulemused,
      Eesti/Euroopa/maailma rankingud, Eesti ja maailmarekordid, AIDA võistluste arv ning AIDA
      profiililingid.

## Klubid, kontaktid ja visuaalid

- [ ] MEREGRUPP-i kinnitatud täpne asukoht.
- [ ] Vähemalt üks litsentseeritud MEREGRUPP-i foto koos autori/kasutusõiguse infoga.
- [ ] Kinnitada 08.08.2026 antud EAPSL-i ringmotiivi ametlik staatus ning lisada SVG-logo,
      brändijuhend ja OG-pildid. Ringmotiivi kasutatakse tellija juhisel päises ja faviconina.
- [ ] Kinnitada 08.08.2026 antud AIDA negatiivlogo kasutusõigus. Faili kasutatakse tellija juhisel
      vabasukeldumise visuaalides.
- [ ] Litsentseeritud hero- ja kolme spordiala pildid (21:9, 16:9 ja mobiilsed 4:5 variandid) koos alt-tekstidega.

## Teenused ja keskkonnamuutujad

- [ ] Seadistada Cloudflare Pages projekti nimi ning talletada tekkinud `*.pages.dev` host.
- [ ] Seadistada kinnitatud `PUBLIC_FACEBOOK_PAGE_URL` Cloudflare build environment'is; väärtust ei
      hoita lähtekoodis. GitHub Pagesi staatiline build kasutab kinnitatud väärtust.
- [ ] Kui Graph API import kinnitatakse: `FACEBOOK_PAGE_ID`, `FACEBOOK_PAGE_ACCESS_TOKEN` ja `FACEBOOK_API_VERSION` encrypted secrets'ina.
- [ ] Otsustada, kas Facebooki serveripoolne cache kasutab Cache API-t või eraldi KV binding'ut.
- [ ] Otsustada analüütikateenus ja õiguslik alus enne selle lisamist.
- [ ] Kinnitada privaatsus- ja küpsisetekst enne tootmisesse viimist.
- [ ] Lisada `www` ja `pages.dev` hosti redirectid alles pärast custom domain'i kontrollitud cutover'it.
