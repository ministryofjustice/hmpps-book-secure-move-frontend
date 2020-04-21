# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.19.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.18.0...v2.19.0) (2020-04-21)


### Features

* Allow API cache to be controlled by environment variables ([9b7b55a](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/9b7b55a1517879743e0295b08cd318e2a385ff12))


### Bug Fixes

* Allow message component to be focusable ([fb13e84](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/fb13e843c99ca68a1a5959380c64dca7a504944d))
* Update consistency of "requested" language ([79336c9](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/79336c966cffcaa392edce386557d5b84494fac4))
* Use fallback config when creating Redis store ([cc9232a](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/cc9232abf11f024e269d8eff511391f9964d3b78))

## [2.18.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.17.0...v2.18.0) (2020-04-20)


### Features

* Add primary navigation menu ([b3c3eb4](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/b3c3eb4af3a18faeca2fbcbc20bcf86c882af78e))
* Dashboard for allocations ([0cfad86](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/0cfad861bffed31010c8bfea4ba39981a3a5894c))
* Route for the allocations dashboard ([ecdf0ca](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/ecdf0ca79aba347b33aa787f9a5360f8d42f974e))
* Service for the allocations (partial) ([dcbac67](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/dcbac67dac306228837328d930cda0d60ebb98b3))


### Bug Fixes

* Handle moves with no court hearings ([d16c7b6](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d16c7b6fc9aff3586b42e837d6dac3664a1c317e))
* Move saving of court hearing to end of create journey ([ce1c86e](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/ce1c86e8496b7e77984e4f946512d8713bdd71c7))

## [2.17.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.16.0...v2.17.0) (2020-04-16)


### Features

* Add message to confirmation screen for prison to court moves ([ae4a52c](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/ae4a52ccb33854fd899b74016769babafc183703))
* Create a new step for capturing case details ([dd55c3d](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/dd55c3d89db4073ad1424f4ddd1bb93adea898f7))
* Create permission move:create:prison_to_prison ([13ea5a9](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/13ea5a952869e4eb7cad57a942b7951531e91e92))
* Create status as proposed if to and from locations are both prison ([70851e5](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/70851e563350c74e8d52a6517c08d44a000e9bcb))
* Display court hearings on the move detail view ([7a980d0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/7a980d0ee30a78b756c0ce72dc546dec84fa1c01))
* Feature flag court hearing support ([852303b](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/852303b6b39a82e2eea256893d7e9f6204d0d3d7))
* **e2e:** Check assessment answers in end-to-end tests ([42115f8](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/42115f8a4aee468750d86316b0e4c33c40c38329))
* **e2e:** Fill in court, risk and health section in end-to-end tests ([458cb8d](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/458cb8d3f90f7693659b97c013316506f6dfe6ee))
* End to end tests for OCA journey ([603fb2f](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/603fb2ffa5f78f8792ac67bac82d32fcc764bf53))
* Journey for the OCA user ([f62e38d](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/f62e38d4e8f2efedeaf8361f1af353621cc4d29b))


### Bug Fixes

* Adjust spacing of card nested within radio/checkbox list ([cb24dfa](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/cb24dfa5488ba88304d9c420000cce816198e8fb))
* Correct model and tests for documents entity ([955ffe0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/955ffe09b0945129ef70240928d07c113c2f7e62))
* Ensure court information is only displayed when appropriate ([2fdd719](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/2fdd7193786bf434cfdf114a273c4c4ab3505017))
* Ensure names that contain special characters don't escape ([dbfd40d](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/dbfd40d2d8dd032e99ffd8d3734c5ac473be5127))
* Fix broken e2e test ([16fd465](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/16fd465ccfd577578efb3709a969d3f423d951f6))
* Make govuk radios display block ([e4e0b4c](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/e4e0b4c21f2f939de0640c55b10372ac4949124f))
* **e2e:** Add support for missing person identifiers ([7b587a3](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/7b587a39013f210e26527474c373d24925317870))
* **e2e:** Handle case where no moves are in the download ([dbfa598](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/dbfa59840e4c4a6a70302243de59adb340042039))
* Text for proposed moves confirmation page ([20adbef](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/20adbef49adaa7e85f1c361d4b78002ca23fd1aa))

## [2.16.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.15.1...v2.16.0) (2020-04-06)


### Features

* Dashboard for the OCA journey ([8af537c](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/8af537cd795e155e68792e73bc845a0af5e0036a))
* Move landing page to correct url ([e78ae77](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/e78ae772be9d2fc2c0a62ab67f3656076aae5695))
* Presentation of dashboard filters ([6e32f42](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/6e32f4207db7cede03972ef1faee6ce883e0471a))
* Show this week for the date range ([0f16ab1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/0f16ab11e2f121b6c82e9b5563c9307a944eae54))


### Bug Fixes

* Ensure all shared field configs are a deep copy ([73cd1d5](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/73cd1d5fabde494ee7a0ed98230f7cce2b0cb6b4))
* Ensure person formatter doesn't send empty identifiers ([80c6dbe](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/80c6dbe6feea7a8be6d81d8a103f185fa0992422))
* Prevent field helper mutating properties ([e3a8069](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/e3a806963c5885fd40af61f022c2f74068a491ac))
* Visually hide date fieldset legend ([938635b](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/938635bf78e6e393767214ac691918c8f2e22d6b))

### [2.15.1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.15.0...v2.15.1) (2020-04-02)


### Bug Fixes

* Ensure content-type is defined before checking it ([9b206e3](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/9b206e396fb1bd5daa2c51662121810a6db7921c))

## [2.15.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.14.3...v2.15.0) (2020-03-31)


### Features

* Add e2e smoke tests for Prison users ([f456d87](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/f456d8733452ecba14f84e08a7655fb9b7639291))
* Add end-to-end tests for Prison to Court journeys ([74da7c2](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/74da7c26924cb04ba779a201e99da4b28480bd08))
* Add has_date_to field to the date page ([3f14804](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/3f148042d33e4bfc8e1a00a6ab62527ab698aea3))
* Add redirection according to location type ([d44c45a](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d44c45a96837abd8806b8022615d45a014066e3f))
* Link give us feedback ([d5c484d](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d5c484d6957c6be911eeb2924d9ecdce58879a9d))
* Navigation for multiple types of moves ([8ffa844](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/8ffa844cc71bb6f6d37206057c7ff8bce160ecbf))
* Primary navigation with link to the dashboard ([441e837](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/441e8374f47a8bf569dd0c3073df6ae00b81fa9b))
* Split date from move details ([99e9665](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/99e96655de1be627ce9f2320b1167c7d707fee7e))
* Tests ([d914192](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d9141929002a34231aa342ef523356c371f10160))
* Use supplier name in confirmation message ([3acf7a9](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/3acf7a977e3b89e9fc2a7680713f6190fed704de))


### Bug Fixes

* [P4-1041] Extend service timeout ([be9e963](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/be9e96387bd41e86fc3d41ed91b5452854f2c476))
* Add missing test file and make requested tweaks ([e959006](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/e959006326b2468cd039eeb87a955db7e8684e90))
* Allow size of uploaded files to be up to that specified in config ([95f11ff](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/95f11ff65a2555e277a38b1fa0a352fe3c65d1c2))
* Check meta items in person to card presenter ([c7d12ba](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/c7d12bacd0c797c38eca4de27f6bec85717d4ff1))
* Ensure form submit button has correct type ([5dd9841](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/5dd9841fc46cfff48eedd44ddbfb244e54ceb8c3))
* Ensure the date range step only applies to prison to prison ([3e97060](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/3e97060d4ef1a748820b7a42ff33c4f01ed87cae))
* Fix broken unit test ([0b35f16](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/0b35f16d4c6d9b3bb8447f76906512e8fe621bd5))
* Make changes requested in pr401 review ([f5f6761](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/f5f67611462b54b74d7c80e3480cc433c9f2078a))
* Navigation displays wrong label ([f8fa010](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/f8fa01059dc87cc1c40ede1b351034ce611f7157))
* Prevent garbled upload error being displayed ([8ae1313](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/8ae13136c76e862f847d9e3fa25006a99ddb379d))
* Remove null and undefined from Person formatter ([dd68617](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/dd686175d342dad914677f6274a403516ffaf2fc))
* Update end-to-end tests to cater for separate date step ([fb5c681](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/fb5c681acf175f5fa2b47c7c379b669e26bc7c5e))
* Use selector to populate autocomplete fields ([dcee06b](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/dcee06bdc48f8d8695288ea0c751e53ceed974bb))

### [2.14.3](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.14.2...v2.14.3) (2020-03-23)

### [2.14.2](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.14.1...v2.14.2) (2020-03-18)


### Bug Fixes

* Add support to define keys to show for previous assessment ([096df80](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/096df80f5406eb64fbbeb754af574f184c4d57c4))

### [2.14.1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.14.0...v2.14.1) (2020-03-18)


### Bug Fixes

* Add back missing translation ([4bdf6db](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/4bdf6db344937da46fce6abc47928988646116b4))

## [2.14.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.13.0...v2.14.0) (2020-03-18)


### Features

* Add support for images in person search results ([cee9e42](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/cee9e42a427f5f5c32c381c3a98bb277a0be82b2))


### Bug Fixes

* Unescape search term in person search results ([d8b4b8f](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d8b4b8f35e5ff51a00bcc55c6fcc40bfa9262c25))
* Update card component ([6bc8ccc](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/6bc8ccc20c3b4edb6fd3283ff90d8239c99fad6b))
* Update text for incorrect NOMIS information ([5ebae5c](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/5ebae5c9c9ae1270d384ad60c65f698a704172fe))

## [2.13.0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.12.1...v2.13.0) (2020-03-12)


### Features

* Allow previous assessments to be sent to API ([f77495d](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/f77495db689bae23be31ce0cbe756e442fac927d))
* Date range in moves ([3cbb2cf](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/3cbb2cf082306408e44a5d870eef538cb9d181ec))
* Replay a previous assessment during the create journey ([2eba169](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/2eba16940ec87c0464b12849b4ee6d3386b669c5))
* View per week in the dashboard ([53e69a0](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/53e69a0e76e441d7e855083098cbc6bf218a9320))


### Bug Fixes

* Today date in pagination is to be current date, not the base date ([fe95bdf](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/fe95bdfd6781a3979a41a08ae59bbe48d7b0976c))
* Update default template for create wizard ([d73e314](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/d73e314e280f66efb4e272617fe18c86ec06da6c))

### [2.12.1](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/compare/v2.12.0...v2.12.1) (2020-03-05)


### Bug Fixes

* Ensure the code is checked out before running the GitHub release ([4cc3690](https://github.com/ministryofjustice/hmpps-book-secure-move-frontend/commit/4cc36900ee2a46c111088de43de470576a1f9d59))

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
