/*istanbul ignore next*/
import tsNameOf = require("ts-nameof");
import * as tsNameOfEs6 from "ts-nameof";

/*istanbul ignore next*/
function testFunc() {
    const result: NodeJS.ReadWriteStream = tsNameOfEs6();
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

    // es6 test
    const es6Result: NodeJS.ReadWriteStream = tsNameOfEs6();
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
