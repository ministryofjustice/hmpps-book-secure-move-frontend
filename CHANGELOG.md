# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.12.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.11.0...v2.12.0) (2020-03-05)


### Features

* Add support for new move agreed attributes ([ff1503a](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/ff1503ad584c73b3614c69e3ac2d0313fb71d6ca))
* Broad outline of move request dashboard ([55dd4aa](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/55dd4aa2959f54ed0b406d0170bf3fbab5dceb95))
* step and fields for the move reason ([6f3b2f4](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/6f3b2f42fdd0797d4e2b1366e5a714cec2d90950))
* **createmove:** Add hint text support for explicit questions ([d116476](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d116476604c9965f0d6f2ecc7d75e36a6aae9a26))
* **createmove:** Add logic to handle no prison results ([db6ed5f](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/db6ed5fead5f02666f67828d076b04bc1d68df04))
* **createmove:** Add release status field ([2babdca](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/2babdcaa0a6ff7c94db422c555e57d3da52c7308))
* **createmove:** Add separate special vehicle step ([8c23b6b](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/8c23b6bc89ba6d4ea1490f2232c07b9eba557f6b))
* **formwizard:** Add ability to hide back link ([86db1a8](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/86db1a8276c2a6a9a431288f27feca9e5beaff63))
* **formwizard:** Create new blocks for form actions ([5ad4c47](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/5ad4c47f0548ebbf0e78c8ace5e63caa22a36079))
* Add inset text GOV.UK component ([4b5c67e](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/4b5c67ef3e2f143279e8b2f6577899e5ee3eaa53))
* Introduce changelog ([2118c9c](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/2118c9c14fbf05c0bf75eb902970273611b43f09))
* set conditional field depending on role ([d256a1c](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d256a1ce6df8fa049c8d67765ed7ba97df9e728a))
* Step for date range ([9cc88cd](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/9cc88cd4fc271277ba8e1b864343c58c6b037b5a))
* **createmove:** Fork person search type ([99de24d](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/99de24dbf85930d646fdb1d228ffe3f4da1a4fd2))
* **createmove:** Store from location type ([9a71722](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/9a7172282339385285711e2f542dd741da7f6149))
* step for the move agreed ([3069ae8](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/3069ae853c5f06b42512b1af8a9ffad1a2c4b14d))


### Bug Fixes

* Add created_at attribute to move model ([0fd5c69](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/0fd5c698374a472d39c6892f8d0db65cd5b44b64))
* Add fallback if role has no permissions ([d7a8d26](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d7a8d262d3c86230475af699d9725d40f5284182))
* Display search term correctly ([6cb9535](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/6cb95353ea1f481ed2a82c51c6d6ee1e0553f2fa))
* Ensure date field runs formatter ([a6841f1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/a6841f18efe57a87296672b292f1656b09a1add3))
* Prevent error when decoding an undefined access token ([8047e79](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/8047e79277f52f0111c2f4c5d0999e4dc97b7407))
* Prevent error when grant returns no response in auth ([733b2b5](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/733b2b5f59d4d0953025a52971137d91485195ed))
* Remove padding from text button style ([433f07f](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/433f07f208ce1ba59d8908dff47bf40f4d3e2f81))
* Set correct journey for prison to prison moves ([a3a099c](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/a3a099c5c031952b0041dfc9b300c15ce7067f02))
* Update key for search translation ([84dd4a4](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/84dd4a48657ac22f21d1fc8ecce04d4c553ceb9a))
* Update prison number key ([5fe7e8b](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/5fe7e8b009a64d3310dfe45b0716558df399ed0a))
* Update release status assessment question ([86b229f](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/86b229f8536169c9bbcede234ad921c574d4c95e))
* Update the e2e tests for prison moves ([c4214b1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/c4214b19fc26fe42d90a06ea67ff0833c8df96ad))
* **createmove:** Check implicit question length ([b7a0e11](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/b7a0e11c70acc23de7d0f48d21f6b88fe8b893aa))
* **createmove:** Ensure create base controller is the default controller ([d8b0cc7](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d8b0cc7a45f8e791bc25cdc8bdb434077a116d5c))
* **createmove:** Update e2e tests for special vehicle ([62a98aa](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/62a98aae6b2e612b9573d5985b37eb4b6967cb8b))

## [2.10.2](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.10.1...v2.10.2) (2020-02-06)

## [2.10.1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.10.0...v2.10.1) (2020-02-06)

## [2.10.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.9.0...v2.10.0) (2020-02-06)

## [2.9.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.8.1...v2.9.0) (2019-12-19)

## [2.8.1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.8.0...v2.8.1) (2019-11-05)

## [2.8.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.7.0...v2.8.0) (2019-11-04)

## [2.7.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.6.0...v2.7.0) (2019-10-28)

## [2.6.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.5.0...v2.6.0) (2019-10-15)

## [2.5.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.4.0...v2.5.0) (2019-10-14)

## [2.4.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.3.0...v2.4.0) (2019-10-07)

## [2.3.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.2.0...v2.3.0) (2019-09-26)

## [2.2.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.1.0...v2.2.0) (2019-09-18)

## [2.1.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.0.0...v2.1.0) (2019-09-11)

## [2.0.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v1.1.1...v2.0.0) (2019-08-28)

## [1.1.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v1.0.0...v1.1.0) (2019-08-15)

## [1.0.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/releases/tag/v1.0.0) (2019-07-30)
