ts-nameof
==========

[![npm version](https://badge.fury.io/js/ts-nameof.svg)](https://badge.fury.io/js/ts-nameof)
[![Build Status](https://travis-ci.org/dsherret/ts-nameof.svg)](https://travis-ci.org/dsherret/ts-nameof)
[![Coverage Status](https://coveralls.io/repos/dsherret/ts-nameof/badge.svg?branch=master&service=github)](https://coveralls.io/github/dsherret/ts-nameof?branch=master)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

[`nameof`](https://msdn.microsoft.com/en-us/library/dn986596.aspx) in TypeScript.

This library is experimental. I'll be working on it more over the next few weeks.

```
npm install ts-nameof --save-dev
```

May need to add a reference to this package's typescript definition file:

```typescript
// add this to a single definition file in your project where other references are located so
// that you don't need to include it in every file that uses nameof

/// <reference path="node_modules/ts-nameof/ts-nameof.d.ts" />
```

## Example - Replacing in *.ts* files (with stream)

1. Start with your TypeScript:

    ```typescript
    // src/MyFile.ts
    console.log(nameof(console));
    console.log(nameof(console.log));
    console.log(nameof.full(console.log));

    nameof<MyInterface>();
    console.log(nameof<Array<MyInterface>>());
    nameof<MyNamespace.MyInnerInterface>();
    ```

2. Pipe your *.ts* files to `tsNameof`:

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

3. Compile:

    ```bash
    gulp typescript
    ```

After step 3, *dist/MyFile.js* will contain the following code:

```javascript
console.log("console");
console.log("log");
console.log("console.log");

"MyInterface";
console.log("Array");
"MyInnerInterface";
```


## Example - Replacing in *.js* files (using `replaceInFiles`)

1. Start with your TypeScript:

    ```typescript
    // src/MyFile.ts
    var myVariable = "";

    nameof(myVariable);
    nameof(window.alert);
    ```

2. Compile your TypeScript to JavaScript (this example compiles *.ts* files in */src* to */dist*).

3. Run replace in files:

    ```javascript
    var replaceInFiles = require("ts-nameof").replaceInFiles;
    replaceInFiles(["./dist/**/*.js"]);
    ```

After step 3 *dist/MyFile.js* will contain the following code:

```javascript
// dist/MyFile.js
var myVariable = "";

"myVariable";
"alert";
```

## Example - Replacing in *.ts* files (using `replaceInFiles`)

You can use `replaceInFiles` to replace in .ts files:

1. Copy your .ts files to a build folder. This is necessary so you don't overwrite your original source files.
2. Run `replaceInFiles` on these files.
3. Compile the resultant typescript files.

## Todo

* JS map file support.

## Future

Ideally this would be a plugin for the TypeScript emitter. Unfortunately that isn't availble yet, but it will be a smooth transition once that's supported.
