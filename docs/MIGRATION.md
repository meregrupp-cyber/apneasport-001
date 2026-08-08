# Migratsioonimärkus

`main` teenindas varem GitHub Pagesi ühefaililist coming-soon lehte. `feat/site-v1` asendab selle
Astro staatilise kahe-keelse saidiga. Vana placeholder eemaldatakse täielikult.

GitHub Pagesi ühilduvuseks sünkroniseeritakse kinnitatud `dist` build ajutiselt repo juurkausta ning
lisatakse `.nojekyll`. Juurtaseme `CNAME` jääb alles. Edasine Cloudflare Pagesi cutover toimub
eraldi ning ei vaja selle sammu käigus DNS-i muutmist.
