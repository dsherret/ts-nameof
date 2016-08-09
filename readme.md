ts-nameof
==========

[![Build Status](https://travis-ci.org/dsherret/ts-nameof.svg)](https://travis-ci.org/dsherret/ts-nameof)
[![Coverage Status](https://coveralls.io/repos/dsherret/ts-nameof/badge.svg?branch=master&service=github)](https://coveralls.io/github/dsherret/ts-nameof?branch=master)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

[`nameof`](https://msdn.microsoft.com/en-us/library/dn986596.aspx) in TypeScript.

This library is experimental. I'll be working on it more over the next few weeks.

```
npm install ts-nameof --save-dev
```

## Example

1. Start with your TypeScript

    ```typescript
    // src/MyFile.ts
    var myVariable = "";

    console.log(nameof(myVariable));
    console.log(nameof(window.alert));
    ```

2. Compile your TypeScript to JavaScript (this example compiles *.ts* files in */src* to */dist*)

3. Run replace in files:

    ```javascript
    var replaceInFiles = require("ts-nameof").replaceInFiles;
    replaceInFiles(["./dist/MyFile.js"]);
    ```

After step 3 *dst/MyFile.js* will contain the following code:

```javascript
// dist/MyFile.js
var myVariable = "";

console.log("myVariable");
console.log("alert");
```

## Todo

1. Glob support (ex. `replaceInFiles(["./dist/**/*.js"]);`)
2. JS map file support
3. Performance improvements

## Future

Ideally this would be a plugin for the TypeScript emitter. Unfortunately that isn't availble yet, but it will be a smooth transition once that's supported.
