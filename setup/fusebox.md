# Using ts-nameof with FuseBox

To use ts-nameof with [FuseBox](https://github.com/fuse-box/fuse-box), specify it as a custom transformer:

```javascript
const tsNameof = require("ts-nameof");

FuseBox.init({
    transformers: {
        before: [tsNameof]
    }
});
```
