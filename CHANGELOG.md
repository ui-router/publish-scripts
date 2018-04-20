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
