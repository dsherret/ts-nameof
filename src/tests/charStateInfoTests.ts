import * as assert from "assert";
import {CharStateInfo} from "./../CharStateInfo";

describe("CharStateInfo", () => {
    const previousChars = "abcd";
    const nextChars = "efgh";
    const previousStates = [true, false];
    const info = new CharStateInfo(previousChars, nextChars, previousStates);

    describe("constructor", () => {
        it("should put the previous chars in", () => {
            assert.equal(info.previousChars, previousChars);
        });

        it("should put the next chars in", () => {
            assert.equal(info.nextChars, nextChars);
        });

        it("should put the previous states in", () => {
            assert.equal(info.previousStates, previousStates);
        });
    });

    describe("#getPreviousCharsEquals()", () => {
        describe("not providing an offset", () => {
            it("should say the previous chars are equal when they're equal", () => {
                assert.equal(info.getPreviousCharsEquals("cd"), true);
            });

            it("should say the previous chars are not equal when they're not equal", () => {
                assert.equal(info.getPreviousCharsEquals("other"), false);
            });
        });

        describe("providing an offset", () => {
            it("should say the previous chars are equal when they're equal", () => {
                assert.equal(info.getPreviousCharsEquals("ab", 2), true);
            });
        });
    });

    describe("#getNextCharsEquals()", () => {
        describe("not providing an offset", () => {
            it("should say the next chars are equal when they're equal", () => {
                assert.equal(info.getNextCharsEquals("ef"), true);
            });

            it("should say the next chars are not equal when they're not equal", () => {
                assert.equal(info.getNextCharsEquals("other"), false);
            });
        });

        describe("providing an offset", () => {
            it("should say the next chars are equal when they're equal", () => {
                assert.equal(info.getNextCharsEquals("gh", 2), true);
            });
        });
    });

    describe("#getPreviousState()", () => {
        it("should get the previous state", () => {
            assert.equal(info.getPreviousState(), previousStates[0]);
        });
    });
});
