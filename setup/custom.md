# Using ts-nameof with a Custom Setup

## Transformation API

The export from `ts-nameof` is a `ts.TransformerFactory<ts.SourceFile>` so that can be used anywhere custom transformers are accepted. For example, see the [webpack instructions](webpack.md).

```ts
const tsNameof = require("ts-nameof");

// tsNameof is a ts.TransformerFactory<ts.SourceFile>
```

If you find this works for the library you're using to do a build then please consider submitting a PR with setup instructions for that library.

## Working with text

Note that these solution require reparsing the source file text and that might make the build slow. The other solutions mostly all use the
transformation api which will be much faster.

### Replacing in Files

You can use `replaceInFiles` to replace in .ts files:

```javascript
var replaceInFiles = require("ts-nameof").replaceInFiles;
replaceInFiles(["./dist/**/*.ts"]);
```

1. Copy your .ts files to a build folder. This is necessary so you don't overwrite your original source files.
2. Run `replaceInFiles` on these files.
3. Compile the final typescript files.

### Replacing in Text

You can also use the `replaceInText` function to replace occurrences of `nameof` in any string:

```javascript
var replaceInText = require("ts-nameof").replaceInText;
var replacedText = replaceInText("filename.ts", "nameof(test);");
```
