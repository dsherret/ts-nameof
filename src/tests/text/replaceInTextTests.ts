import * as assert from "assert";
import { replaceInText } from "../../main";

describe("replaceInText", () => {
    it("should not replace when no nameof", () => {
        const result = replaceInText("some random text with no nameof in it");
        assert.equal(result.replaced, false);
        assert.equal(result.fileText, undefined);
    });

    it("should replace when there was a nameof", () => {
        const result = replaceInText("describe(nameof(myTest), () => {});");
        assert.equal(result.replaced, true);
        assert.equal(result.fileText, `describe("myTest", () => {});`);
    });
});
