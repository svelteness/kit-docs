# [0.8.0](https://github.com/svelteness/kit-docs/compare/v0.7.3...v0.8.0) (2022-04-18)


### Bug Fixes

* if `index` match sidebar props on dirname ([1a12c42](https://github.com/svelteness/kit-docs/commit/1a12c42595d0acc5598a9e575dec7af77360c65e))
* remove accidentally left `console.log` statement ([8f1dd3d](https://github.com/svelteness/kit-docs/commit/8f1dd3d374649c962ff4fbb70de6e6fb4888b679))


### Features

* `createSidebarRequestHandler` now accepts `include` and `exclude` options ([ad187e4](https://github.com/svelteness/kit-docs/commit/ad187e43016b4834fd82ca297a8868b534144e0b))
* add deep path match option `[...1_deep]filename.md` ([6b13bb1](https://github.com/svelteness/kit-docs/commit/6b13bb191e2f4e62d3bbc99bc8be373d317821b4))
* support meta matching `dir/index` ([2531782](https://github.com/svelteness/kit-docs/commit/2531782c7f580e75a9c1317c60f5c3c5c5218445))



## [0.7.3](https://github.com/svelteness/kit-docs/compare/v0.7.2...v0.7.3) (2022-04-18)


### Bug Fixes

* require `shiki` to be installed at top-level for `pnpm` users ([e7c2f63](https://github.com/svelteness/kit-docs/commit/e7c2f639277b8b4597129d26b0e7aecb183fcb83))



## [0.7.2](https://github.com/svelteness/kit-docs/compare/v0.7.1...v0.7.2) (2022-04-18)


### Bug Fixes

* include `shiki` in dep optimization ([1f44b17](https://github.com/svelteness/kit-docs/commit/1f44b176d5e4df4dbced83bd7222046a9240c871))



## [0.7.1](https://github.com/svelteness/kit-docs/compare/v0.7.0...v0.7.1) (2022-04-18)


### Bug Fixes

* bundle picomatch to avoid import issues ([01a52b2](https://github.com/svelteness/kit-docs/commit/01a52b201f736e7c26d0108508c903f9b3148a5f))



# [0.7.0](https://github.com/svelteness/kit-docs/compare/v0.6.1...v0.7.0) (2022-04-18)


### Features

* export `handleMetaRequest` function from node dist ([b187a7f](https://github.com/svelteness/kit-docs/commit/b187a7f9cec2bbc4a35426b78d9751e9fa929ce0))
* export `handleSidebarRequest` from node dist ([4206c56](https://github.com/svelteness/kit-docs/commit/4206c566cd10506f4d6954c9ee52917fe5c4420d))



## [0.6.1](https://github.com/svelteness/kit-docs/compare/v0.6.0...v0.6.1) (2022-04-18)


### Bug Fixes

* remove peer dep requirement ([3e50f4a](https://github.com/svelteness/kit-docs/commit/3e50f4af9fc43cb05630fc63acc23ea82adf8cc3))
* typo in kit-docs layout comment ([340c148](https://github.com/svelteness/kit-docs/commit/340c1485abae272b26766fd293818d1c1b3dc0f8))



# [0.6.0](https://github.com/svelteness/kit-docs/compare/v0.5.0...v0.6.0) (2022-04-17)


### Bug Fixes

* move global components dir to `src/kit-docs` ([beb4b2f](https://github.com/svelteness/kit-docs/commit/beb4b2faacb0a75c24348b481be2448e54d86dc9))
* prevent jitter on mobile when updating url hashes ([c3200ef](https://github.com/svelteness/kit-docs/commit/c3200efcfcf9acc3b4bf8f2f1e2c024985ad3d08))
* quick install not copying over certain assets ([7a581de](https://github.com/svelteness/kit-docs/commit/7a581de4ac10fa41a6331be2365c7e9d8e4619ca))
* remove max width when no sidebar is present ([5cd720b](https://github.com/svelteness/kit-docs/commit/5cd720bf176436cb1b2c9842dea760fc26a7d8a7))


### Features

* add kit-docs aliases automatically ([45c4a81](https://github.com/svelteness/kit-docs/commit/45c4a818770d150ce7fd9afea09e762ee345cab5))
* improve quick install and allow it to be run in current dir ([c70bba9](https://github.com/svelteness/kit-docs/commit/c70bba94a019522a5f43769fe0db1b51e4299cc1))
* sidebar loader can now accept multi-path config object ([eef364b](https://github.com/svelteness/kit-docs/commit/eef364b6762c64dd4b8da26717542851f5441e67))
* use `$fonts` alias for font files ([b3c2594](https://github.com/svelteness/kit-docs/commit/b3c25941e54eb4caa94abf1d8d18cf85ee188cb2))
* use named layouts to clean up quick install ([008a7c3](https://github.com/svelteness/kit-docs/commit/008a7c325f6b78379718285c4eb08d4dce7ee73b))



# [0.5.0](https://github.com/svelteness/kit-docs/compare/v0.4.0...v0.5.0) (2022-04-16)


### Bug Fixes

* dont cache markdown results when building for prod ([410bce8](https://github.com/svelteness/kit-docs/commit/410bce8a9726aa399e80ccac657a7bdd219d56f7))
* improve heading anchors on mobile ([26ea587](https://github.com/svelteness/kit-docs/commit/26ea587fb5a61da25cf0ddc404ab95da5e01c89e))
* prevent headings jumping on hover when showing hash ([2306661](https://github.com/svelteness/kit-docs/commit/23066617616fe56612ca600cd9bb78b284b196fa))


### Features

* collapse navbar on mobile when scrolling ([fe8407a](https://github.com/svelteness/kit-docs/commit/fe8407ad74f3fefb614a0bc8cf9994f36c348138))



# [0.4.0](https://github.com/svelteness/kit-docs/compare/v0.3.3...v0.4.0) (2022-04-16)


### Bug Fixes

* externalize deps correctly so builds work ([88dd93d](https://github.com/svelteness/kit-docs/commit/88dd93decc9b3bbcc9a011534aae0d9e207a432e)), closes [#5](https://github.com/svelteness/kit-docs/issues/5)
* normalize paths in loader ([2f431b6](https://github.com/svelteness/kit-docs/commit/2f431b69d445864de0143218cc02281a802c3272))
* reading `null` meta value error in `OnThisPage` component ([bb13ceb](https://github.com/svelteness/kit-docs/commit/bb13ceb727e4eeec7f096a09066da88866f02318))


### Features

* include `/docs` redirect in quick install ([be052e1](https://github.com/svelteness/kit-docs/commit/be052e13030988495a6f0bb186b06657d8d67998))



## [0.3.3](https://github.com/svelteness/kit-docs/compare/v0.3.2...v0.3.3) (2022-04-14)


### Bug Fixes

* bundle toml ([c48a8af](https://github.com/svelteness/kit-docs/commit/c48a8af1541352c409b57027b64b8b3150902674))



## [0.3.2](https://github.com/svelteness/kit-docs/compare/v0.3.1...v0.3.2) (2022-04-14)


### Bug Fixes

* missing peer deps in create script ([0503704](https://github.com/svelteness/kit-docs/commit/0503704462e0b728f072e1994e988c60306400ef))



## [0.3.1](https://github.com/svelteness/kit-docs/compare/v0.3.0...v0.3.1) (2022-04-14)


### Bug Fixes

* default kitdocs components are not imported ([1298760](https://github.com/svelteness/kit-docs/commit/129876028ba65507ef8e80a99887f9e0ca040228))



# [0.3.0](https://github.com/svelteness/kit-docs/compare/v0.2.6...v0.3.0) (2022-04-14)

### Features

- add `create-kit-docs` package ([1ec297e](https://github.com/svelteness/kit-docs/commit/1ec297e7ecd38bbae74819ab0551a83fc4b1e453))
- global components dir moved to `lib/kit-docs` ([e003ab7](https://github.com/svelteness/kit-docs/commit/e003ab7d84b4609edda135cf72161aaa1f8c6e06))

### [0.2.6](https://github.com/svelteness/kit-docs/compare/v0.2.5...v0.2.6) (2022-04-14)

### Bug Fixes

- add `svelte` entry field to `package.json` ([53c1ab4](https://github.com/svelteness/kit-docs/commit/53c1ab4b6ffe146ed48ad35a169b6f0027e4e3b2))

### [0.2.5](https://github.com/svelteness/kit-docs/compare/v0.2.4...v0.2.5) (2022-04-13)

### Bug Fixes

- move algolia back makes no difference ([7b501f7](https://github.com/svelteness/kit-docs/commit/7b501f7662e735898e109886b739582495ef37f5))

### [0.2.4](https://github.com/svelteness/kit-docs/compare/v0.2.3...v0.2.4) (2022-04-13)

### Bug Fixes

- move algolia out of main client import path ([6e2e255](https://github.com/svelteness/kit-docs/commit/6e2e2551f8db26a77cad4c74e7de0977ccc70cb5))

### [0.2.3](https://github.com/svelteness/kit-docs/compare/v0.2.2...v0.2.3) (2022-04-13)

### Bug Fixes

- exclude kit docs from vite optimization so aliases are mapped ([72aa757](https://github.com/svelteness/kit-docs/commit/72aa75708620db04f52ce4ca84ff4c258699282b))
- use `.js` extension to avoid node module resolution errors ([49470de](https://github.com/svelteness/kit-docs/commit/49470deee805d19b1949d90555dc5da3d830069f))

### [0.2.2](https://github.com/svelteness/kit-docs/compare/v0.2.1...v0.2.2) (2022-04-13)

### Features

- link active checks fails when prerendered ([9147b54](https://github.com/svelteness/kit-docs/commit/9147b54da13d63d55ad6b3152574fe370d14a7dd))
- new shorthand `frontmatter` store ([4b2ca89](https://github.com/svelteness/kit-docs/commit/4b2ca89d5613d5def01e465807c0a69ed574d4a5))

### Bug Fixes

- simplify markdown components config ([900633f](https://github.com/svelteness/kit-docs/commit/900633fb06a541f06a519a93a524b28363977037))
- simplify passing in shiki config ([289cbce](https://github.com/svelteness/kit-docs/commit/289cbceda344795aad672c26cd106f216ba15a01))

### 0.2.1 (2022-04-11)

### Features

- initial release ([fbef2ec](https://github.com/svelteness/kit-docs/commit/fbef2ecdd5e969bec5135c9c4fd4c68ea2a9b336))
