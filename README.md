# Rhythm Cafe

![GitHub deployments](https://img.shields.io/github/deployments/auburnsummer/rhythm-cafe/production?label=vercel)
![Discord](https://img.shields.io/discord/296802696243970049)
![GitHub](https://img.shields.io/github/license/auburnsummer/rhythm-cafe)

A website that catalogs Rhythm Doctor custom levels.

[link to the site here](https://rhythm.cafe)

# NEW VERSION

All future work is happening here: https://github.com/auburnsummer/orchard2

The new version will include:

 - Log in with Discord!
 - Edit your levels!
 - A manual system for adding levels instead of the current automated scraper
   - unfortunately the scraper is starting to fall over... a lot

# Background

[Rhythm Doctor](https://rhythmdr.com) is a rhythm game by 7th Beat Games. It also
includes a [free custom level editor][1]. As a result, there are many custom levels
created by the community. Rhythm Cafe is my attempt to organise the myriad of
available levels into something more user friendly.

This website is not a host for levels. It only aggregates levels that already have
been posted somewhere else.

[1]: https://giacomopc.itch.io/rdle

The project is split into two repositories:

 - [rd-indexer](https://github.com/auburnsummer/rd-indexer) provides the backend
   component [api.rhythm.cafe](https://api.rhythm.cafe);
 - This repo provides the frontend webapp. It's using [Preact](https://preactjs.com/)
   and [jotai](https://jotai.org/).

# Install

This project uses npm and [yarn](https://yarnpkg.com). To set up the project
locally:

```
https://github.com/auburnsummer/rhythm-cafe.git
cd rhythm-cafe
yarn install
```

# Usage

To start the local dev environment, run

```
yarn dev
```

By default, this will use the production backend at `api.rhythm.cafe`. Since
`api.rhythm.cafe` is readonly, this is perfectly fine and safe to do.


# Contributing

TBD


# Licence

[GPL (c) auburnsummer](./LICENSE)
