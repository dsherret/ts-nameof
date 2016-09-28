import * as assert from "assert";
import {SlashCommentStateGenerator} from "./../SlashCommentStateGenerator";
import {CharStateInfo} from "./../CharStateInfo";

describe("SlashCommentStateGenerator", () => {
    describe("#getNextState(info)", () => {
        describe("last state being true", () => {
            describe("newline as last character", () => {
                it("should be true when next chars are not double slashes", () => {
                    const generator = new SlashCommentStateGenerator();
                    const info = new CharStateInfo("\n", "t//", [true]);

                    assert.equal(generator.getNextState(info), false);
                });

                it("should be true when next chars are double slashes", () => {
                    const generator = new SlashCommentStateGenerator();
                    const info = new CharStateInfo("\n", "//", [true]);

                    assert.equal(generator.getNextState(info), true);
                });
            });
        });

        describe("last state being false", () => {
            it("should be false when next chars are not double slashes", () => {
                const generator = new SlashCommentStateGenerator();
                const info = new CharStateInfo("c", "a//", [false]);

                assert.equal(generator.getNextState(info), false);
            });

            it("should be true when next chars are double slash", () => {
                const generator = new SlashCommentStateGenerator();
                const info = new CharStateInfo("c", "//", [false]);

                assert.equal(generator.getNextState(info), true);
            });
        });

        describe("last state is empty", () => {
            it("should be false when next chars are not double slashes", () => {
                const generator = new SlashCommentStateGenerator();
                const info = new CharStateInfo("", "a//", []);

                assert.equal(generator.getNextState(info), false);
            });

            it("should be true when next chars are double slash", () => {
                const generator = new SlashCommentStateGenerator();
                const info = new CharStateInfo("", "//", []);

                assert.equal(generator.getNextState(info), true);
            });
        });

        describe("next char is length 1", () => {
            it("should get the next state", () => {
                const generator = new SlashCommentStateGenerator();
                const info = new CharStateInfo("a", "a", [true]);

                assert.equal(generator.getNextState(info), true);
            });
        });

        describe("next char is length 0", () => {
            it("should throw an exception", () => {
                const generator = new SlashCommentStateGenerator();
                const info = new CharStateInfo("a", "", [true]);

                assert.throws(() => {
                    generator.getNextState(info);
                });
            });
        });
    });
});
