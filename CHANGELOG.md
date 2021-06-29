# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
