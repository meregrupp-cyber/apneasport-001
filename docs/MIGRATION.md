# Migratsioonimärkus

`main` teenindab praegu GitHub Pagesi ühefaililist coming-soon lehte. `feat/site-v1` teisendab repo
Astro staatiliseks kahe-keelseks saidiks, liigutades vana lahenduse `legacy/coming-soon/` alla.

Feature-haru ei muuda DNS-i, custom domain'i ega `main` productionit. Juurtaseme `CNAME` jääb alles
kuni Cloudflare preview ja review on kinnitatud. Cloudflare Pagesi build kasutab ainult `dist`
väljundit, mistõttu vana juur-`CNAME` ei kuulu preview buildi.
