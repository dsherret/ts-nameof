# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
