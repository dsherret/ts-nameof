# Using ts-nameof with Jest

Thanks to [@Kukks](https://github.com/Kukks) for contributing these instructions.

---

If you are using Jest for unit tests, you most likely have `ts-jest` in your project already.

In addition to the standard `ts-jest` configuration, we will need to wrap their preprocessor script in a custom script to make nameof work in jest.

1. In **package.json** replace...

```
"jest": {
    ...
    "transform": {
        "^.+\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
        ...
    }
}
```

...with...

```
"jest": {
    ...
    "transform": {
        "^.+\\.(ts|tsx)$": "<rootDir>/jest-preprocessor.js",
        ...
    }
}
```

2. Create **preprocessor.js** or similar file:

```
const nameof = require('ts-nameof');
const tsJest = require('ts-jest/preprocessor.js');
Object.defineProperty(exports, "__esModule", { value: true });

function process(src, filename, config, options) {
    const replaceResult = nameof.replaceInText(src);
    if (replaceResult.replaced)
        return tsJest.process(replaceResult.fileText,filename,config, options);
    return tsJest.process(src,filename,config, options);
}

exports.getCacheKey = tsJest.getCacheKey;
exports.process = process;
```
