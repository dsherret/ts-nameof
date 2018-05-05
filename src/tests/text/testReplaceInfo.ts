import * as assert from "assert";
import { ReplaceInfo } from "../../text";

export function testReplaceInfo(actual: ReplaceInfo, expected: ReplaceInfo) {
    it("it should have the same typeArgText", () => {
        assert.equal(actual.typeArgText, expected.typeArgText);
    });
    it("it should have the same args", () => {
        assert.deepEqual(actual.args, expected.args || []);
    });
    it("it should have the same pos", () => {
        assert.equal(actual.pos, expected.pos);
    });
    it("it should have the same end", () => {
        assert.equal(actual.end, expected.end);
    });
    it("it should have the same showFull", () => {
        assert.equal(actual.showFull, expected.showFull);
    });
}
