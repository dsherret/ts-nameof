import * as assert from "assert";
import {replaceInText} from "./../main";

describe("issues", () => {
    function runTest(text: string, expected: string) {
        const result = replaceInText(text);
        assert.equal(result.fileText || text, expected);
    }

    describe("#19 - null assertion issue", () => {
        describe("nameof.full", () => {
            it("should output without the null assertion operator", () => {
                runTest("nameof.full(something!.optionalField!.anotherField)", `"something.optionalField.anotherField"`);
            });
        });

        describe("nameof.full with interface", () => {
            it("should output without the null assertion operator", () => {
                runTest("nameof.full<IState>(state => state.optionalField!.anotherField)", `"optionalField.anotherField"`);
            });
        });
    });

    describe("#20 - trailing comma with whitespace", () => {
        it("should output correctly", () => {
            runTest("nameof.full<IState>(state => state.field.dates, )", `"field.dates"`);
        });
    });
});
