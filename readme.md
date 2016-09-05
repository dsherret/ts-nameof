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

## Example - Replacing in *.ts* files (with stream)

1. Start with your TypeScript.

    ```typescript
    // src/MyFile.ts
    console.log(nameof(console));
    console.log(nameof(console.log));

    nameof<MyInterface>();
    console.log(nameof<Array<MyInterface>>());
    nameof<MyNamespace.MyInnerInterface>();
    ```

2. Pipe your *.ts* files to `tsNameof`:

    ```javascript
    var ts = require("gulp-typescript");
    var tsnameof = require("ts-nameof");

    gulp.src("src/**/*.ts")
        .pipe(tsnameof())
        .pipe(ts())
        .pipe(gulp.dest("dist"));
    ```

After step 2, *dist/MyFile.js* will contain the following code:

```javascript
console.log("console");
console.log("log");

"MyInterface";
console.log("Array");
"MyInnerInterface";
```


## Example - Replacing in *.js* files (using `replaceInFiles`)

1. Start with your TypeScript.

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

## Note

I am not sure why, but in some scenarios you might need to add a reference to this package's typescript definition:

```typescript
// add this to a single definition file in your project where you make other references

/// <reference path="node_modules/ts-nameof/ts-nameof.d.ts" />
```

If someone can tell me what I'm doing wrong that makes this necessary that would be great. I thought TypeScript should resolve it automatically.

## Future

Ideally this would be a plugin for the TypeScript emitter. Unfortunately that isn't availble yet, but it will be a smooth transition once that's supported.
