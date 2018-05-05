import * as assert from "assert";
import { replaceInText } from "./../main";
import { runTestOnAllMethods } from "./testMethods";

runTestOnAllMethods(doTestsForMethod);

function doTestsForMethod(runTest: (text: string, expected: string) => void) {
    describe("arrays", () => {
        describe("nameof", () => {
            it("should include the brackets", () => {
                runTest(`nameof(anyProp[0]);`, `"anyProp[0]";`);
            });

            it("should get after the period", () => {
                runTest(`nameof(anyProp[0].prop);`, `"prop";`);
            });

            it("should include the brackets when getting an ambient declaration's property", () => {
                runTest(`nameof<MyInterface>(i => i.prop[0]);`, `"prop[0]";`);
            });

            it("should include the nested brackets when getting an ambient declaration's property", () => {
                runTest(`nameof<MyInterface>(i => i.prop[0][1]);`, `"prop[0][1]";`);
            });
        });

        describe("nameof.full", () => {
            it("should include the brackets", () => {
                runTest(`nameof.full(anyProp[0].myProp);`, `"anyProp[0].myProp";`);
            });
        });
    });

    describe("nameof with function", () => {
        it("should get the last string", () => {
            runTest(`nameof<MyInterface>(i => i.prop1.prop2);`, `"prop2";`);
        });

        it("should throw when the function doesn't have a period", () => {
            assert.throws(() => {
                replaceInText(`nameof<MyInterface>(i => i);`);
            });
        });
    });

    describe("nameof.full with function", () => {
        it("should get the text", () => {
            runTest(`nameof.full<MyInterface>(i => i.prop1.prop2);`, `"prop1.prop2";`);
        });

        it("should get the when using a function", () => {
            runTest(`nameof.full<MyInterface>(function(i) { return i.prop1.prop2; });`, `"prop1.prop2";`);
        });

        it("should get the text when providing a period", () => {
            runTest(`nameof.full<MyInterface>(i => i.prop1.prop2, 0);`, `"prop1.prop2";`);
            runTest(`nameof.full<MyInterface>(i => i.prop1.prop2, 1);`, `"prop2";`);
            runTest(`nameof.full<MyInterface>(i => i.prop1.prop2.prop3, -1);`, `"prop3";`);
        });

        it("should throw when the function doesn't have a period", () => {
            assert.throws(() => {
                replaceInText(`nameof.full<MyInterface>(i => i);`);
            });
        });
    });
}
