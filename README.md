# Bargain Beacon — Black Friday Deal Finder

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/shusay12/makefun-black-friday-deal-finder-01/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/shusay12/makefun-black-friday-deal-finder-01/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

A static Black Friday and Cyber Monday deal finder: 25 real deals, checked at their stores on 27 November 2026, each with its product, store, sale price, usual price, discount, store link and check time, plus an honest verdict on whether it is really a deal (new low, strong price, or routine sale). Search and filters by category, store and discount work, with five sort orders.

Built for the [Black Friday deal finder bounty](https://make.fun/c/black-friday-deal-finder-01) on [make.fun](https://make.fun).

## Run it

Serve `app/` with any static HTTP server — no build step, no network requests:

```sh
npx serve app
```

`main.ts` hands the site in: it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.
