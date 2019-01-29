# Using ts-nameof with Jest

1. Setup jest with [ts-jest](https://github.com/kulshekhar/ts-jest)

2. `npm install --save-dev ts-nameof @types/ts-nameof`

3. In *package.json* specify...

```
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

...or in *jest.config.js*...

```
module.exports = {
  // ...
  globals: {
    "ts-jest": {
      "astTransformers": ["ts-nameof"]
    }
  }
};
```
