import * as assert from "assert";
import {StateGenerator} from "./../StateGenerator";

class MockStateGenerator extends StateGenerator {
    getNextState() {
        return true;
    }

    shouldGetNext() {
        return true;
    }

    getChars() {
        return this.chars;
    }
}

describe("StateGeneratorFeeder", () => {
    describe("#constructor()", () => {
        it("should have an empty char string", () => {
            const generator = new MockStateGenerator();
            assert.equal(generator.getChars().length, 0);
        });
    });

    describe("#feedChar()", () => {
        it("should append to the chars string", () => {
            const generator = new MockStateGenerator();
            generator.feedChar("a");
            generator.feedChar("b");

            assert.equal(generator.getChars(), "ab");
        });
    });

    describe("#removeChar()", () => {
        it("should remove the first added char", () => {
            const generator = new MockStateGenerator();
            generator.feedChar("a");
            generator.feedChar("b");
            generator.removeChar();

            assert.equal(generator.getChars(), "b");
        });
    });

    describe("#hasNext()", () => {
        it("should be false when chars is empty", () => {
            const generator = new MockStateGenerator();

            assert.equal(generator.hasNext(), false);
        });

        it("should be true when chars has something", () => {
            const generator = new MockStateGenerator();
            generator.feedChar("a");

            assert.equal(generator.hasNext(), true);
        });
    });
});
