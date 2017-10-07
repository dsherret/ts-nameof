# Using ts-nameof with a Custom Setup

## Replacing in Files

You can use `replaceInFiles` to replace in .ts files:

```javascript
var replaceInFiles = require("ts-nameof").replaceInFiles;
replaceInFiles(["./dist/**/*.ts"]);
```

1. Copy your .ts files to a build folder. This is necessary so you don't overwrite your original source files.
2. Run `replaceInFiles` on these files.
3. Compile the final typescript files.

## Replacing in Text

You can also use the `replaceInText` function to replace occurrences of `nameof` in any string:

```javascript
var replaceInText = require("ts-nameof").replaceInText;
var replacedText = replaceInText("nameof(test);");
```
