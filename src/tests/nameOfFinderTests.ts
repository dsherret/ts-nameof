import * as assert from "assert";
import {NameOfFinder} from "./../NameOfFinder";
import {StringIterator} from "./../StringIterator";
import {testReplaceInfo} from "./testReplaceInfo";

describe("NameOfFinder", () => {
    describe("#indexOfAll", () => {
        describe("at beginning and end of string", () => {
            const finder = new NameOfFinder(new StringIterator("nameof(str);nameof(t)"));
            const indexes = finder.indexOfAll();

            describe("nameof: 0", () => {
                testReplaceInfo(indexes[0], {
                    typeArgText: "",
                    argText: "str",
                    pos: 0,
                    end: 11
                });
            });
            describe("nameof: 1", () => {
                testReplaceInfo(indexes[1], {
                    typeArgText: "",
                    argText: "t",
                    pos: 12,
                    end: 21
                });
            });
        });

        describe("name tests", () => {
            function startStringTest(startString: string) {
                const finder = new NameOfFinder(new StringIterator(startString + "nameof(str);"));
                const indexes = finder.indexOfAll();

                it("should not find anything", () => {
                    assert.equal(indexes.length, 0);
                });
            }

            describe("where there's an alpha char at the beginning", () => {
                startStringTest("a");
            });

            describe("where there's a number char at the beginning", () => {
                startStringTest("0");
            });

            describe("where there's an underscore char at the beginning", () => {
                startStringTest("_");
            });

            describe("where it's a property of an object", () => {
                startStringTest("test.");
            });

            describe("where it's a property of an object, but there's a space after the period", () => {
                startStringTest("test. \t\r");
            });
        });
    });
});
