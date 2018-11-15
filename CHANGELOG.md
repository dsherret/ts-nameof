# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.4"></a>
## [1.0.4](https://github.com/dsherret/ts-nameof/compare/v1.0.3...v1.0.4) (2018-11-15)


### Bug Fixes

* Revert fix: [#28](https://github.com/dsherret/ts-nameof/issues/28) - "Handle string chars in regex literals." ([d041cb3](https://github.com/dsherret/ts-nameof/commit/d041cb3))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/dsherret/ts-nameof/compare/v1.0.2...v1.0.3) (2018-10-25)


### Bug Fixes

* Remove lib folder from release. ([7f511c0](https://github.com/dsherret/ts-nameof/commit/7f511c0))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/dsherret/ts-nameof/compare/v1.0.1...v1.0.2) (2018-10-25)


### Bug Fixes

* [#28](https://github.com/dsherret/ts-nameof/issues/28) - Handle string chars in regex literals. ([5b84cde](https://github.com/dsherret/ts-nameof/commit/5b84cde))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/dsherret/ts-nameof/compare/v1.0.0...v1.0.1) (2018-09-10)


### Bug Fixes

* Support dollar sign for text transformation. ([48bc34c](https://github.com/dsherret/ts-nameof/commit/48bc34c))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/dsherret/ts-nameof/compare/v0.10.3...v1.0.0) (2018-05-06)


### Features

* Add support for TypeScript compiler transformations. ([540b23a](https://github.com/dsherret/ts-nameof/commit/540b23a))


### BREAKING CHANGES

* Stream is no longer the default function. It's now `tsnameof.stream()` instead of `tsnameof()`.



<a name="0.10.3"></a>
## [0.10.3](https://github.com/dsherret/ts-nameof/compare/0.10.1...0.10.3) (2017-12-16)


### Bug Fixes

* Escaped backslash before a string char no longer ignores string char. ([4c2c454](https://github.com/dsherret/ts-nameof/commit/4c2c454))
* Use the provided encoding when reading the file. ([a1c0c3c](https://github.com/dsherret/ts-nameof/commit/a1c0c3c))
