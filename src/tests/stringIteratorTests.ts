import * as assert from "assert";
import {StringIterator} from "./../StringIterator";

describe("StringIterator", () => {
    describe("#passSpaces()", () => {
        it("should not change the index of there are no spaces to pass", () => {
            const iterator = new StringIterator("t    t");
            iterator.passSpaces();
            assert.equal(iterator.getCurrentIndex(), 0);
        });

        it("should pass all the spaces if there are spaces to pass", () => {
            const iterator = new StringIterator("    t");
            iterator.passSpaces();
            assert.equal(iterator.getCurrentIndex(), 4);
        });
    });

    describe("#canMoveNext()", () => {
        it("should be able to move to the next if not at the end", () => {
            const iterator = new StringIterator("a");
            assert.equal(iterator.canMoveNext(), true);
        });

        it("should not be able to move to the next if at the end", () => {
            const iterator = new StringIterator("a");
            iterator.moveNext();
            assert.equal(iterator.canMoveNext(), false);
        });
    });

    describe("#moveNext()", () => {
        it("should increase the index", () => {
            const iterator = new StringIterator("a");
            iterator.moveNext();
            assert.equal(iterator.getCurrentIndex(), 1);
        });

        it("should throw an error if moving past the end of the index", () => {
            const iterator = new StringIterator("");
            assert.throws(() => {
                iterator.moveNext();
            });
        });
    });

    describe("#getCurrentIndex()", () => {
        it("should have the current index", () => {
            const iterator = new StringIterator("ab");
            assert.equal(iterator.getCurrentIndex(), 0);
            iterator.moveNext();
            assert.equal(iterator.getCurrentIndex(), 1);
        });
    });

    describe("#getCurrentChar()", () => {
        it("should have the char of the current index", () => {
            const iterator = new StringIterator("ab");
            assert.equal(iterator.getCurrentChar(), "a");
            iterator.moveNext();
            assert.equal(iterator.getCurrentChar(), "b");
        });
    });

    describe("#getLastChar()", () => {
        it("should return null at the beginning of a string", () => {
            const iterator = new StringIterator("ab");
            assert.equal(iterator.getLastChar(), null);
        });

        it("should return the last char", () => {
            const iterator = new StringIterator("ab");
            iterator.moveNext();
            assert.equal(iterator.getLastChar(), "a");
        });
    });

    describe("#getLength()", () => {
        it("should get the correct length", () => {
            const iterator = new StringIterator("1234");
            assert.equal(iterator.getLength(), 4);
        });
    });
});
