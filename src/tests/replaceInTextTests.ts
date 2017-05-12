import * as assert from "assert";
import {replaceInText} from "./../main";

// most other test cases are tested elsewhere, but should eventually be consolidated here
describe("replaceInText()", () => {
    function runTest(text: string, expected: string) {
        const result = replaceInText(text);
        assert.equal(result.fileText || text, expected);
    }

    describe("arrays", () => {
        describe("nameof", () => {
            it("should include the brackets", () => {
                const text = `nameof(anyProp[0]);`;
                const expected = `"anyProp[0]";`;
                runTest(text, expected);
            });

            it("should get after the period", () => {
                const text = `nameof(anyProp[0].prop);`;
                const expected = `"prop";`;
                runTest(text, expected);
            });

            it("should include the brackets when getting an ambient declaration's property", () => {
                const text = `nameof<MyInterface>(i => i.prop[0]);`;
                const expected = `"prop[0]";`;
                runTest(text, expected);
            });
        });

        describe("nameof.full", () => {
            it("should include the brackets", () => {
                const text = `nameof.full(anyProp[0].myProp);`;
                const expected = `"anyProp[0].myProp";`;
                runTest(text, expected);
            });
        });
    });
});
