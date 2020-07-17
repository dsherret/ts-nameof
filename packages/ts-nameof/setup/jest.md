# Using ts-nameof with Jest

1. Setup jest with [ts-jest](https://github.com/kulshekhar/ts-jest)

2. `npm install --save-dev ts-nameof @types/ts-nameof`

3. In _package.json_ specify...

```jsonc
{
  // ...
  "jest": {
    "globals": {
      "ts-jest": {
        "astTransformers": ["ts-nameof"]
      }
    }
  }
}
```

...or in _jest.config.js_...

```ts
module.exports = {
    // ...
    globals: {
        "ts-jest": {
            "astTransformers": ["ts-nameof"]
        }
    }
};
```
