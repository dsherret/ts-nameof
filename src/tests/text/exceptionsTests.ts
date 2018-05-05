import * as assert from "assert";
import { replaceInText } from "../../text";

describe("periodIndex", () => {
    it("should throw when the periodIndex is not a number literal", () => {
        assert.throws(() => {
            replaceInText("nameof.full(MyTest.Test, 'test')");
        });
    });

    it("should throw when the periodIndex is greater than the number of periods", () => {
        assert.throws(() => {
            replaceInText("nameof.full(MyTest.Test, 2)");
        });
    });

    it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
        assert.throws(() => {
            replaceInText("nameof.full(MyTest.Test, -3)");
        });
    });
});
