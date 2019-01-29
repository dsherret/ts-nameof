ts-nameof.macro
===============

[![npm version](https://badge.fury.io/js/ts-nameof.macro.svg)](https://badge.fury.io/js/ts-nameof.macro)
[![Build Status](https://travis-ci.org/dsherret/ts-nameof.svg)](https://travis-ci.org/dsherret/ts-nameof)
[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)
[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[`nameof`](https://msdn.microsoft.com/en-us/library/dn986596.aspx) in TypeScript.

This is a [babel macro](https://github.com/kentcdodds/babel-plugin-macros) of [ts-nameof](https://github.com/dsherret/ts-nameof).

## Setup

1. Install dependencies:

```
npm install --save-dev babel-plugin-macros ts-nameof.macro
```

2. Ensure `babel-plugin-macros` is properly setup ([Instructions](https://github.com/kentcdodds/babel-plugin-macros/blob/master/other/docs/user.md)).

3. Import and use the default export. For example:

```ts
import nameof from "ts-nameof.macro";

nameof(window.alert);
```

Transforms to:

```ts
"alert";
```

## Transforms

[Read here](../../README.md)

## Other

* [Contributing](../../CONTRIBUTING.md)
* [Development](../../DEVELOPMENT.md)