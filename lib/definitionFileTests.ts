/// <reference path="../ts-nameof.d.ts" />
/* tslint:disable */
/* istanbul ignore next */
import tsNameOf = require("ts-nameof");
import * as tsNameOfEs6 from "ts-nameof";
import { IsExactType, assert } from "conditional-type-checks";

/* istanbul ignore next */
function testFunc() {
    const result: NodeJS.ReadWriteStream = tsNameOf.stream("file.ts");
    console.log(result);
    tsNameOf.replaceInFiles(["test"]);
    tsNameOf.replaceInFiles(["test"], (err) => {
        const e: NodeJS.ErrnoException | undefined = err;
        console.log(e);
    });
    tsNameOf.replaceInFiles(["test"], { });
    tsNameOf.replaceInFiles(["test"], { encoding: "utf-8" });
    tsNameOf.replaceInFiles(["test"], { encoding: "utf-8" }, (err) => {
        const e: NodeJS.ErrnoException | undefined = err;
        console.log(e);
    });

    // replaceInText
    const replaceInTextResult = tsNameOf.replaceInText("fileName.ts", "const t = 5;")
    console.log(replaceInTextResult);
    assert<IsExactType<typeof replaceInTextResult.fileText, string | undefined>>(true);
    assert<IsExactType<typeof replaceInTextResult.replaced, boolean>>(true);

    // es6 test
    const es6Result: NodeJS.ReadWriteStream = tsNameOfEs6.stream("file.ts");
    console.log(es6Result);

    // null test
    const nullTypedVar = null;
    nameof(nullTypedVar);
    nameof.full(nullTypedVar);

    // undefined test
    const undefinedTypedVar = undefined;
    nameof(undefinedTypedVar);
    nameof.full(undefinedTypedVar);
}
