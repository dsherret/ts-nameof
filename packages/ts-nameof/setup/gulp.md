# Using ts-nameof with Gulp

Specify it as a custom transformer with [gulp-typescript](https://github.com/ivogabe/gulp-typescript):

```javascript
const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsNameof = require("ts-nameof");

gulp.task("typescript", function() {
    gulp.src("src/**/*.ts")
        .pipe(ts({
            getCustomTransformers: () => ({ before: [tsNameof]})
        }))
        .pipe(gulp.dest("dist"));
});
```