/// <reference path="../ts-nameof.d.ts" />
/* tslint:disable */
/* istanbul ignore next */
import tsNameOf = require("ts-nameof");
import * as tsNameOfEs6 from "ts-nameof";
import { IsExactType, assert } from "conditional-type-checks";

namespace TestNamespace {
    export interface TestType {
        prop: string;
    }
}

/* istanbul ignore next */
function testFunc() {
    tsNameOf.replaceInFiles(["test"]);
    tsNameOf.replaceInFiles(["test"], err => {
        assert<IsExactType<any, typeof err>>(true);
    });
    tsNameOf.replaceInFiles(["test"], { });
    tsNameOf.replaceInFiles(["test"], { encoding: "utf-8" });
    tsNameOf.replaceInFiles(["test"], { encoding: "utf-8" }, err => {
        assert<IsExactType<any, typeof err>>(true);
    });

    // replaceInText
    const replaceInTextResult = tsNameOf.replaceInText("fileName.ts", "const t = 5;")
    console.log(replaceInTextResult);
    assert<IsExactType<typeof replaceInTextResult.fileText, string | undefined>>(true);
    assert<IsExactType<typeof replaceInTextResult.replaced, boolean>>(true);

    // es6 test
    const es6Result = tsNameOfEs6.replaceInText("file.ts", "");
    console.log(es6Result.replaced);

    class TestClass {
        prop: string;
    }

    // nameof tests
    nameof(TestClass);
    nameof<TestNamespace.TestType>();
    nameof<TestClass>(t => t.prop);

    // nameof.full tests
    const testInstance = new TestClass();
    nameof.full(testInstance.prop);
    nameof.full(testInstance.prop, 1);
    nameof.full<TestNamespace.TestType>();
    nameof.full<TestNamespace.TestType>(1);
    nameof.full<TestClass>(t => t.prop);
    nameof.full<TestClass>(t => t.prop, 1);

    // reference type test
    const myObj = { test: "" };
    nameof(myObj);
    nameof.full(myObj);

    // primitive type test
    const myStr = "";
    nameof(myStr);
    nameof.full(myStr);

    // null test
    const nullTypedVar = null;
    nameof(nullTypedVar);
    nameof.full(nullTypedVar);

    // undefined test
    const undefinedTypedVar = undefined;
    nameof(undefinedTypedVar);
    nameof.full(undefinedTypedVar);
}
