/// <reference path="../ts-nameof.d.ts" />
/* istanbul ignore next */
import tsNameOf = require("ts-nameof");
import * as tsNameOfEs6 from "ts-nameof";
import { IsExactType, assert } from "conditional-type-checks";

/* istanbul ignore next */
function testFunc() {
    tsNameOf.replaceInFiles(["test"]);
    tsNameOf.replaceInFiles(["test"], err => {
        assert<IsExactType<any, typeof err>>(true);
    });
    tsNameOf.replaceInFiles(["test"], {});
    tsNameOf.replaceInFiles(["test"], { encoding: "utf-8" });
    tsNameOf.replaceInFiles(["test"], { encoding: "utf-8" }, err => {
        assert<IsExactType<any, typeof err>>(true);
    });

    // replaceInText
    const replaceInTextResult = tsNameOf.replaceInText("fileName.ts", "const t = 5;");
    console.log(replaceInTextResult);
    assert<IsExactType<typeof replaceInTextResult.fileText, string | undefined>>(true);
    assert<IsExactType<typeof replaceInTextResult.replaced, boolean>>(true);

    // es6 test
    const es6Result = tsNameOfEs6.replaceInText("file.ts", "");
    console.log(es6Result.replaced);
}
