import * as assert from "assert";
import {StringIterator} from "../../text";

describe("StringIterator", () => {
    describe("#restoreLastState()", () => {
        it("should restore the saved state", () => {
            const iterator = new StringIterator("012");
            iterator.saveState();
            iterator.moveNext();
            iterator.restoreLastState();
            assert.equal(0, iterator.getCurrentIndex());
        });

        it("should restore for multiple save states", () => {
            const iterator = new StringIterator("012");
            iterator.saveState();
            iterator.moveNext();
            iterator.saveState();
            iterator.moveNext();
            assert.equal(2, iterator.getCurrentIndex());
            iterator.restoreLastState();
            assert.equal(1, iterator.getCurrentIndex());
            iterator.restoreLastState();
            assert.equal(0, iterator.getCurrentIndex());
        });

        it("should throw an error when restoring a non-existent state", () => {
            const iterator = new StringIterator("012");
            iterator.saveState();
            iterator.restoreLastState();

            assert.throws(() => {
                iterator.restoreLastState();
            });
        });
    });

    describe("#clearLastState()", () => {
        it("should clear for multiple save states", () => {
            const iterator = new StringIterator("012");
            iterator.saveState();
            iterator.moveNext();
            iterator.saveState();
            iterator.moveNext();
            assert.equal(2, iterator.getCurrentIndex());
            iterator.clearLastState();
            assert.equal(2, iterator.getCurrentIndex());
            iterator.restoreLastState();
            assert.equal(0, iterator.getCurrentIndex());
        });

        it("should throw an error when clearing a non-existent state", () => {
            const iterator = new StringIterator("012");
            iterator.saveState();
            iterator.clearLastState();

            assert.throws(() => {
                iterator.clearLastState();
            });
        });
    });

    describe("#passSpaces()", () => {
        it("should not change the index of there are no spaces to pass", () => {
            const iterator = new StringIterator("t    t");
            iterator.passSpaces();
            assert.equal(iterator.getCurrentIndex(), 0);
        });

        it("should pass all the spaces if there are spaces to pass", () => {
            const iterator = new StringIterator("\t   t");
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

        it("should error when getting the current char at the end of astring", () => {
            const iterator = new StringIterator("");
            assert.throws(() => {
                iterator.getCurrentChar();
            });
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

    describe("#getLastNonSpaceChar()", () => {
        it("should return null at the beginning of a string", () => {
            const iterator = new StringIterator("a\t\r\n b");
            assert.equal(iterator.getLastNonSpaceChar(), null);
        });

        it("should return the last non space char", () => {
            const iterator = new StringIterator("a\t\r\n b");
            iterator.moveNext();
            iterator.moveNext();
            iterator.moveNext();
            iterator.moveNext();
            iterator.moveNext();
            assert.equal(iterator.getCurrentChar(), "b");
            assert.equal(iterator.getLastNonSpaceChar(), "a");
        });
    });

    describe("#getLength()", () => {
        it("should get the correct length", () => {
            const iterator = new StringIterator("1234");
            assert.equal(iterator.getLength(), 4);
        });
    });
});
