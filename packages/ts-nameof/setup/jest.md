# Using ts-nameof with Jest

1. `npm install --save-dev ts-nameof @types/ts-nameof`

2. In *package.json* specify...

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
