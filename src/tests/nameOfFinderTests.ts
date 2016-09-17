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
    });
});
