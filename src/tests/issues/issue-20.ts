import * as assert from "assert";
import {replaceInText} from "./../../main";

describe("issue 20", () => {
    function runTest(text: string, expected: string) {
        const result = replaceInText(text);
        assert.equal(result.fileText || text, expected);
    }

    describe("trailing comma", () => {
        it("should output the right information when there's a trailing comma", () => {
            runTest("nameof.full<IState>(state => state.field.dates, )", `"field.dates"`);
        });
    });
});
