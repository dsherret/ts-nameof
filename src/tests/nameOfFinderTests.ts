import * as assert from "assert";
import {NameOfFinder} from "./../NameOfFinder";
import {StringIterator} from "./../StringIterator";
import {ReplaceInfo} from "./../ReplaceInfo";

function testReplaceInfo(index: number, actual: ReplaceInfo, expected: ReplaceInfo) {
    describe(`nameof: ${index}`, () => {
        it("it should have the same angleText", () => {
            assert.equal(actual.angleText, expected.angleText);
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
    });
}

describe("NameOfFinder", () => {
    describe("#indexOfAll", () => {
        describe("at beginning and end of string", () => {
            const finder = new NameOfFinder(new StringIterator("nameof(str);nameof(t)"));
            const indexes = finder.indexOfAll();

            testReplaceInfo(0, indexes[0], {
                angleText: "",
                argText: "str",
                pos: 0,
                end: 11
            });
            testReplaceInfo(1, indexes[1], {
                angleText: "",
                argText: "t",
                pos: 12,
                end: 21
            });
        });
    });
});
