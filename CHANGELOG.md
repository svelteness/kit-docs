# [0.23.0](https://github.com/svelteness/kit-docs/compare/v0.22.12...v0.23.0) (2022-07-13)


### Bug Fixes

* update to match latest svelte-kit ([22d6a83](https://github.com/svelteness/kit-docs/commit/22d6a8350212c3aa2efc0b70cb29b219f16bed91)), closes [#50](https://github.com/svelteness/kit-docs/issues/50) [#51](https://github.com/svelteness/kit-docs/issues/51)



## [0.22.12](https://github.com/svelteness/kit-docs/compare/v0.22.11...v0.22.12) (2022-05-18)


### Bug Fixes

* catch potential error on missing meta data ([#27](https://github.com/svelteness/kit-docs/issues/27)) ([8cb923a](https://github.com/svelteness/kit-docs/commit/8cb923a8b780e975a9a96b54f443db5d5e5f0c57))



## [0.22.11](https://github.com/svelteness/kit-docs/compare/v0.22.10...v0.22.11) (2022-05-09)


### Bug Fixes

* default code fence title should be consistent (lowercase) ([f90062c](https://github.com/svelteness/kit-docs/commit/f90062c7aec6cf79a39e8e2493e09309c1eba6ed))
* docsearch button has unintended shadow on small devices ([9aef3f2](https://github.com/svelteness/kit-docs/commit/9aef3f2ff5826804ec9a0609ad2fceba22811add))



## [0.22.10](https://github.com/svelteness/kit-docs/compare/v0.22.9...v0.22.10) (2022-05-08)


### Bug Fixes

* docsearch search icon shifts on hydration ([81cb109](https://github.com/svelteness/kit-docs/commit/81cb10902738fd91b082cc5d7911945646fb728f))



## [0.22.9](https://github.com/svelteness/kit-docs/compare/v0.22.8...v0.22.9) (2022-05-08)


### Bug Fixes

* slight docsearch styling improvements ([55e26a3](https://github.com/svelteness/kit-docs/commit/55e26a36ea43b9d9fb2d2825b3fa8c17ca22abc9))



## [0.22.8](https://github.com/svelteness/kit-docs/compare/v0.22.7...v0.22.8) (2022-05-06)


### Bug Fixes

* ignore matcher syntax `=` when sorting ordered pages ([ba11d4a](https://github.com/svelteness/kit-docs/commit/ba11d4a786300c1bf9ae619b09d8e0bf50fbb3dd))



## [0.22.7](https://github.com/svelteness/kit-docs/compare/v0.22.6...v0.22.7) (2022-04-27)


### Bug Fixes

* md code plugin stripping redundant value from inline code ([ab0a599](https://github.com/svelteness/kit-docs/commit/ab0a599e45af6da3f21fa91d25f20682163210bd))
* sidebar link icon field typed incorrectly ([bb4364a](https://github.com/svelteness/kit-docs/commit/bb4364a7c5f30da46b87d33513e3153ece9e41f6))



## [0.22.6](https://github.com/svelteness/kit-docs/compare/v0.22.5...v0.22.6) (2022-04-26)


### Bug Fixes

* deep clone parsed markdown result in handlers to avoid leakage ([85fd9a8](https://github.com/svelteness/kit-docs/commit/85fd9a8aabc2b032e5b1624d020ad45ae31be669))



## [0.22.5](https://github.com/svelteness/kit-docs/compare/v0.22.4...v0.22.5) (2022-04-26)


### Bug Fixes

* attach transformed meta back to returned response ([5299339](https://github.com/svelteness/kit-docs/commit/5299339f87cda1d0c63a8a779daa86e9ebb2a558))
* run resolved transformers last ([8131762](https://github.com/svelteness/kit-docs/commit/81317622cb03ae3d94184aec5fddf9a9a2ce022c))



## [0.22.4](https://github.com/svelteness/kit-docs/compare/v0.22.3...v0.22.4) (2022-04-26)


### Bug Fixes

* avoid transforming same meta object every request due to caching ([c597d6d](https://github.com/svelteness/kit-docs/commit/c597d6d8c6d7422ea85cc681758ff6821bd89b57))



## [0.22.3](https://github.com/svelteness/kit-docs/compare/v0.22.2...v0.22.3) (2022-04-26)


### Bug Fixes

* docsearch modal broken on mobile ([f007b32](https://github.com/svelteness/kit-docs/commit/f007b32a75cf5d6f2d51641842d065ba564bd4fb))
* hide magnifier icon in docsearch on mobile ([5df392a](https://github.com/svelteness/kit-docs/commit/5df392a30b72359b5c34f78063f1b2322d8dee6b))
* prevent focus ring on docsearch keys ([c934a73](https://github.com/svelteness/kit-docs/commit/c934a7329e52c07fc35bcd8a5cd914126aaeaa32))
* show focus ring around docsearch button ([2a0d401](https://github.com/svelteness/kit-docs/commit/2a0d4019395caeae718386ed44d73cc6f1d66965))



## [0.22.2](https://github.com/svelteness/kit-docs/compare/v0.22.1...v0.22.2) (2022-04-26)


### Bug Fixes

* accessibility improvements and new `--kd-color-focus` css var ([bcf7576](https://github.com/svelteness/kit-docs/commit/bcf7576e55dda8f6933b72a7c4afa802ef0071bc))



## [0.22.1](https://github.com/svelteness/kit-docs/compare/v0.22.0...v0.22.1) (2022-04-26)


### Bug Fixes

* popover has excessive top empty space ([41bca4c](https://github.com/svelteness/kit-docs/commit/41bca4c67dd7630fd4a5c132978cbecb1267b2e0))



# [0.22.0](https://github.com/svelteness/kit-docs/compare/v0.21.3...v0.22.0) (2022-04-26)


### Features

* new `slugifyFilePath` export from node dist ([d0de580](https://github.com/svelteness/kit-docs/commit/d0de580b61eeb88b8a37d6c9b3bef4b8bc1f1cda))



## [0.21.3](https://github.com/svelteness/kit-docs/compare/v0.21.2...v0.21.3) (2022-04-25)


### Bug Fixes

* clean file path not returning path relative to routes ([d0dd25a](https://github.com/svelteness/kit-docs/commit/d0dd25aedb5d51b32d6f23ad8e1aa8b53d21bd99))
* new `--kd-main-max-width` css property ([01e04ae](https://github.com/svelteness/kit-docs/commit/01e04ae3af3f2d9632e2ec049c3392336c0e208c))



## [0.21.2](https://github.com/svelteness/kit-docs/compare/v0.21.1...v0.21.2) (2022-04-25)


### Bug Fixes

* bottom sidebar items are not visible ([9acc2e4](https://github.com/svelteness/kit-docs/commit/9acc2e473ed1420b2ddee601631a3de5d8a51afd))
* collapsed navbar still showing middle divider ([24d5eeb](https://github.com/svelteness/kit-docs/commit/24d5eeb17cb80c6561e33dc63fb2bb4c494f39c3))



## [0.21.1](https://github.com/svelteness/kit-docs/compare/v0.21.0...v0.21.1) (2022-04-25)


### Bug Fixes

* select component design tweaks ([7e7f3d5](https://github.com/svelteness/kit-docs/commit/7e7f3d5ba5759badd58e0e900bb07a5236fd7097))
* set back original sidebar min width ([337c2b1](https://github.com/svelteness/kit-docs/commit/337c2b121347df4945e7e3cb6ab97d4aa669673d))



# [0.21.0](https://github.com/svelteness/kit-docs/compare/v0.20.0...v0.21.0) (2022-04-25)


### Bug Fixes

* clean up select component styles ([f1735d3](https://github.com/svelteness/kit-docs/commit/f1735d3053e0bd8410c1762f54b07847507396d4))


### Features

* more css variables for customizing default layout ([87dae88](https://github.com/svelteness/kit-docs/commit/87dae88cc8737fbc7385d4b7150d2be4adcaa14c))



# [0.20.0](https://github.com/svelteness/kit-docs/compare/v0.19.1...v0.20.0) (2022-04-25)


### Features

* pass markdown parser to `transform` function ([8907891](https://github.com/svelteness/kit-docs/commit/8907891e5c4dfca710c2844e83ce172be89e342e))



## [0.19.1](https://github.com/svelteness/kit-docs/compare/v0.18.4...v0.19.1) (2022-04-25)


### Bug Fixes

* `padding-top` not removed from `<main>` if no meta ([6aa9979](https://github.com/svelteness/kit-docs/commit/6aa9979c71f845fb27bb982b125fcdbb230d274e))
* layout not set correctly when navbar is `false` ([f49e4ce](https://github.com/svelteness/kit-docs/commit/f49e4cedb967bebfa6c89ef0a7fcdbe1275e7d77))
* only include markdown files by default in handlers ([27c844a](https://github.com/svelteness/kit-docs/commit/27c844a5c8aff59621c7a992c0ce0f68de037462))
* remove all `<main>` padding if no meta ([d28965e](https://github.com/svelteness/kit-docs/commit/d28965e3f1336a2d7216a661a80848c38b880cb5))
* remove padding on `<main>` if no meta ([2ad8b98](https://github.com/svelteness/kit-docs/commit/2ad8b98bc5c32d2fd4f0b74c09d1fc5ac22d0d04))


### Features

* new `extensions` option for handlers ([169f3e9](https://github.com/svelteness/kit-docs/commit/169f3e984df45c423037dcc4cd5c9b9ab90b6a02))


## [0.18.4](https://github.com/svelteness/kit-docs/compare/v0.18.3...v0.18.4) (2022-04-24)


### Bug Fixes

* escape raw code in code fences to avoid preprocessor errors ([6595bb9](https://github.com/svelteness/kit-docs/commit/6595bb98e8b17ab4ce98a4c4a5d171526d5b869f)), closes [#18](https://github.com/svelteness/kit-docs/issues/18)



## [0.18.3](https://github.com/svelteness/kit-docs/compare/v0.18.2...v0.18.3) (2022-04-24)


### Bug Fixes

* add focus visible outline to docsearch button ([def5cdf](https://github.com/svelteness/kit-docs/commit/def5cdfbb17cc63cbd951bdad96af9e189732b83))
* add focus visible outline to docsearch reset button ([cacc645](https://github.com/svelteness/kit-docs/commit/cacc64530488b8e0a686bf93c17cc9427310a551))
* docsearch styles cleanup for better readability ([27c7e89](https://github.com/svelteness/kit-docs/commit/27c7e8952b5511943161825831acc709158b4e99))



## [0.18.2](https://github.com/svelteness/kit-docs/compare/v0.18.1...v0.18.2) (2022-04-24)


### Bug Fixes

* slight docsearch design tweaks ([db2c7c0](https://github.com/svelteness/kit-docs/commit/db2c7c0d7bd97227e2c6784dd0570a035e50659a))



## [0.18.1](https://github.com/svelteness/kit-docs/compare/v0.18.0...v0.18.1) (2022-04-24)


### Bug Fixes

* actually remove docsearch form input padding ([7eeb2dc](https://github.com/svelteness/kit-docs/commit/7eeb2dcaab4ce65c6098a2b7b417bedd813b6c1e))
* add `Home` and `End` keyboard shortcuts for dialogs ([9b7b254](https://github.com/svelteness/kit-docs/commit/9b7b254ab4c3dda16c5ed665decc8749635f119c)), closes [#16](https://github.com/svelteness/kit-docs/issues/16)
* remove hardcoded code fence bg color ([2b45dca](https://github.com/svelteness/kit-docs/commit/2b45dca876b9e3303ead745b144f2ca194350e2c)), closes [#17](https://github.com/svelteness/kit-docs/issues/17)



# [0.18.0](https://github.com/svelteness/kit-docs/compare/v0.17.0...v0.18.0) (2022-04-22)


### Bug Fixes

* docsearch form input slightly off due to padding ([2a9b07a](https://github.com/svelteness/kit-docs/commit/2a9b07a5bee76d250f175f4655ef3c3af1e3d3c7))


### Features

* add navigation context ([7f08226](https://github.com/svelteness/kit-docs/commit/7f08226f6e21735fa84ef5307a087873331e414a))



# [0.17.0](https://github.com/svelteness/kit-docs/compare/v0.16.1...v0.17.0) (2022-04-22)


### Bug Fixes

* deep match at root not categorized correctly ([7d15114](https://github.com/svelteness/kit-docs/commit/7d15114dda06eb8b5bb0b5ea43cb7caa5e66e875))


### Features

* `resolve` and `transform` meta options can be an array ([fe93f23](https://github.com/svelteness/kit-docs/commit/fe93f232ef6fabe3c1b87a04ff33c9cdf70f7128))



## [0.16.1](https://github.com/svelteness/kit-docs/compare/v0.16.0...v0.16.1) (2022-04-22)


### Bug Fixes

* add more translations ([#15](https://github.com/svelteness/kit-docs/issues/15)) ([87df79d](https://github.com/svelteness/kit-docs/commit/87df79d395b922e67cdbf5c5a22f5c71938b01ed))



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
