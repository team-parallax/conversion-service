# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.11](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.10...v0.1.11) (2021-07-13)


### Others

* **sample-input:** add sample jpeg ([78bd54a](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/78bd54a2d621aed4b49dab3c33255669a8b19f88))

### [0.1.10](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.9...v0.1.10) (2021-07-13)


### Features

* **conversion-formats:** change formats route to return object ([1afde7d](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/1afde7df9fe2726f9eb997b25568f001b1a583d9)), closes [#53](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/53)


### Bug Fixes

* **.gitlab-ci.yml:** fix invalid ci definition ([0439f64](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/0439f64f0850b0049e2f40f63015143568156153))
* **conversion-service:** add return statement in controller ([bd1fed2](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/bd1fed23b1fcfc9ef79c575f828ea33c09577e14))
* **conversion-service-tests:** correct wrong mock function in test ([00c1e73](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/00c1e73736d11cff4ccb3f4e0a577dffb087b6ed))


### CI

* **prepare-stage:** move typecheck to prepare stage ([1dcb050](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/1dcb05045681eb692148050aef6cc7e6a7258391))


### Tests

* **conversion-queue, util:** add tests for queue and util-function ([2c84995](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/2c84995175a67d36eb4ffe6d556334fafdacaa50))


### Code Refactoring

* **conversion-service:** refactor function definition and add query parameter for api version ([38592ec](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/38592ece1832fb7b2a32affc371b7c41bad54791))
* **conversion-util:** add function to retrieve filename for converted file ([b5ecab0](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/b5ecab04f39f1e51317e8e2b62793f65c8a931e5)), closes [#54](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/54)

### [0.1.9](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.8...v0.1.9) (2021-07-08)


### Code Refactoring

* **conversion-service:** add logging to conversion-service ([931e78e](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/931e78e8d6dfc571d341b1c6a0313357dd8358df))

### [0.1.8](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.7...v0.1.8) (2021-07-08)


### Features

* **conversion-service:** add getAllSupportedConversionFormats to conversion-service ([39b9b91](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/39b9b91a4491d956021c8748ae0df37371b78424)), closes [#50](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/50)


### Others

* **docker-compose.yml:** add docker-compose file for development environment ([403d929](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/403d9291c46a6d82342d33b7263abe133e124514))
* **swagger.json:** update version in swagger file ([935c359](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/935c359d33be1f1127688aa9a04b67897adae7a1))


### Code Refactoring

* **conversion-controller:** remove unneccessary extension check in controller ([7136cc0](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/7136cc04b5b40891a582c683935f75a52f464fe4))

### [0.1.7](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.6...v0.1.7) (2021-07-06)


### Features

* **conversion-service:** add rule-dependent wrapper retrieval ([a4e938f](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/a4e938fcb030c742665b369521ba6623c8ed4752)), closes [#32](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/32) [#45](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/45)


### Bug Fixes

* **config.spec.ts:** remove unused import ([963bf0d](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/963bf0d702ff92351cd2ac2c11a4b0557e7f855c))
* **fileio.spec.ts:** remove unneeded, erroneous test case ([7829602](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/7829602bec3ce070693d75ceab23e71e559d5364))


### CI

* **test-stage:** add test:types to pipeline ([f5448f7](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/f5448f72df9bc70d427381f2cb6e556c2745fd48))


### Others

* **conversion-service:** add errors and error handling to conversion-service ([2f1e44e](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/2f1e44ec29aa3545e6f6154efb5d6c59198e1930)), closes [#28](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/28)
* **dependencies:** update dependencies ([a21c735](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/a21c73502dc6e8d8ee513000f374568f4ba75a18))
* **environment:** add simple image conversion rule to template.env ([8401bac](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/8401bacbe18298e0e37a5a55f852585141a2bc38))
* **quality-report:** update quality report ([89a8cc0](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/89a8cc05959ca341ced9f28a0e6d60e5618cbacb))
* **workflow:** add MR template for features ([7dbec7c](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/7dbec7cb0e5d690dc053688b6d38010284f5faba))


### Code Refactoring

* **abstract-service:** add call to changeConvLogEntry after successful converison ([f07e73a](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/f07e73a61fe50ea61a69eafd2aed1cd1490844a9))
* **code-consistency:** refactor all imports to be in consistent format ([0f0e642](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/0f0e6429b0308a2a5150958cee0b62f3049da692))
* **config:** refactor function ordering to be alphabetic ([023ec7a](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/023ec7a89769bb855a13649566c0d7cda5d9653b))
* **conversion-service:** refactor conversion service to implement all wrappers ([42c002f](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/42c002f45bd8faaea01add409ebd51a73fa038a7))
* **conversion-util:** extract interface transformation to own function ([5c4f6c2](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/5c4f6c2536c297675cdfb5488bf705334d190c77))
* **fileio.spec.ts:** add missing folder creation in test setup ([d956b5a](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/d956b5aa1132137d6ef56cb6aa00c3bec3be0e32))


### Tests

* **conversion-queue:** add test cases for conversion queue ([c662029](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/c662029c07cb639a9452b8bfe3c237eb8f0fc831))
* **conversion-service:** add conversion request processing testcase ([e950f86](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/e950f867364900dc263f2bdf5a4393137e20be78))
* **conversion-service:** add tests for conversion service code ([d713d68](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/d713d68143560746ca2debc5c0699d980070f391))
* **conversion-service:** add tests for conversion-service and unoconv-wrapper ([3afc39e](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/3afc39e8eb6df016a3a431ff527e0cca70858216))
* **conversion-service:** add tests for conversion-service as application ([3681227](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/3681227ac769e5b3a3def1389cf360ba9af58863))
* **conversion-util:** add test for conversion and util functions ([13362f5](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/13362f57ef4ba5cbb1df2ae8361181ceeabee0f4))
* **ffmpeg-wrapper:** add tests for ffmpeg-wrapper functions ([b1097f9](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/b1097f9311e301c440fbbc630c8c00e42071587e))
* **file-io:** add file-io tests, update ignore file ([5d1f0fd](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/5d1f0fd61a3f7b2bd9a29f8e8709661b1e659fcf))

### [0.1.6](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.5...v0.1.6) (2021-06-29)


### Features

* **imagemagick.ts:** add imagemagick wrapper and api ([3f96142](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/3f96142f0b72cc45617253a2a8fbe9cedf6693ee))


### Bug Fixes

* **.gitlab-ci.yml:** add folder creation for test stage ([1ecdb52](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/1ecdb5296a80dbef4769c8d0e9b69b099050af98))


### CI

* **.gitlab-ci.yml:** update ci base image for tests ([2a09310](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/2a09310ea1201709f739cb6f21ef82b46371560c))


### Code Refactoring

* **conversion-queue:** add better error if no path is given for a conversionId ([2b22d13](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/2b22d13079f91be578c1fe2defc2b7c89efa045b))
* **conversion-service:** add type aliases as replacement for interface arrays ([11aa80b](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/11aa80ba1749f3db9ba6a0f109ebf50ef45034ba))
* **conversion-service:** remove unused code(-comments) ([1ce7bc2](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/1ce7bc2e34d3076d3a49e5edda5026d4c26046a5))
* **unoconv.ts:** remove redundant inheritance ([b059254](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/b059254bafcb28711a1e7307112e6dae6c36da8f))


### Docs

* **readme:** remove blank linke ([6ea3583](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/6ea3583880a9d5366f7af6d1e75d7c57691e5c97))


### Tests

* **conversion-service:** add tests for uoconv-wrapper, imagemagick and -wrapper ([84e33eb](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/84e33eba3f7087748a4d31ceaa28bb1b4a3a02b1))
* **imagemagick.ts:** add test to convert images to pdf with ImageMagick ([0d50bd1](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/0d50bd19834dd0dbd2d94e247acf204694656854)), closes [#2](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/2)
* **imagemagickwrapper:** add tests for imagemagick wrapper ([3198c6e](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/3198c6e61271ca704cb1977e247ab759422fd007))


### Others

* **devcontainer.json:** remove unneccesary plugins ([3818a36](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/3818a365499e766f871f9603e547ea6154eb707c))
* **image-magick-formats.json:** add image-magick-formats.json ([1168e1e](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/1168e1e42b22e42c3ff2da5ef39f9fd02ff364ee))
* **mr-changes:** apply requested changes to mr ([4437b4b](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/4437b4b78da36697db4ceae7200f1d7fe571881a))
* **quality-report:** update quality report ([c8f0834](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/c8f0834725fae3954c890541bcc0f56e56a46c92))
* **quality-report:** update quality report ([02e5e43](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/02e5e43cb292c21684a58a2f189fcf034d550808))

### [0.1.5](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.4...v0.1.5) (2021-06-25)


### Docs

* **env-variables:** add webservice port and default information ([1397f0a](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/1397f0a40cfc452e4e93287107aefce9cb69a95e))


### Code Refactoring

* **project:** fix permissions on project ([3bbb1b8](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/3bbb1b860d684c1d405a059c3212688b7be3ae13))


### Others

* **quality-reports:** update quality report file ([485d00b](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/485d00b8819b4751ed25a77a31915a2fe75c56ba))


### [0.1.4](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.3...v0.1.4) (2021-06-23)


### Features

* **abstract-converter:** add abstract converter ([5921fde](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/5921fdedb50ca844c418d788359e4a7e8daae1e5))
* **ts-unoconv:** include ts-unoconv as binary-wrapper for unoconv conversions ([5bc8a79](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/5bc8a796aa605b289ad9fb4dd379562d709f0833)), closes [#1](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/1)


### Others

* **dockerfile:** add imagemagick to dockerfile ([d6c957d](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/d6c957d6e2c3d463b7a89b822af5cebf3c5443d4)), closes [#17](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/17)

### [0.1.3](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.2...v0.1.3) (2021-06-18)


### Features

* **init.ts:** add initializer, contributing-guide, tests ([7760765](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/77607654654c51e970ed45267344fcaa6db3bbaf)), closes [#16](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/16) [#20](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/20)


### CI

* **ci - release:** add automatic release creation to pipeline ([702b74d](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/702b74d2624cebad6f519d6292279865ac0c2c50)), closes [#4](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/4)


### Others

* **ci-configuration:** add prevention rule to avoid duplicate pipeline on MR ([62ed716](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/62ed716e081377ee50c8d6c6978ea7d2011d54db))
* **issue-templates:** add issue-templates for bug-reports and feature requests ([64c23a9](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/64c23a9e1b9b881cbf8bbe7653a00baddce56510)), closes [#19](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/19)
* **issue-templates:** update github issue template to contain frontmatter ([c14b461](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/c14b4618154989eea27c06c4fe78629ebbbafca0)), closes [#22](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/22) [#19](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/19)

### [0.1.3-1](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.3-0...v0.1.3-1) (2021-06-09)


### CI

* **ci-configuration:** add built-in branch-pipeline template and custom before_script for release ([9d7a128](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/9d7a1287e360d1014910a05596082fae5cd24bb1))

### [0.1.3-0](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.2...v0.1.3-0) (2021-06-09)


### Bug Fixes

* **ci-configuration:** add missing stages to pipeline definition ([c474716](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/c4747167f857c0fab1def3a8886afbf3dcb7ca05))


### Others

* **ci-configuration:** add prevention rule to avoid duplicate pipeline on MR ([62ed716](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/62ed716e081377ee50c8d6c6978ea7d2011d54db))


### CI

* **.gitlab-ci.yml:** change pipeline creation rules to prevent duplicate pipelines ([e752217](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/e752217c2509590861ff893e3983caffd558f33d))
* **ci - release:** add automatic release creation to pipeline ([2e9eb3c](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/2e9eb3c90ed94299afa9400246ba91740352b0ff)), closes [#4](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/4)

### [0.1.2](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.1...v0.1.2) (2021-06-08)


### CI

* **rules:** remove pipeline creation rules for test and linting as this should always run ([6b554d9](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/6b554d93e89ad6d723766aa8dbc82f099994b537))

### [0.1.1](https://gitlab.internal.team-parallax.com/belwue/conversion-service/compare/v0.1.0...v0.1.1) (2021-06-08)

## 0.1.0 (2021-06-08)


### Bug Fixes

* **package.json:** add missing script for tests with coverage ([f4c1046](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/f4c1046a6ea827f86fe9676e513df250a99b81b1))


### Docs

* **readme:** add table of contents and links for 'external' wrapper documentation ([f86df92](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/f86df924e4d0ab80f3814f16f5b0f7857e8488e5)), closes [#3](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/3)


### Others

* **.gitignore:** add .eslintcache to gitignore file ([d4407ce](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/d4407ce464de395cde4c4217f52b61ac7e403b94))
* **docker/ci:** update dockerfile to contain new base image ([a313872](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/a3138728f5cf9857415e23dd8af9fbd000713e28)), closes [#5](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/5) [#6](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/6)
* **ignore-files:** add .env files to ignore files for git and docker ([fc5478d](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/fc5478d4e7e80de687c7b3cc17b87f4ab5b44ead))
* **license:** add GNU GPLv3 or later license to project ([1246edf](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/1246edf6f43e60a6d9cb5191a2c7c8688de1a04f)), closes [#12](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/12)
* **package.json:** rename 'commit' script to 'git:commit' as it is the better description ([ae23b04](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/ae23b04a12434a9feb0c1ec25001f70545a73015))
* **project setup:** initalize Project with ffmpeg-service as project-base ([949afba](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/949afbadd2f66593234d884690e105a6b210034e))
* **project-config:** add lint-staged pre-commit hook ([2d8955f](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/2d8955fe633fc180ec9d44ae6386f8eb33bd7002)), closes [#13](https://gitlab.internal.team-parallax.com/belwue/conversion-service/issues/13)
* **project-configuration:** add .eslintignore and add todos in code ([ed27f55](https://gitlab.internal.team-parallax.com/belwue/conversion-service/commit/ed27f55935f45802caeff76b615bbd75f6c50dc1))
