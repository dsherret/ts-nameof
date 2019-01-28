ts-nameof
==========

[![npm version](https://badge.fury.io/js/ts-nameof.svg)](https://badge.fury.io/js/ts-nameof)
[![Build Status](https://travis-ci.org/dsherret/ts-nameof.svg)](https://travis-ci.org/dsherret/ts-nameof)
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[`nameof`](https://msdn.microsoft.com/en-us/library/dn986596.aspx) in TypeScript.

```
npm install ts-nameof --save-dev
```

**VERSION 2 BREAKING CHANGE:** Please re-read the instructions for setting up ts-nameof when upgrading to version 2. Most instructions use the typescript compiler API's transformation API now.

## Setup

### 1. Build Setup

Follow any of these instructions:

* [Webpack](setup/webpack.md)
* [Gulp](setup/gulp.md)
* [FuseBox](setup/fusebox.md)
* [tsc](setup/tsc.md)
* [Custom](setup/custom.md)
* Others - Open an [issue](https://github.com/dsherret/ts-nameof/issues).

These instructions need updating to use the transformation API, but will still work in the meantime:

* [Jest](setup/jest.md)
* Nuxt - Use [https://github.com/Kukks/nuxt-ts-nameof](https://github.com/Kukks/nuxt-ts-nameof#readme)

### 2. Declaring global `nameof` function

You may need to add a reference to this package's typescript definition file in order to declare the global `nameof` function:

```typescript
/// <reference path="node_modules/ts-nameof/ts-nameof.d.ts" />
```

Make sure to add that to a single definition file in your project where other references are located so that you don't need to include it in every file that uses nameof.

## Other

* [Contributing](../../CONTRIBUTING.md)
* [Development](../../development.md)