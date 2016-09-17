import * as assert from "assert";
import {ReplaceInfo} from "./../ReplaceInfo";

export function testReplaceInfo(actual: ReplaceInfo, expected: ReplaceInfo) {
    it("it should have the same typeArgText", () => {
        assert.equal(actual.typeArgText, expected.typeArgText);
    });
    it("it should have the same argText", () => {
        assert.equal(actual.argText, expected.argText);
    });
    it("it should have the same pos", () => {
        assert.equal(actual.pos, expected.pos);
    });
    it("it should have the same end", () => {
        assert.equal(actual.end, expected.end);
    });
}
