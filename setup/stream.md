# Using ts-nameof with a Stream or Gulp

1. Pipe your *.ts* files to `tsNameof`:

    ```javascript
    var gulp = require("gulp");
    var ts = require("gulp-typescript");
    var tsNameof = require("ts-nameof");

    gulp.task("typescript", function() {
        gulp.src("src/**/*.ts")
            .pipe(tsNameof())
            .pipe(ts())
            .pipe(gulp.dest("dist"));
    });
    ```

2. Compile:

    ```bash
    gulp typescript
    ```