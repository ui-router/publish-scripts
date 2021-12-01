# 2.6.0 (2021-12-01)
[Compare `@uirouter/publish-scripts` versions 2.5.5 and 2.6.0](https://github.com/ui-router/publish-scripts/compare/2.5.5...2.6.0)


---


### Updated `check-peer-dependencies` from 4.0.0 to 4.1.0


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 4.0.0 and 4.1.0](https://github.com/christopherthielen/check-peer-dependencies/compare/4.0.0...4.1.0)

### Bug Fixes

* Install peer deps as devDependencies if the peer dep came from a dev dependency ([6ef3021](https://github.com/christopherthielen/check-peer-dependencies/commit/6ef3021)), closes [#21](https://github.com/christopherthielen/check-peer-dependencies/issues/21)


### Features

* Add support for ignoring peer dependencies (via cli option or config stored in package.json) ([5994c9c](https://github.com/christopherthielen/check-peer-dependencies/commit/5994c9c))
* load checkPeerDependencies config from package.json (and merge with CLI options) ([e2f0fee](https://github.com/christopherthielen/check-peer-dependencies/commit/e2f0fee))

## 2.5.5 (2020-12-27)
[Compare `@uirouter/publish-scripts` versions 2.5.4 and 2.5.5](https://github.com/ui-router/publish-scripts/compare/2.5.4...2.5.5)


---


### Updated `check-peer-dependencies` from 2.0.6 to 4.0.0


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 2.0.6 and 4.0.0](https://github.com/christopherthielen/check-peer-dependencies/compare/2.0.6...4.0.0)

### Features

* **findSolutions:** Add a toggle to find solutions and print installation commands. ([c34735a](https://github.com/christopherthielen/check-peer-dependencies/commit/c34735a))
* **orderBy:** Change default orderBy to 'dependee' ([e77e069](https://github.com/christopherthielen/check-peer-dependencies/commit/e77e069))
* **peerDependencyMeta:** support peerDependencyMeta in package.json to ignore optional peer dependencies ([4e3b757](https://github.com/christopherthielen/check-peer-dependencies/commit/4e3b757))
* **prerelease:** include prerelease when  matching ranges, i.e. the range ">=6.0.0" matches "7.0.0-beta.1" ([0493379](https://github.com/christopherthielen/check-peer-dependencies/commit/0493379))
* **report:** For a given unmet peer dependency, show every related peer dependency, even if currently met ([516a259](https://github.com/christopherthielen/check-peer-dependencies/commit/516a259))


### BREAKING CHANGES

* **prerelease:** Matches prerelease versions
* **orderBy:** default order changed from 'depender' to 'dependee'
* **findSolutions:** no longer prints installation commands by default, instead prints a message about using --install

## 2.5.4 (2020-09-20)
[Compare `@uirouter/publish-scripts` versions 2.5.3 and 2.5.4](https://github.com/ui-router/publish-scripts/compare/2.5.3...2.5.4)


---


### Updated `check-peer-dependencies` from 2.0.2 to 2.0.6


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 2.0.2 and 2.0.6](https://github.com/christopherthielen/check-peer-dependencies/compare/2.0.2...2.0.6)

### Bug Fixes

* fix type error ([d117ef7](https://github.com/christopherthielen/check-peer-dependencies/commit/d117ef7))
* Ignore missing optionalDependencies ([25a89a7](https://github.com/christopherthielen/check-peer-dependencies/commit/25a89a7))
* print warning if dependency path is not found ([37c0296](https://github.com/christopherthielen/check-peer-dependencies/commit/37c0296))


### Features

* Add an option to run tool in consumer package root dependencies only.  ([#7](https://github.com/christopherthielen/check-peer-dependencies/issues/7)) ([cd8f75a](https://github.com/christopherthielen/check-peer-dependencies/commit/cd8f75a))

## 2.5.3 (2020-07-20)
[Compare `@uirouter/publish-scripts` versions 2.5.2 and 2.5.3](https://github.com/ui-router/publish-scripts/compare/2.5.2...2.5.3)

### Bug Fixes

* Do not run docker with -it, maybe it works in github actions? ([7ef06bc](https://github.com/ui-router/publish-scripts/commit/7ef06bc))

## 2.5.2 (2020-07-20)
[Compare `@uirouter/publish-scripts` versions 2.5.1 and 2.5.2](https://github.com/ui-router/publish-scripts/compare/2.5.1...2.5.2)

### Bug Fixes

* **docgen:** delete the *correct* includes directory after generating docs ([7844255](https://github.com/ui-router/publish-scripts/commit/7844255))


### Features

* **docker_push:** tag a version with the current package version ([80d7b3c](https://github.com/ui-router/publish-scripts/commit/80d7b3c))

## 2.5.1 (2020-07-20)
[Compare `@uirouter/publish-scripts` versions 2.5.0 and 2.5.1](https://github.com/ui-router/publish-scripts/compare/2.5.0...2.5.1)

### Bug Fixes

* **docgen:** delete the includes directory after generating docs ([7a8da38](https://github.com/ui-router/publish-scripts/commit/7a8da38))

# 2.5.0 (2020-07-18)
[Compare `@uirouter/publish-scripts` versions 2.4.3 and 2.5.0](https://github.com/ui-router/publish-scripts/compare/2.4.3...2.5.0)

### Features

* **docgen** Read docgen config from package.json
* **docgen:** Create a docker image uirouter:docgen which generates docs so projects do not need a direct dependency on typedoc ([bd52998](https://github.com/ui-router/publish-scripts/commit/bd52998))

## 2.4.3 (2020-06-06)
[Compare `@uirouter/publish-scripts` versions 2.4.2 and 2.4.3](https://github.com/ui-router/publish-scripts/compare/2.4.2...2.4.3)

### Bug Fixes

* **release+downstream:** call 'npm runbuild' for projects that have a distDir ([d39f693](https://github.com/ui-router/publish-scripts/commit/d39f693))

## 2.4.2 (2020-06-06)
[Compare `@uirouter/publish-scripts` versions 2.4.1 and 2.4.2](https://github.com/ui-router/publish-scripts/compare/2.4.1...2.4.2)

### Bug Fixes

* **generate_docs:** Replace "Globals" with {{name}} in breadcrumbs. ([7f723a9](https://github.com/ui-router/publish-scripts/commit/7f723a9))

## 2.4.1 (2020-06-05)
[Compare `@uirouter/publish-scripts` versions 2.4.0 and 2.4.1](https://github.com/ui-router/publish-scripts/compare/2.4.0...2.4.1)

### Bug Fixes

* **generate_docs:** Support 'branch' configuration in docgen.json for included repos ([1f715dd](https://github.com/ui-router/publish-scripts/commit/1f715dd))

# 2.4.0 (2020-06-05)
[Compare `@uirouter/publish-scripts` versions 2.3.49 and 2.4.0](https://github.com/ui-router/publish-scripts/compare/2.3.49...2.4.0)

### Features

* Improve generate_docs ([e41798b](https://github.com/ui-router/publish-scripts/commit/e41798b))

## 2.3.49 (2020-05-25)
[Compare `@uirouter/publish-scripts` versions 2.3.48 and 2.3.49](https://github.com/ui-router/publish-scripts/compare/2.3.48...2.3.49)

### Features

* **generate_docs:** Generate docs from the current directory, and without using symlinks for node_modules ([3661919](https://github.com/ui-router/publish-scripts/commit/3661919))
* **publish_yalc_package:** Do not double build (rely on yalc publish calling prepublishOnly script) ([75ce2fe](https://github.com/ui-router/publish-scripts/commit/75ce2fe))
* **test_downstream_projects:** support testing of branches.  Do not revert changes after running tests to improve debugging of failed runs ([a35785f](https://github.com/ui-router/publish-scripts/commit/a35785f))


---


### Updated `check-peer-dependencies` from 2.0.1 to 2.0.2


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 2.0.1 and 2.0.2](https://github.com/christopherthielen/check-peer-dependencies/compare/2.0.1...2.0.2)

### Bug Fixes

* **peerDevDependencies:** Make peerDevDependency includes check a bit safer ([2a1a183](https://github.com/christopherthielen/check-peer-dependencies/commit/2a1a183))
* **walkPackageDependency:** only walk dev deps for the root package ([e69c385](https://github.com/christopherthielen/check-peer-dependencies/commit/e69c385))


### Features

* **walkPackageDependencyTree:** Check devDependencies too ([9eba197](https://github.com/christopherthielen/check-peer-dependencies/commit/9eba197))

## 2.3.48 (2020-05-18)
[Compare `@uirouter/publish-scripts` versions 2.3.47 and 2.3.48](https://github.com/ui-router/publish-scripts/compare/2.3.47...2.3.48)

### Features

* **test_downstream_projects:** add branch selection support for downstream git repositories ([6017917](https://github.com/ui-router/publish-scripts/commit/6017917))
* **upgrade.js:** Encode newlines in the upgrades output ([4b196ba](https://github.com/ui-router/publish-scripts/commit/4b196ba))

## 2.3.47 (2020-05-08)
[Compare `@uirouter/publish-scripts` versions 2.3.46 and 2.3.47](https://github.com/ui-router/publish-scripts/compare/2.3.46...2.3.47)

### Features

* **upgrade:** add upgrade-count and upgrade-strategy outputs ([7b79bd2](https://github.com/ui-router/publish-scripts/commit/7b79bd2))
* **upgrade:** add upgrade-count and upgrade-strategy outputs ([d8e94aa](https://github.com/ui-router/publish-scripts/commit/d8e94aa))


---


### Updated `check-peer-dependencies` from 1.0.10 to 2.0.1


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 1.0.10 and 2.0.1](https://github.com/christopherthielen/check-peer-dependencies/compare/1.0.10...2.0.1)

### Bug Fixes

* **peerDevDependencies:** Use an array of package names in 'peerDevDependencies' in conjunction with the standard 'peerDependencies' object to install peer deps as devDependencies. ([681a80b](https://github.com/christopherthielen/check-peer-dependencies/commit/681a80b))


### Features

* **check-peer-dependencies-optional-dependency:** Added a workaround for yarn swallowing postinstall script output ([a9c9fdf](https://github.com/christopherthielen/check-peer-dependencies/commit/a9c9fdf))
* **peerDevDependencies:** Add support for 'peerDevDependencies' -- 'peerDependencies' that should be installed as 'devDependencies' ([47d40ef](https://github.com/christopherthielen/check-peer-dependencies/commit/47d40ef))

## 2.3.46 (2020-04-30)
[Compare `@uirouter/publish-scripts` versions 2.3.45 and 2.3.46](https://github.com/ui-router/publish-scripts/compare/2.3.45...2.3.46)

### Bug Fixes

* **test_downstream_projects:** When supplying --group to test_downstream_projects, only apply the --group to the top level project.  However, parse all downstream_projects.json with group support. ([4aeac16](https://github.com/ui-router/publish-scripts/commit/4aeac16))


### Features

* **upgrade:** Create a github action to yarn upgrade ([1c8680f](https://github.com/ui-router/publish-scripts/commit/1c8680f))

## 2.3.45 (2020-03-04)
[Compare `@uirouter/publish-scripts` versions 2.3.44 and 2.3.45](https://github.com/ui-router/publish-scripts/compare/2.3.44...2.3.45)

### Features

* support typedoc.json and tsconfig.typedoc.json. upgrade to latest deps ([b80c285](https://github.com/ui-router/publish-scripts/commit/b80c285))


---


### Updated `check-peer-dependencies` from 1.0.8 to 1.0.10


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 1.0.8 and 1.0.10](https://github.com/christopherthielen/check-peer-dependencies/compare/1.0.8...1.0.10)

### Features

* **debug:** Added a --debug cli flag ([862232e](https://github.com/christopherthielen/check-peer-dependencies/commit/862232e))
* **orderBy:** Added a --orderBy cli flag ([9e7b8af](https://github.com/christopherthielen/check-peer-dependencies/commit/9e7b8af))
* **verbose:** Turn off verbose logging by default ([04cde8a](https://github.com/christopherthielen/check-peer-dependencies/commit/04cde8a))

## 2.3.44 (2019-12-27)
[Compare `@uirouter/publish-scripts` versions 2.3.43 and 2.3.44](https://github.com/ui-router/publish-scripts/compare/2.3.43...2.3.44)

### Bug Fixes

* **test_downstream_projects:** push the full name to the success log (not just the project key to the success log. ([8cd2585](https://github.com/ui-router/publish-scripts/commit/8cd2585))

## 2.3.43 (2019-12-27)
[Compare `@uirouter/publish-scripts` versions 2.3.42 and 2.3.43](https://github.com/ui-router/publish-scripts/compare/2.3.42...2.3.43)

### Features

* **ci:** create a dockerfile for running uirouter ci ([37cdcb0](https://github.com/ui-router/publish-scripts/commit/37cdcb0))
* **gha:** Add support for collapsing of output when run in Github Actions ([89d50e0](https://github.com/ui-router/publish-scripts/commit/89d50e0))
* **test_downstrem_projects:** add support for grouping downstream projects in the config file ([d9201a1](https://github.com/ui-router/publish-scripts/commit/d9201a1))
* **test_downstrem_projects:** Print out a summary of success/failed/skipped downstream tests at the end ([e9847e8](https://github.com/ui-router/publish-scripts/commit/e9847e8))


---


### Updated `check-peer-dependencies` from 1.0.7 to 1.0.8


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 1.0.7 and 1.0.8](https://github.com/christopherthielen/check-peer-dependencies/compare/1.0.7...1.0.8)

### Bug Fixes

* Revert fix for breaking change in resolve package after they reverted the breaking change itself. ([d25c43a](https://github.com/christopherthielen/check-peer-dependencies/commit/d25c43a))

## 2.3.42 (2019-12-08)
[Compare `@uirouter/publish-scripts` versions 2.3.41 and 2.3.42](https://github.com/ui-router/publish-scripts/compare/2.3.41...2.3.42)

### Bug Fixes

* **test_downstream_projects:** read nested config projects correctly when projects property is defined inside downstream_projects.json config ([ef80552](https://github.com/ui-router/publish-scripts/commit/ef80552))

## 2.3.41 (2019-11-25)
[Compare `@uirouter/publish-scripts` versions 2.3.40 and 2.3.41](https://github.com/ui-router/publish-scripts/compare/2.3.40...2.3.41)

### Bug Fixes

* **publish:** Fix running of prepublishOnly script before publishing a package with a distDir ([d6e7114](https://github.com/ui-router/publish-scripts/commit/d6e7114))

## 2.3.40 (2019-11-25)
[Compare `@uirouter/publish-scripts` versions 2.3.39 and 2.3.40](https://github.com/ui-router/publish-scripts/compare/2.3.39...2.3.40)


---


### Updated `check-peer-dependencies` from 1.0.6 to 1.0.7


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 1.0.6 and 1.0.7](https://github.com/christopherthielen/check-peer-dependencies/compare/1.0.6...1.0.7)

### Bug Fixes

* Update packageFilter for breaking change in resolve package ([15ade47](https://github.com/christopherthielen/check-peer-dependencies/commit/15ade47))

## 2.3.39 (2019-11-25)
[Compare `@uirouter/publish-scripts` versions 2.3.38 and 2.3.39](https://github.com/ui-router/publish-scripts/compare/2.3.38...2.3.39)

### Features

* **publish:** If a distDir is found in package.json, run prepublishOnly script from the root directory before publishing to NPM ([63ded3f](https://github.com/ui-router/publish-scripts/commit/63ded3f))


---


### Updated `check-peer-dependencies` from 1.0.5 to 1.0.6


Changelog for `check-peer-dependencies`:


[Compare `check-peer-dependencies` versions 1.0.5 and 1.0.6](https://github.com/christopherthielen/check-peer-dependencies/compare/1.0.5...1.0.6)

### Features

* sort peer dependencies by depender package name first ([3d656a6](https://github.com/christopherthielen/check-peer-dependencies/commit/3d656a6))
* when recursively installing peer deps, don't re-process previously unmet peer deps ([ce9fe3e](https://github.com/christopherthielen/check-peer-dependencies/commit/ce9fe3e))

## 2.3.38 (2019-11-24)
[Compare `@uirouter/publish-scripts` versions 2.3.37 and 2.3.38](https://github.com/ui-router/publish-scripts/compare/2.3.37...2.3.38)


Update upstream lib to resolve security vulnerability

## 2.3.37 (2019-10-26)
[Compare `@uirouter/publish-scripts` versions 2.3.36 and 2.3.37](https://github.com/ui-router/publish-scripts/compare/2.3.36...2.3.37)



## 2.3.36 (2019-10-26)
[Compare `@uirouter/publish-scripts` versions 2.3.35 and 2.3.36](https://github.com/ui-router/publish-scripts/compare/2.3.35...2.3.36)

### Features

* update to check-peer-dependencies 1.0.3 ([24ac975](https://github.com/ui-router/publish-scripts/commit/24ac975))




## 2.3.35 (2019-10-15)
[Compare `@uirouter/publish-scripts` versions 2.3.34 and 2.3.35](https://github.com/ui-router/publish-scripts/compare/2.3.34...2.3.35)

refactor: Delete check_peer_dependencies.js in favor of using check-peer-dependencies npm package


## 2.3.34 (2019-10-09)
[Compare `@uirouter/publish-scripts` versions 2.3.33 and 2.3.34](https://github.com/ui-router/publish-scripts/compare/2.3.33...2.3.34)

### Bug Fixes

* **check_peer_dependencies:** use node module resolution to find dependencies ([6c9cc3e](https://github.com/ui-router/publish-scripts/commit/6c9cc3e))


### Features

* **check_peer_dependencies:** don't require --yarn or --npm command line, infer it from package-lock.json or yarn.lock ([295b83f](https://github.com/ui-router/publish-scripts/commit/295b83f))




## 2.3.33 (2019-10-08)
[Compare `@uirouter/publish-scripts` versions 2.3.32 and 2.3.33](https://github.com/ui-router/publish-scripts/compare/2.3.32...2.3.33)

### Bug Fixes

* **release:** After 'git commit', then run 'git add' in case Prettier formatted them ([28fe683](https://github.com/ui-router/publish-scripts/commit/28fe683))




## 2.3.32 (2019-10-07)
[Compare `@uirouter/publish-scripts` versions 2.3.31 and 2.3.32](https://github.com/ui-router/publish-scripts/compare/2.3.31...2.3.32)

### Bug Fixes

* **publish_yalc_package:** move pkgJson parsing out of conditional block ([1d4bb2d](https://github.com/ui-router/publish-scripts/commit/1d4bb2d))




## 2.3.31 (2019-10-07)
[Compare `@uirouter/publish-scripts` versions 2.3.30 and 2.3.31](https://github.com/ui-router/publish-scripts/compare/2.3.30...2.3.31)

### Bug Fixes

* **check_peer_dependencies:** fix typo :facepalm: ([110048f](https://github.com/ui-router/publish-scripts/commit/110048f))




## 2.3.30 (2019-10-06)
[Compare `@uirouter/publish-scripts` versions 2.3.29 and 2.3.30](https://github.com/ui-router/publish-scripts/compare/2.3.29...2.3.30)

### Bug Fixes

* **check_peer_dependencies:** fix logging when a peerdep solution has been found ([f03bc04](https://github.com/ui-router/publish-scripts/commit/f03bc04))


### Features

* **check_peer_dependencies:** Added a script which checks that all peer dependencies are satisfied ([63e6c97](https://github.com/ui-router/publish-scripts/commit/63e6c97))
* **check_peer_dependencies:** when checking peer deps, ignore package if it's been installed using yalc ([fc62d5b](https://github.com/ui-router/publish-scripts/commit/fc62d5b))
* **test_downstream_projects:** Install peer dependencies in downstream projects ([153c024](https://github.com/ui-router/publish-scripts/commit/153c024))




## 2.3.29 (2019-10-06)
[Compare `@uirouter/publish-scripts` versions 2.3.28 and 2.3.29](https://github.com/ui-router/publish-scripts/compare/2.3.28...2.3.29)

### Bug Fixes

* **publish:** fix logic for getting the package distDir ([cea3c04](https://github.com/ui-router/publish-scripts/commit/cea3c04))




## 2.3.28 (2019-10-04)
[Compare `@uirouter/publish-scripts` versions 2.3.27 and 2.3.28](https://github.com/ui-router/publish-scripts/compare/2.3.27...2.3.28)

### Features

* **publish:** support package publishing from a subdirectory ([b609066](https://github.com/ui-router/publish-scripts/commit/b609066))
* **release:** put correct changelog on clipboard ([3ffa4b4](https://github.com/ui-router/publish-scripts/commit/3ffa4b4))
* **show_changelog:** Put an -HR- between changelogs for upstream projects ([8d10df0](https://github.com/ui-router/publish-scripts/commit/8d10df0))




## 2.3.27 (2019-10-02)
[Compare `@uirouter/publish-scripts` versions 2.3.26 and 2.3.27](https://github.com/ui-router/publish-scripts/compare/2.3.26...2.3.27)

### Features

* **release:** Write changelog to a temp file so it can be edited while the release script is paused ([9cce8fd](https://github.com/ui-router/publish-scripts/commit/9cce8fd))




## 2.3.26 (2019-09-03)
[Compare `@uirouter/publish-scripts` versions 2.3.25 and 2.3.26](https://github.com/ui-router/publish-scripts/compare/2.3.25...2.3.26)

### Features

* **package): (package:** update dependencies conventional-changelog[@3](https://github.com/3).1.10, git-semver-tags[@3](https://github.com/3).0.0, lodash[@4](https://github.com/4).17.15, open[@6](https://github.com/6).4.0, readline-sync[@1](https://github.com/1).4.10, tmp[@0](https://github.com/0).1.0, typedoc[@0](https://github.com/0).15.0, typedoc-plugin-external-module-name[@2](https://github.com/2).1.0, typedoc-plugin-internal-external[@2](https://github.com/2).0.2, yalc[@1](https://github.com/1).0.0-pre.34, yargs[@14](https://github.com/14).0.0 ([b0cc01e](https://github.com/ui-router/publish-scripts/commit/b0cc01e))




## 2.3.25 (2019-01-17)
[Compare `@uirouter/publish-scripts` versions 2.3.24 and 2.3.25](https://github.com/ui-router/publish-scripts/compare/2.3.24...2.3.25)



## 2.3.24 (2019-01-09)
[Compare `@uirouter/publish-scripts` versions 2.3.23 and 2.3.24](https://github.com/ui-router/publish-scripts/compare/2.3.23...2.3.24)

### Bug Fixes

* **test_downstream_projects:** Fix for packages with only dependencies or devDependencies block ([93bf0aa](https://github.com/ui-router/publish-scripts/commit/93bf0aa))




## 2.3.23 (2019-01-09)
[Compare `@uirouter/publish-scripts` versions 2.3.22 and 2.3.23](https://github.com/ui-router/publish-scripts/compare/2.3.22...2.3.23)

### Bug Fixes

* **test_downstream_projects:** hopefully fix travis folding by not emitting whitespaces ([0a9c74f](https://github.com/ui-router/publish-scripts/commit/0a9c74f))




## 2.3.22 (2019-01-09)
[Compare `@uirouter/publish-scripts` versions 2.3.21 and 2.3.22](https://github.com/ui-router/publish-scripts/compare/2.3.21...2.3.22)

### Features

* **test:downstream:** Support folding of output in travis ci ([66bd430](https://github.com/ui-router/publish-scripts/commit/66bd430))




## 2.3.21 (2018-09-15)
[Compare `@uirouter/publish-scripts` versions 2.3.20 and 2.3.21](https://github.com/ui-router/publish-scripts/compare/2.3.20...2.3.21)



## 2.3.20 (2018-07-17)
[Compare `@uirouter/publish-scripts` versions 2.3.19 and 2.3.20](https://github.com/ui-router/publish-scripts/compare/2.3.19...2.3.20)



## 2.3.19 (2018-07-06)
[Compare `@uirouter/publish-scripts` versions 2.3.18 and 2.3.19](https://github.com/ui-router/publish-scripts/compare/2.3.18...2.3.19)



## 2.3.18 (2018-05-13)
[Compare `@uirouter/publish-scripts` versions 2.3.17 and 2.3.18](https://github.com/ui-router/publish-scripts/compare/2.3.17...2.3.18)

### Bug Fixes

* **test_downstream_projects:** Fix testing multiple levels of yalc'd packages by deyalcing the package.json before yalc publish. ([dc83c7c](https://github.com/ui-router/publish-scripts/commit/dc83c7c))




## 2.3.17 (2018-05-09)
[Compare `@uirouter/publish-scripts` versions 2.3.16 and 2.3.17](https://github.com/ui-router/publish-scripts/compare/2.3.16...2.3.17)

### Bug Fixes

* **test_downstream_projects:** Use yarn resolution rules to avoid duplicate dependencies of UPSTREAM_PKGS installed via yalc ([0e8891c](https://github.com/ui-router/publish-scripts/commit/0e8891c))




## 2.3.16 (2018-05-09)
[Compare `@uirouter/publish-scripts` versions 2.3.15 and 2.3.16](https://github.com/ui-router/publish-scripts/compare/2.3.15...2.3.16)



## 2.3.15 (2018-05-09)
[Compare `@uirouter/publish-scripts` versions 2.3.14 and 2.3.15](https://github.com/ui-router/publish-scripts/compare/2.3.14...2.3.15)

### Bug Fixes

* **generate_docs:** Load lib.es6.d.ts from either typescript/lib or typedoc/node_modules/typescript/lib, whichever is found ([fd63486](https://github.com/ui-router/publish-scripts/commit/fd63486))




## 2.3.14 (2018-05-09)
[Compare `@uirouter/publish-scripts` versions 2.3.13 and 2.3.14](https://github.com/ui-router/publish-scripts/compare/2.3.13...2.3.14)

### Bug Fixes

* **test_downstream_projects:** run 'yarn' after installing upstreams to get updated upstream dependencies ([9c711ee](https://github.com/ui-router/publish-scripts/commit/9c711ee))




## 2.3.13 (2018-05-03)
[Compare `@uirouter/publish-scripts` versions 2.3.12 and 2.3.13](https://github.com/ui-router/publish-scripts/compare/2.3.12...2.3.13)

### Bug Fixes

* **generate_docs:** don't symlink included projects. clone directly to temp dir ([506dbbf](https://github.com/ui-router/publish-scripts/commit/506dbbf))




## 2.3.12 (2018-04-29)
[Compare `@uirouter/publish-scripts` versions 2.3.11 and 2.3.12](https://github.com/ui-router/publish-scripts/compare/2.3.11...2.3.12)

### Bug Fixes

* **test_downstream_projects:** Do not 'yarn upgrade' downstream projects ([05ec93b](https://github.com/ui-router/publish-scripts/commit/05ec93b))




## 2.3.11 (2018-04-21)
[Compare `@uirouter/publish-scripts` versions 2.3.10 and 2.3.11](https://github.com/ui-router/publish-scripts/compare/2.3.10...2.3.11)

### Bug Fixes

* **generate_docs:** fix travis: support yalc versions by matching and stripping the '-ha5hcod3' suffix ([2e9d9d7](https://github.com/ui-router/publish-scripts/commit/2e9d9d7))




## 2.3.10 (2018-04-21)
[Compare `@uirouter/publish-scripts` versions 2.3.9 and 2.3.10](https://github.com/ui-router/publish-scripts/compare/2.3.9...2.3.10)

### Bug Fixes

* **generate_docs:** fix travis: use symlink, not hard link when generating docs ([d74c101](https://github.com/ui-router/publish-scripts/commit/d74c101))




## 2.3.9 (2018-04-21)
[Compare `@uirouter/publish-scripts` versions 2.3.8 and 2.3.9](https://github.com/ui-router/publish-scripts/compare/2.3.8...2.3.9)

### Features

* **generate_docs:** Attempt to fix travis: use ~/.docgen instead of temp dir ([404ecbf](https://github.com/ui-router/publish-scripts/commit/404ecbf))




## 2.3.8 (2018-04-21)
[Compare `@uirouter/publish-scripts` versions 2.3.7 and 2.3.8](https://github.com/ui-router/publish-scripts/compare/2.3.7...2.3.8)

### Features

* **generate_docs:** Attempt to fix travis: use ~/.docgen instead of temp dir ([b4363d4](https://github.com/ui-router/publish-scripts/commit/b4363d4))




## 2.3.7 (2018-04-21)
[Compare `@uirouter/publish-scripts` versions 2.3.6 and 2.3.7](https://github.com/ui-router/publish-scripts/compare/2.3.6...2.3.7)

### Features

* **generate_docs:** Attempt to fix travis: use ~/.docgen instead of temp dir ([77d06ef](https://github.com/ui-router/publish-scripts/commit/77d06ef))




## 2.3.6 (2018-04-20)
[Compare `@uirouter/publish-scripts` versions 2.3.5 and 2.3.6](https://github.com/ui-router/publish-scripts/compare/2.3.5...2.3.6)

### Bug Fixes

* **generate_docs:** clean up temp directory ([f10ca7b](https://github.com/ui-router/publish-scripts/commit/f10ca7b))




## 2.3.5 (2018-04-20)
[Compare `@uirouter/publish-scripts` versions 2.3.4 and 2.3.5](https://github.com/ui-router/publish-scripts/compare/2.3.4...2.3.5)

### Bug Fixes

* **generate_docs:** use git checkout (not git co) ([4d0928c](https://github.com/ui-router/publish-scripts/commit/4d0928c))




## 2.3.4 (2018-04-20)
[Compare `@uirouter/publish-scripts` versions 2.3.3 and 2.3.4](https://github.com/ui-router/publish-scripts/compare/2.3.3...2.3.4)

### Bug Fixes

* **test_downstream_projects:** make yalc a dependency of publish-scripts, use npx to call it ([de59d18](https://github.com/ui-router/publish-scripts/commit/de59d18))


### Features

* **generate_docs:** update to typedoc 0.11.x and move sources to temp dir to get proper git urls ([3abfe07](https://github.com/ui-router/publish-scripts/commit/3abfe07))
* **publish_yalc_package:** do not move to temp dir when unnecessary ([05b7f6e](https://github.com/ui-router/publish-scripts/commit/05b7f6e))




## 2.3.3 (2018-04-12)
[Compare `@uirouter/publish-scripts` versions 2.3.2 and 2.3.3](https://github.com/ui-router/publish-scripts/compare/2.3.2...2.3.3)

### Features

* **test_downstream_projects:** Support 'projects' and 'nohoist' keys in downstream_projects.json ([f860f61](https://github.com/ui-router/publish-scripts/commit/f860f61))




## 2.3.2 (2018-03-30)
[Compare `@uirouter/publish-scripts` versions 2.3.1 and 2.3.2](https://github.com/ui-router/publish-scripts/compare/2.3.1...2.3.2)

### Features

* **test_downstream_projects:** Add command line toggle for yarn workspaces ([a6ce2ce](https://github.com/ui-router/publish-scripts/commit/a6ce2ce))
* **test_downstream_projects:** Support yarn workspaces ([dc56ebb](https://github.com/ui-router/publish-scripts/commit/dc56ebb))




## 2.3.1 (2018-02-07)
[Compare `@uirouter/publish-scripts` versions 2.3.0 and 2.3.1](https://github.com/ui-router/publish-scripts/compare/2.3.0...2.3.1)

### Features

* **docs:** Enable 'branch' override for included doc repos (like uirouter/core) ([05ca568](https://github.com/ui-router/publish-scripts/commit/05ca568))




# 2.3.0 (2018-02-07)
[Compare `@uirouter/publish-scripts` versions 2.2.10 and 2.3.0](https://github.com/ui-router/publish-scripts/compare/2.2.10...2.3.0)

### Features

* **docs:** Add generate_docs script to generate typedoc documentation ([58afc88](https://github.com/ui-router/publish-scripts/commit/58afc88))
* **docs:** Add publish_docs script to publish typedoc documentation to http://ui-router.github.io/ ([7192f29](https://github.com/ui-router/publish-scripts/commit/7192f29))




## 2.2.10 (2018-01-31)
[Compare `@uirouter/publish-scripts` versions 2.2.9 and 2.2.10](https://github.com/ui-router/publish-scripts/compare/2.2.9...2.2.10)

### Bug Fixes

* **show_changelog:** use merges: null so commit messages from manually merged PRs are processed ([102b794](https://github.com/ui-router/publish-scripts/commit/102b794))




## 2.2.9 (2018-01-30)
[Compare `@uirouter/publish-scripts` versions 2.2.8 and 2.2.9](https://github.com/ui-router/publish-scripts/compare/2.2.8...2.2.9)

### Bug Fixes

* **test_downstream_projects:** Run tests and downstream tests separately.  Switch back to .downstream_cache dir before prepping nested downstream projects ([742ffe4](https://github.com/ui-router/publish-scripts/commit/742ffe4))




## 2.2.8 (2018-01-30)
[Compare `@uirouter/publish-scripts` versions 2.2.7 and 2.2.8](https://github.com/ui-router/publish-scripts/compare/2.2.7...2.2.8)

### Bug Fixes

* **test_downstream_projects:** fix null pointer when skipping downstream projects ([7cd497b](https://github.com/ui-router/publish-scripts/commit/7cd497b))




## 2.2.7 (2018-01-30)
[Compare `@uirouter/publish-scripts` versions 2.2.6 and 2.2.7](https://github.com/ui-router/publish-scripts/compare/2.2.6...2.2.7)

### Features

* **publish_yalc_package:** Build packages in temp directory before publishing ([8df5b99](https://github.com/ui-router/publish-scripts/commit/8df5b99))




## 2.2.6 (2018-01-30)
[Compare `@uirouter/publish-scripts` versions 2.2.5 and 2.2.6](https://github.com/ui-router/publish-scripts/compare/2.2.5...2.2.6)

### Features

* **release:** open github tag in browser to update changelog after publishing ([9f202e9](https://github.com/ui-router/publish-scripts/commit/9f202e9))




## 2.2.5 (2018-01-30)
[Compare `@uirouter/publish-scripts` versions 2.2.4 and 2.2.5](https://github.com/ui-router/publish-scripts/compare/2.2.4...2.2.5)

### Features

* **test:downstream:** Move downstream projects into temp dir before running tests ([5a85e33](https://github.com/ui-router/publish-scripts/commit/5a85e33))




## 2.2.4 (2017-12-30)
[Compare `@uirouter/publish-scripts` versions 2.2.3 and 2.2.4](https://github.com/ui-router/publish-scripts/compare/2.2.3...2.2.4)

### Features

* **publish_yalc:** Support fetching from local directories (not github) and wire publish_yalc logic into test downstream script ([8a38dfb](https://github.com/ui-router/publish-scripts/commit/8a38dfb))




## 2.2.3 (2017-12-29)
[Compare `@uirouter/publish-scripts` versions 2.2.2 and 2.2.3](https://github.com/ui-router/publish-scripts/compare/2.2.2...2.2.3)



## 2.2.2 (2017-12-28)
[Compare `@uirouter/publish-scripts` versions 2.2.1 and 2.2.2](https://github.com/ui-router/publish-scripts/compare/2.2.1...2.2.2)

### Bug Fixes

* **publish_yalc:** Check if directory/.git exists, not just directory. ([0db29b7](https://github.com/ui-router/publish-scripts/commit/0db29b7))




## 2.2.1 (2017-12-27)
[Compare `@uirouter/publish-scripts` versions 2.2.0 and 2.2.1](https://github.com/ui-router/publish-scripts/compare/2.2.0...2.2.1)

### Features

* **downstream:** Only test downstreams from DOWNSTREAM_PKGS env variable (if set) ([8fc540d](https://github.com/ui-router/publish-scripts/commit/8fc540d))




# 2.2.0 (2017-12-27)
[Compare `@uirouter/publish-scripts` versions 2.1.2 and 2.2.0](https://github.com/ui-router/publish-scripts/compare/2.1.2...2.2.0)

### Features

* **yalc:** Add publish_yalc_package script for travis scripts ([349cc57](https://github.com/ui-router/publish-scripts/commit/349cc57))




## 2.1.2 (2017-12-27)
[Compare `@uirouter/publish-scripts` versions 2.1.1 and 2.1.2](https://github.com/ui-router/publish-scripts/compare/2.1.1...2.1.2)

### Bug Fixes

* **downstream:** define giturl variable before use ([eed79ee](https://github.com/ui-router/publish-scripts/commit/eed79ee))




## 2.1.1 (2017-12-27)
[Compare `@uirouter/publish-scripts` versions 2.1.0 and 2.1.1](https://github.com/ui-router/publish-scripts/compare/2.1.0...2.1.1)

### Features

* **downstream:** enable yalc add of grandparent upstream (core -> angular -> sample-app-angular) ([6c12618](https://github.com/ui-router/publish-scripts/commit/6c12618))




# 2.1.0 (2017-12-26)
[Compare `@uirouter/publish-scripts` versions 2.0.8 and 2.1.0](https://github.com/ui-router/publish-scripts/compare/2.0.8...2.1.0)

### Features

* **test:** add test_downstream_projects script ([c8790a8](https://github.com/ui-router/publish-scripts/commit/c8790a8))




## 2.0.8 (2017-12-09)
[Compare `@uirouter/publish-scripts` versions 2.0.7 and 2.0.8](https://github.com/ui-router/publish-scripts/compare/2.0.7...2.0.8)

### Bug Fixes

* **release:** Use git commit instead of git ci ([2ce1506](https://github.com/ui-router/publish-scripts/commit/2ce1506))




## 2.0.7 (2017-12-06)
[Compare `@uirouter/publish-scripts` versions 2.0.6 and 2.0.7](https://github.com/ui-router/publish-scripts/compare/2.0.6...2.0.7)

### Bug Fixes

* **scripts:** remove broken update_changelog.js script entry from package.json ([dad1222](https://github.com/ui-router/publish-scripts/commit/dad1222))




## 2.0.6 (2017-10-22)
[Compare `@uirouter/publish-scripts` versions 2.0.5 and 2.0.6](https://github.com/ui-router/publish-scripts/compare/2.0.5...2.0.6)

### Bug Fixes

* **changelog:** Add newline to end of package.json ([ad345d0](https://github.com/ui-router/publish-scripts/commit/ad345d0))




## 2.0.5 (2017-10-17)
[Compare `@uirouter/publish-scripts` versions 2.0.4 and 2.0.5](https://github.com/ui-router/publish-scripts/compare/2.0.4...2.0.5)

### Bug Fixes

* **release:** Fix args processing for multiple deps ([f0d1d68](https://github.com/ui-router/publish-scripts/commit/f0d1d68))




## 2.0.4 (2017-10-17)
[Compare `@uirouter/publish-scripts` versions 2.0.3 and 2.0.4](https://github.com/ui-router/publish-scripts/compare/2.0.3...2.0.4)

### Bug Fixes

* **show_changelog:** silence popd() output ([45a0c5a](https://github.com/ui-router/publish-scripts/commit/45a0c5a))




## 2.0.3 (2017-10-17)
[Compare `@uirouter/publish-scripts` versions 2.0.2 and 2.0.3](https://github.com/ui-router/publish-scripts/compare/2.0.2...2.0.3)

### Features

* **run:** Add npm-run-all package ([1dd0a6c](https://github.com/ui-router/publish-scripts/commit/1dd0a6c))




## 2.0.2 (2017-10-17)
[Compare `@uirouter/publish-scripts` versions 2.0.1 and 2.0.2](https://github.com/ui-router/publish-scripts/compare/2.0.1...2.0.2)

### Features

* **publish:** Update bower.json, if it exists ([2c0547b](https://github.com/ui-router/publish-scripts/commit/2c0547b))




## 2.0.1 (2017-10-16)
[Compare `@uirouter/publish-scripts` versions 2.0.0 and 2.0.1](https://github.com/ui-router/publish-scripts/compare/2.0.0...2.0.1)

### Features

* **changelog:** Remove update_changelog in favor of release.js ([7dcd45d](https://github.com/ui-router/publish-scripts/commit/7dcd45d))




# 2.0.0 (2017-10-16)
[Compare `@uirouter/publish-scripts` versions 1.1.1 and 2.0.0](https://github.com/ui-router/publish-scripts/compare/1.1.1...2.0.0)

### Features

* **changelog:** improve changelog generation scripts ([12298ad](https://github.com/ui-router/publish-scripts/commit/12298ad))
* **release:** Add post-install steps ([9a3377c](https://github.com/ui-router/publish-scripts/commit/9a3377c))
* **release:** Automate more steps in release.js ([d963f9d](https://github.com/ui-router/publish-scripts/commit/d963f9d))




## 1.1.1 (2017-10-13)
[Compare `@uirouter/publish-scripts` versions 1.1.0 and 1.1.1](https://github.com/ui-router/publish-scripts/compare/1.1.0...1.1.1)

### Features

* **sourcemap:** upgrade to tweak-sourcemap-paths 0.0.2 ([aa3e0b2](https://github.com/ui-router/publish-scripts/commit/aa3e0b2))



# 1.1.0 (2017-10-13)
[Compare `@uirouter/publish-scripts` versions 1.0.9 and 1.1.0](https://github.com/ui-router/publish-scripts/compare/1.0.9...1.1.0)

### Features

* **sourcemap:** Use tweak-sourcemap-paths 0.0.1 ([b357c84](https://github.com/ui-router/publish-scripts/commit/b357c84))



## 1.0.9 (2017-10-07)
[Compare `@uirouter/publish-scripts` versions 1.0.8 and 1.0.9](https://github.com/ui-router/publish-scripts/compare/1.0.8...1.0.9)

### Features

* **update_changelog:** change cmd line arg from --no-core opt-out to --include-core opt-in ([69b20e5](https://github.com/ui-router/publish-scripts/commit/69b20e5))



## 1.0.8 (2017-10-07)
[Compare `@uirouter/publish-scripts` versions 1.0.7 and 1.0.8](https://github.com/ui-router/publish-scripts/compare/1.0.7...1.0.8)

### Features

* **update_changelog:** Add --no-core toggle to disable processing uirouter/core changelog ([b343db7](https://github.com/ui-router/publish-scripts/commit/b343db7))



## 1.0.7 (2017-09-13)
[Compare `@uirouter/publish-scripts` versions 1.0.6 and 1.0.7](https://github.com/ui-router/publish-scripts/compare/1.0.6...1.0.7)

### Bug Fixes

* **build:** Fix dep on conventional-changelog-ui-router-core ([e90d091](https://github.com/ui-router/publish-scripts/commit/e90d091))



## `@uirouter/publish-scripts` 1.0.6 (2017-08-13)
[Compare `@uirouter/publish-scripts` versions 1.0.5 and 1.0.6](https://github.com/ui-router/publish-scripts/compare/1.0.5...1.0.6)

### Bug Fixes

* **sourcemap:** rewrite ../node_modules/[@uirouter](https://github.com/uirouter) paths ([553d27f](https://github.com/ui-router/publish-scripts/commit/553d27f))



## 1.0.5 (2017-08-12)
[Compare `@uirouter/publish-scripts` versions 1.0.4 and 1.0.5](https://github.com/ui-router/publish-scripts/compare/1.0.4...1.0.5)

### Bug Fixes

* **artifact_tagging:** Correctly reset 'latest' tag ([1115be6](https://github.com/ui-router/publish-scripts/commit/1115be6))



## 1.0.4 (2017-08-12)
[Compare `@uirouter/publish-scripts` versions 1.0.3 and 1.0.4](https://github.com/ui-router/publish-scripts/compare/1.0.3...1.0.4)

### Bug Fixes

* **artifact_tagging:** re-enable publishing (disable dryrun) ([37b1cfc](https://github.com/ui-router/publish-scripts/commit/37b1cfc))



## 1.0.3 (2017-08-12)
[Compare `@uirouter/publish-scripts` versions 1.0.2 and 1.0.3](https://github.com/ui-router/publish-scripts/compare/1.0.2...1.0.3)

### Bug Fixes

* **show_core_changelog:** Use cwd to find the "core" working copy ([994c44c](https://github.com/ui-router/publish-scripts/commit/994c44c))



## 1.0.2 (2017-08-12)
[Compare `@uirouter/publish-scripts` versions 1.0.1 and 1.0.2](https://github.com/ui-router/publish-scripts/compare/1.0.1...1.0.2)

### Bug Fixes

* **update_changelog:** Fix fx require stmt ([76db2f8](https://github.com/ui-router/publish-scripts/commit/76db2f8))



## Changes in `@uirouter/core` between versions [1.0.0 and 1.0.1](https://github.com/ui-router/publish-scripts/compare/1.0.0...1.0.1) (2017-08-12)


### Bug Fixes

* **update_changelog:** Add core changelog, unless we're in uirouter/core ([af67499](https://github.com/ui-router/publish-scripts/commit/af67499))



# 1.0.0
Initial release
