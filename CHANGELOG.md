# [0.16.0](https://github.com/svelteness/kit-docs/compare/v0.15.2...v0.16.0) (2022-04-21)


### Bug Fixes

* support root level files without a category ([e8784bb](https://github.com/svelteness/kit-docs/commit/e8784bbe45e29d1e39779a4857e5f3d60059349e))


### Features

* add `i18n` option to `<KitDocsLayout />` ([4b336fe](https://github.com/svelteness/kit-docs/commit/4b336fe3e7ed239591db709dcf53276553ffa5be)), closes [#13](https://github.com/svelteness/kit-docs/issues/13)



## [0.15.2](https://github.com/svelteness/kit-docs/compare/v0.15.1...v0.15.2) (2022-04-20)


### Bug Fixes

* sort ordered pages ([dddec00](https://github.com/svelteness/kit-docs/commit/dddec00384c7e0e0d38cd889125f6b110a3b1a61))



## [0.15.1](https://github.com/svelteness/kit-docs/compare/v0.15.0...v0.15.1) (2022-04-20)


### Bug Fixes

* clean up initial category/title/desc markup ([1aea7be](https://github.com/svelteness/kit-docs/commit/1aea7beb3f993aa1bb97f934506492ab21d5dc8e))



# [0.15.0](https://github.com/svelteness/kit-docs/compare/v0.14.0...v0.15.0) (2022-04-20)


### Bug Fixes

* move checking for markdown headers client-side ([4f78b03](https://github.com/svelteness/kit-docs/commit/4f78b03df00cd3003dac30422b7f7b3445f4a74a))


### Features

* add new `transform` option to `createMetaRequestHandler` ([34d65c1](https://github.com/svelteness/kit-docs/commit/34d65c1dce50c0d91835820b156b253663d4abcc))



# [0.14.0](https://github.com/svelteness/kit-docs/compare/v0.13.0...v0.14.0) (2022-04-20)


### Bug Fixes

* move slug resolver validation into function ([d6e8f4f](https://github.com/svelteness/kit-docs/commit/d6e8f4f0e36c7d1fe58fa317dffb9f0cf9eb8f52))


### Features

* pass default resolvers and formatters to respective functions ([2dfa67c](https://github.com/svelteness/kit-docs/commit/2dfa67cc417b648578fb6d39ebc53013ba84ddf1))



# [0.13.0](https://github.com/svelteness/kit-docs/compare/v0.12.0...v0.13.0) (2022-04-20)


### Features

* new `resolve` option for `createMetaRequestHandler` ([2f0804d](https://github.com/svelteness/kit-docs/commit/2f0804d6ecd250e310f5f144475e0858dd785838))
* new `resolveCategory` option for `createSidebarRequestHandler` ([623b147](https://github.com/svelteness/kit-docs/commit/623b147ecc0bfe448fee393801bd1d1aacc9f1f4))
* new `resolveSlug` option for `createSidebarRequestHandler` ([21e94fb](https://github.com/svelteness/kit-docs/commit/21e94fb720570b45a9ab6055e7a732115cd77a97))
* new `resolveTitle` option for `createSidebarRequestHandler` ([a59fb71](https://github.com/svelteness/kit-docs/commit/a59fb71ba92461e92a2b3987fc7a622e5b92af42))



# [0.12.0](https://github.com/svelteness/kit-docs/compare/v0.11.2...v0.12.0) (2022-04-20)


### Features

* new `include` and `exclude` filter options for `createMetaRequestHandler` ([253340b](https://github.com/svelteness/kit-docs/commit/253340b2836c6cf045c36fbcfad26d2be079f474))



## [0.11.2](https://github.com/svelteness/kit-docs/compare/v0.11.1...v0.11.2) (2022-04-20)


### Bug Fixes

* meta handler not matching root index file ([718cf42](https://github.com/svelteness/kit-docs/commit/718cf42b883e63860df6aff1845f2f2a610928c8))
* npm init creates empty packages on windows ([57850c8](https://github.com/svelteness/kit-docs/commit/57850c845da1d1250b948814016d4819f0355887)), closes [#11](https://github.com/svelteness/kit-docs/issues/11)
* sidebar is not aligned to container when >1440 ([f69c21e](https://github.com/svelteness/kit-docs/commit/f69c21e01645ba6a7ceffe47c75be162019d0cde))



## [0.11.1](https://github.com/svelteness/kit-docs/compare/v0.11.0...v0.11.1) (2022-04-19)


### Bug Fixes

* code fence slots not extracted correctly ([cd6e3ba](https://github.com/svelteness/kit-docs/commit/cd6e3ba4aed21512d470df699fd2dadc4178ecbd))



# [0.11.0](https://github.com/svelteness/kit-docs/compare/v0.10.1...v0.11.0) (2022-04-19)


### Bug Fixes

* actively update head tags ([781b14d](https://github.com/svelteness/kit-docs/commit/781b14dfe0fe1abfa7eb18dc7c5f7227c80d1b8b))
* meta file matching failing ([bf276ae](https://github.com/svelteness/kit-docs/commit/bf276ae295bf5d70aee9b7c600b8e93446b64709))


### Features

* allow one level down deep matching ([4acd00e](https://github.com/svelteness/kit-docs/commit/4acd00ec897bd23bd904e72f81278aa16d7049c9))



## [0.10.1](https://github.com/svelteness/kit-docs/compare/v0.10.0...v0.10.1) (2022-04-19)


### Bug Fixes

* dont render code highlights if there are none ([0670712](https://github.com/svelteness/kit-docs/commit/0670712390a9a820327b6f0412e1e9d376bd946d))
* improve index and deep path matching ([7511197](https://github.com/svelteness/kit-docs/commit/7511197d0973fd8fbca3deba82266ac3f60017e8))
* only deep match the closest index file ([f18c57f](https://github.com/svelteness/kit-docs/commit/f18c57ffdc385c70c625a19ec7efd0cdda4ebc00))



# [0.10.0](https://github.com/svelteness/kit-docs/compare/v0.9.4...v0.10.0) (2022-04-19)


### Bug Fixes

* bottom sidebar items not visible on mobile ([60cfc18](https://github.com/svelteness/kit-docs/commit/60cfc183376239216eb5c1dabc1ab97ecc76f29b))
* button text size incorrect ([3562db1](https://github.com/svelteness/kit-docs/commit/3562db18b65dbd313c6018b982ae5e212e6ddc4f))
* glob matching on sidebar filter wont work unless path starts with `/` ([0fc46fd](https://github.com/svelteness/kit-docs/commit/0fc46fdddb0450937467c36523aab5f49f02f396))
* hide next/prev links container when there is none ([6412eaf](https://github.com/svelteness/kit-docs/commit/6412eafba0174fe14212ffdea6aa24d57d15e4bb))
* improve sidebar deep matching ([083df87](https://github.com/svelteness/kit-docs/commit/083df874bf048e8c8e9f831172a362027af303a2))
* only use markdown article when meta is present ([f58d331](https://github.com/svelteness/kit-docs/commit/f58d331b592b421e8cee5e67f6786b535d208ed2))
* raised button should be rounded ([e80d24b](https://github.com/svelteness/kit-docs/commit/e80d24b68c9a05503335afed836f2c2b68703575))


### Features

* add css variable to remove navbar bottom border ([91a29f8](https://github.com/svelteness/kit-docs/commit/91a29f87838d29d7592cd353c0c8f0a5fbff99a7))
* new `--kd-content-max-width` and `--kd-navbar-max-width` css props ([6b9fb2b](https://github.com/svelteness/kit-docs/commit/6b9fb2baf02ccd48f42c04998e9911952e5cd147))
* support `.svelte` files in sidebar handler ([47804ba](https://github.com/svelteness/kit-docs/commit/47804ba3b5b1904b90538d9adb57e07673a8a6df))



## [0.9.4](https://github.com/svelteness/kit-docs/compare/v0.9.3...v0.9.4) (2022-04-19)


### Bug Fixes

* detect index file against any file type ([81c8c53](https://github.com/svelteness/kit-docs/commit/81c8c5306860bb80940ec8daef87db80aa83e112))



## [0.9.3](https://github.com/svelteness/kit-docs/compare/v0.9.2...v0.9.3) (2022-04-19)


### Bug Fixes

* filter sidebar using clean paths ([66a1f94](https://github.com/svelteness/kit-docs/commit/66a1f94980f911d21028312c51b23a5b22cb5bc3))



## [0.9.2](https://github.com/svelteness/kit-docs/compare/v0.9.1...v0.9.2) (2022-04-19)


### Bug Fixes

* add debug option to request handlers ([66c5ae6](https://github.com/svelteness/kit-docs/commit/66c5ae6f5ced8a19cf58ce1dd61563d68bcbb5c0))



## [0.9.1](https://github.com/svelteness/kit-docs/compare/v0.9.0...v0.9.1) (2022-04-19)


### Bug Fixes

* `sidebar` prop on `KitDocsLayout` type can be `null` ([95a1003](https://github.com/svelteness/kit-docs/commit/95a10037462926dd9b6c0e9e7fc99578d384edfa))
* log error when quick install fails to create app ([b96a59a](https://github.com/svelteness/kit-docs/commit/b96a59a969144ecb55f0d764c39e0eb6890aab5f))
* remove default SvelteKit `index.svelte` on quick install ([b73d217](https://github.com/svelteness/kit-docs/commit/b73d21704978d755ed2bed9431e7c3e48a279614))



# [0.9.0](https://github.com/svelteness/kit-docs/compare/v0.8.0...v0.9.0) (2022-04-18)


### Features

* new `formatCategoryName` option on `createSidebarRequestHandler` ([602c88b](https://github.com/svelteness/kit-docs/commit/602c88b3e9d2599b53021e1c0da51dd399e2dd4c))



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
