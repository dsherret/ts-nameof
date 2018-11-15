import * as assert from "assert";
import { StringIterator, handleComment } from "../../text";

describe("handleComment()", () => {
    it("should iterate while in a double shash comment going to the end of the iterator", () => {
        const iterator = new StringIterator("// comment");
        iterator.moveNext();
        handleComment(iterator);
        assert.equal(iterator.getCurrentIndex(), iterator.getLength());
    });

    it("should iterate while in a double shash comment going to the start of the next line", () => {
        const iterator = new StringIterator("// comment\nsecond line");
        iterator.moveNext();
        handleComment(iterator);
        assert.equal(iterator.getCurrentChar(), "s");
    });

    it("should iterate while in a slash star comment to the close of the comment", () => {
        const iterator = new StringIterator("/* testing */");
        iterator.moveNext();
        handleComment(iterator);
        assert.equal(iterator.getCurrentIndex(), iterator.getLength());
    });

    it("should iterate while in a slash star comment to the close of the comment when there's still more text", () => {
        const iterator = new StringIterator("/* testing */z");
        iterator.moveNext();
        handleComment(iterator);
        assert.equal(iterator.getCurrentChar(), "z");
    });

    it("should iterate while in a slash star comment with no close to the end of the iterator", () => {
        const iterator = new StringIterator("/* testing");
        iterator.moveNext();
        handleComment(iterator);
        assert.equal(iterator.getCurrentIndex(), iterator.getLength());
    });
});
