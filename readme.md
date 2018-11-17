﻿ts-nameof
==========

[![npm version](https://badge.fury.io/js/ts-nameof.svg)](https://badge.fury.io/js/ts-nameof)
[![Build Status](https://travis-ci.org/dsherret/ts-nameof.svg)](https://travis-ci.org/dsherret/ts-nameof)
[![Coverage Status](https://coveralls.io/repos/dsherret/ts-nameof/badge.svg?branch=master&service=github)](https://coveralls.io/github/dsherret/ts-nameof?branch=master)
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[`nameof`](https://msdn.microsoft.com/en-us/library/dn986596.aspx) in TypeScript.

```
npm install ts-nameof --save-dev
```

You may need to add a reference to this package's typescript definition file in order to declare the global `nameof` function:

```typescript
/// <reference path="node_modules/ts-nameof/ts-nameof.d.ts" />
```

Make sure to add that to a single definition file in your project where other references are located so that you don't need to include it in every file that uses nameof.

## Setup

Follow any of these instructions:

* [Webpack](setup/webpack.md)
* [Gulp](setup/gulp.md)
* [FuseBox](setup/fusebox.md)
* [Jest](setup/jest.md)
* [TypeScript Transformation API](setup/transformation-api.md)
* [Custom](setup/custom.md)
* Others - Open an [issue](https://github.com/dsherret/ts-nameof/issues).

Todo (this needs v2 support):

* Nuxt - Use [https://github.com/Kukks/nuxt-ts-nameof](https://github.com/Kukks/nuxt-ts-nameof#readme)

## What does this do?

It takes a file like this:

```typescript
nameof(console);
nameof(console.log);
nameof.full(console.log);
nameof.full(window.alert.length, 1);
nameof.full(window.alert.length, 2);
nameof.full(window.alert.length, -1);
nameof.full(window.alert.length, -2);
nameof.full(window.alert.length, -3);

nameof<MyInterface>();
nameof<Array<MyInterface>>();
nameof<MyNamespace.MyInnerInterface>();
nameof.full<MyNamespace.MyInnerInterface>();
nameof.full<MyNamespace.MyInnerInterface>(1);
nameof.full<Array<MyInterface>>();
nameof<MyInterface>(o => o.prop);
nameof.full<MyInterface>(o => o.prop.prop2);
nameof.full<MyInterface>(o => o.prop.prop2.prop3, 1);
```

And outputs the identifiers as strings. In this case the output will be this minus the comments:

```typescript
"console";             // nameof(console);
"log";                 // nameof(console.log);
"console.log";         // nameof.full(console.log);
"alert.length";        // nameof.full(window.alert.length, 1);
"length";              // nameof.full(window.alert.length, 2);
"length";              // nameof.full(window.alert.length, -1);
"alert.length";        // nameof.full(window.alert.length, -2);
"window.alert.length"; // nameof.full(window.alert.length, -3);

"MyInterface";                      // nameof<MyInterface>();
"Array";                            // nameof<Array<MyInterface>>();
"MyInnerInterface";                 // nameof<MyNamespace.MyInnerInterface>();
"MyNamespace.MyInnerInterface";     // nameof.full<MyNamespace.MyInnerInterface>();
"MyInnerInterface";                 // nameof.full<MyNamespace.MyInnerInterface>(1);
"Array";                            // nameof.full<Array<MyInterface>>();
"prop";                             // nameof<MyInterface>(o => o.prop);
"prop.prop2";                       // nameof.full<MyInterface>(o => o.prop.prop2);
"prop2.prop3";                      // nameof.full<MyInterface>(o => o.prop.prop2.prop3, 1);
```

## Unsupported

* JS map file support does not work unless using the [Transformation API](setup/transformation-api.md). If you need map file support, then please follow the instructions for using the transformation API.

## Development

```
# setup
yarn install
# running tests
yarn run test
# linting
yarn run lint
```