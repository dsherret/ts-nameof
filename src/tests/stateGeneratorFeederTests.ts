/*
import * as assert from "assert";
import {StateGeneratorFeeder} from "./../StateGeneratorFeeder";
import {StateGenerator} from "./../StateGenerator";

class MockStateGenerator extends StateGenerator {
    private stateVal = true;
    private shouldGetNextVal = true;

    setState(val: boolean) {
        this.stateVal = val;
    }

    setShouldGetNext(val: boolean) {
        this.shouldGetNextVal = val;
    }

    getNextState() {
        return this.stateVal;
    }

    shouldGetNext() {
        return this.shouldGetNextVal;
    }

    getCurrentChar() {
        return this.chars[0] || "";
    }
}

describe("StateGeneratorFeeder", () => {
    function assertCallbackNumber(actual: number, expected: number) {
        it("should have the expected number of callback", () => {
            assert.equal(actual, expected);
        });
    }

    function assertCurrentChar(actual: string, expected: string) {
        it("should have the expected current char", () => {
            assert.equal(actual, expected);
        });
    }

    describe("getNextStateAsync being called before feedNextChar while setShouldGetNext is true", () => {
        const stateGenerator = new MockStateGenerator();
        const stateGeneratorFeeder = new StateGeneratorFeeder(stateGenerator);
        let numberCallbacks = 0;
        const callback = () => numberCallbacks++;

        stateGenerator.setShouldGetNext(true);

        stateGeneratorFeeder.getNextStateAsync(callback);
        assertCallbackNumber(numberCallbacks, 0);

        stateGeneratorFeeder.feedNextChar("a");
        assertCallbackNumber(numberCallbacks, 1);
        assertCurrentChar(stateGenerator.getCurrentChar(), "");
    });

    describe("feedNextChar being called before getNextStateAsync while setShouldGetNext is true", () => {
        const stateGenerator = new MockStateGenerator();
        const stateGeneratorFeeder = new StateGeneratorFeeder(stateGenerator);
        let numberCallbacks = 0;
        const callback = () => numberCallbacks++;

        stateGenerator.setShouldGetNext(true);

        stateGeneratorFeeder.feedNextChar("a");
        assertCallbackNumber(numberCallbacks, 0);
        assertCurrentChar(stateGenerator.getCurrentChar(), "a");

        stateGeneratorFeeder.getNextStateAsync(callback);
        assertCallbackNumber(numberCallbacks, 1);
        assertCurrentChar(stateGenerator.getCurrentChar(), "");
    });

    describe("getNextStateAsync being called while setShouldGetNext is false then true", () => {
        const stateGenerator = new MockStateGenerator();
        const stateGeneratorFeeder = new StateGeneratorFeeder(stateGenerator);
        let numberCallbacks = 0;
        const callback = () => numberCallbacks++;

        stateGenerator.setShouldGetNext(false);

        stateGeneratorFeeder.getNextStateAsync(callback);
        assertCallbackNumber(numberCallbacks, 0);

        stateGeneratorFeeder.getNextStateAsync(callback);
        assertCallbackNumber(numberCallbacks, 0);

        stateGeneratorFeeder.feedNextChar("a");
        assertCallbackNumber(numberCallbacks, 0);
        assertCurrentChar(stateGenerator.getCurrentChar(), "a");

        stateGenerator.setShouldGetNext(true);

        stateGeneratorFeeder.feedNextChar("b");
        assertCallbackNumber(numberCallbacks, 2);
        assertCurrentChar(stateGenerator.getCurrentChar(), "");
    });

    describe("getting the state", () => {
        const stateGenerator = new MockStateGenerator();
        const stateGeneratorFeeder = new StateGeneratorFeeder(stateGenerator);

        stateGenerator.setShouldGetNext(true);
        stateGeneratorFeeder.feedNextChar("a");
        stateGeneratorFeeder.feedNextChar("b");
        stateGenerator.setState(true);
        stateGeneratorFeeder.getNextStateAsync(state => {
            it("should have a state of true", () => {
                assert.equal(state, true);
            });
        });
        stateGenerator.setState(false);
        stateGeneratorFeeder.getNextStateAsync(state => {
            it("should have a state of false", () => {
                assert.equal(state, false);
            });
        });
    });

    describe("calling doEndOfStream with no getters", () => {
        const stateGenerator = new MockStateGenerator();
        const stateGeneratorFeeder = new StateGeneratorFeeder(stateGenerator);

        stateGeneratorFeeder.feedNextChar("a");
        stateGeneratorFeeder.doEndOfStream();
        assertCurrentChar(stateGenerator.getCurrentChar(), "");
    });
});
*/
