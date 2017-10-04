ts-nameof
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

## What does this do?

It takes a file like this:

```typescript
console.log(nameof(console));
console.log(nameof(console.log));
console.log(nameof.full(console.log));
console.log(nameof.full(window.alert.length, 1));
console.log(nameof.full(window.alert.length, 2));
console.log(nameof.full(window.alert.length, -1));
console.log(nameof.full(window.alert.length, -2));
console.log(nameof.full(window.alert.length, -3));

nameof<MyInterface>();
console.log(nameof<Array<MyInterface>>());
nameof<MyNamespace.MyInnerInterface>();
nameof.full<MyNamespace.MyInnerInterface>();
nameof.full<MyNamespace.MyInnerInterface>(1);
nameof.full<Array<MyInterface>>();
nameof<MyInterface>(o => o.prop);
```

And outputs this (minus the comments):

```typescript
console.log("console");             // console.log(nameof(console));
console.log("log");                 // console.log(nameof(console.log));
console.log("console.log");         // console.log(nameof.full(console.log));
console.log("alert.length");        // console.log(nameof.full(window.alert.length, 1));
console.log("length");              // console.log(nameof.full(window.alert.length, 2));
console.log("length");              // console.log(nameof.full(window.alert.length, -1));
console.log("alert.length");        // console.log(nameof.full(window.alert.length, -2));
console.log("window.alert.length"); // console.log(nameof.full(window.alert.length, -3));

"MyInterface";                      // nameof<MyInterface>();
console.log("Array");               // console.log(nameof<Array<MyInterface>>());
"MyInnerInterface";                 // nameof<MyNamespace.MyInnerInterface>();
"MyNamespace.MyInnerInterface";     // nameof.full<MyNamespace.MyInnerInterface>();
"MyInnerInterface";                 // nameof.full<MyNamespace.MyInnerInterface>(1);
"Array";                            // nameof.full<Array<MyInterface>>();
"prop";                             // nameof<MyInterface>(o => o.prop);
```

## Recommended Build Option - Replacing in *.ts* files (with stream)

1. Pipe your *.ts* files to `tsNameof`:

    ```javascript
    var gulp = require("gulp");
    var ts = require("gulp-typescript");
    var tsNameof = require("ts-nameof");

    gulp.task("typescript", function() {
        gulp.src("src/**/*.ts")
            .pipe(tsNameof())
            .pipe(ts())
            .pipe(gulp.dest("dist"));
    });
    ```

2. Compile:

    ```bash
    gulp typescript
    ```

## Alternate Build Option 1 - Replacing in *.js* files (using `replaceInFiles`)

1. Start with your TypeScript:

2. Compile your TypeScript to JavaScript (this example compiles *.ts* files in */src* to */dist*).

3. Run replace in files:

    ```javascript
    var replaceInFiles = require("ts-nameof").replaceInFiles;
    replaceInFiles(["./dist/**/*.js"]);
    ```

## Alternate Build Option 2 - Replacing in *.ts* files (using `replaceInFiles`)

You can use `replaceInFiles` to replace in .ts files:

1. Copy your .ts files to a build folder. This is necessary so you don't overwrite your original source files.
2. Run `replaceInFiles` on these files.
3. Compile the resultant typescript files.

## Jest Integration
If you are using Jest for unit tests, you most likely have `ts-jest` in your project already. In addition to the standard `ts-jest` configuration, we will need to wrap their preprocessor script in our own to make nameof work in jest.
1. In package.json replace:
```
  "jest": {
		...
		"transform": {
			"^.+\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
			...
		}
	}
```
with:
```
  "jest": {
		...
		"transform": {
			"^.+\\.(ts|tsx)$": "<rootDir>/jest-preprocessor.js",
			...
		}
	}
```
2. Create preprocessor.js in your root folder
```
const nameof = require('ts-nameof');
const tsJest = require('ts-jest/preprocessor.js');
Object.defineProperty(exports, "__esModule", { value: true });

function process(src, filename, config, options) {
  const replaceResult = nameof.replaceInText(src);
  if (replaceResult.replaced) {
    return tsJest.process(replaceResult.fileText,filename,config, options);
  }
  return tsJest.process(src,filename,config, options);
};

exports.getCacheKey = tsJest.getCacheKey;

exports.process = process;

```
  ## Todo
* JS map file support.

## Future

Ideally this would be a plugin for the TypeScript emitter. Unfortunately that isn't available yet, but there is some work on
this in the [transformationApi](https://github.com/dsherret/ts-nameof/tree/transformationApi) branch for when this happens.
