import * as assert from "assert";
import {StringIterator} from "./../StringIterator";
import {handleNameOf, tryHandleFunctionName, tryHandleFullProperty, tryGetTypeArgText, tryGetArgText} from "./../handleNameOf";
import {testReplaceInfo} from "./testReplaceInfo";

describe("handleNameOf", () => {
    describe("#handleNameOf()", () => {
        function runHandleNameOfTests(opts: {
            iterator: StringIterator,
            expected: { typeArgText: string; argText: string; showFull?: boolean; }
        }) {
            const {iterator} = opts;
            const {typeArgText, argText, showFull = false} = opts.expected;
            const result = handleNameOf(iterator);

            testReplaceInfo(result!, {
                pos: 0,
                end: iterator.getLength(),
                typeArgText,
                argText,
                showFull
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        }

        describe("finding a nameof with a type arg and arg text", () => {
            const iterator = new StringIterator("nameof<typeArg>(argText)");

            runHandleNameOfTests({
                iterator,
                expected: {
                    typeArgText: "typeArg",
                    argText: "argText"
                }
            });
        });

        describe("finding a nameof with a type arg and arg text with spaces", () => {
            const iterator = new StringIterator("nameof   <  typeArg  >  (  argText  )");

            runHandleNameOfTests({
                iterator,
                expected: {
                    typeArgText: "typeArg",
                    argText: "argText"
                }
            });
        });

        describe("finding a nameof.full with a type arg and arg text", () => {
            const iterator = new StringIterator("nameof.full<typeArg>(argText)");

            runHandleNameOfTests({
                iterator,
                expected: {
                    typeArgText: "typeArg",
                    argText: "argText",
                    showFull: true
                }
            });
        });

        describe("finding a nameof with a type arg and arg text with spaces", () => {
            const iterator = new StringIterator("nameof  .  full  <  typeArg  >  (  argText  )");

            runHandleNameOfTests({
                iterator,
                expected: {
                    typeArgText: "typeArg",
                    argText: "argText",
                    showFull: true
                }
            });
        });

        describe("finding a nameof with a shorter function name", () => {
            const iterator = new StringIterator("name(argText)");
            const result = handleNameOf(iterator);

            it("should have a result of null", () => {
                assert.equal(result, null);
            });

            it("should have the iterator at the beginning", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding a nameof that matches, but has more text in the function name", () => {
            const iterator = new StringIterator("nameoft(argText)");
            const result = handleNameOf(iterator);

            it("should have a result of null", () => {
                assert.equal(result, null);
            });

            it("should have the iterator at the beginning", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });
    });

    describe("#tryHandleFunctionName()", () => {
        describe("finding the name", () => {
            const text = "nameof";
            const iterator = new StringIterator(text);
            const result = tryHandleFunctionName(iterator);

            it("should return true", () => {
                assert.equal(result, true);
            });

            it("should have the iterator at the end of the name", () => {
                assert.equal(iterator.getCurrentIndex(), text.length);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding part of the name", () => {
            const iterator = new StringIterator("nameo");
            const result = tryHandleFunctionName(iterator);

            it("should return false", () => {
                assert.equal(result, false);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("not finding the name", () => {
            const iterator = new StringIterator("anameof");
            const result = tryHandleFunctionName(iterator);

            it("should return false", () => {
                assert.equal(result, false);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });
    });

    describe("#tryHandleFullProperty()", () => {
        describe("finding the property", () => {
            const text = ".full";
            const iterator = new StringIterator(text);
            const result = tryHandleFullProperty(iterator);

            it("should return true", () => {
                assert.equal(result, true);
            });

            it("should have the iterator at the end of the name", () => {
                assert.equal(iterator.getCurrentIndex(), text.length);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding the property when there are spaces after the period", () => {
            const text = ". \tfull";
            const iterator = new StringIterator(text);
            const result = tryHandleFullProperty(iterator);

            it("should return true", () => {
                assert.equal(result, true);
            });

            it("should have the iterator at the end of the name", () => {
                assert.equal(iterator.getCurrentIndex(), text.length);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding part of the property", () => {
            const iterator = new StringIterator(".ful");
            const result = tryHandleFullProperty(iterator);

            it("should return false", () => {
                assert.equal(result, false);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("not finding the property", () => {
            const iterator = new StringIterator("a.full");
            const result = tryHandleFullProperty(iterator);

            it("should return false", () => {
                assert.equal(result, false);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });
    });

    describe("#tryGetTypeArgText()", () => {
        describe("finding angle brackets", () => {
            const testText = "azAZ_.09!, ";
            const iterator = new StringIterator(`<${testText}>`);
            const resultText = tryGetTypeArgText(iterator);

            it("should have the text inside the angle brackets", () => {
                assert.equal(resultText, testText);
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding angle brackets within angle brackets", () => {
            const iterator = new StringIterator("<Array<string>>");
            const resultText = tryGetTypeArgText(iterator);

            it("should have the text inside the angle brackets", () => {
                assert.equal(resultText, "Array<string>");
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding start angle bracket, but invalid character", () => {
            const iterator = new StringIterator("<te#st>");

            it("should error when getting the type arg text", () => {
                assert.throws(() => {
                    tryGetTypeArgText(iterator);
                }, `Invalid character in nameof type argument: #`);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding start angle bracket, but not the end", () => {
            const iterator = new StringIterator("<te");

            it("should error when getting to the end of the text", () => {
                assert.throws(() => {
                    tryGetTypeArgText(iterator);
                }, `Invalid nameof at end of file.`);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("not finding angle brackets", () => {
            const iterator = new StringIterator("a<test>");
            const resultText = tryGetTypeArgText(iterator);

            it("should return empty text", () => {
                assert.equal(resultText, "");
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });
    });

    describe("#tryGetArgText()", () => {
        // todo: make the other tests like this (why didn't I do this before?)
        function runTryGetArgTextTests(opts: {
            iterator: StringIterator,
            expected: { errorMessage?: string; isValid?: boolean; text?: string; currentIndex: number; }
        }) {
            if (typeof opts.expected.errorMessage === "string") {
                it("should throw", () => {
                    assert.throws(() => {
                        tryGetArgText(opts.iterator);
                    });
                });
            }
            else {
                let resultText: string | undefined;
                let isValid: boolean;

                it("should not throw", () => {
                    assert.doesNotThrow(() => {
                        const result = tryGetArgText(opts.iterator);
                        resultText = result.argText;
                        isValid = result.isValid;
                    });
                });

                it("should have the same result text", () => {
                    assert.equal(resultText, opts.expected.text);
                });

                it("should have the same isValid", () => {
                    assert.equal(isValid, typeof opts.expected.isValid === "boolean" ? opts.expected.isValid : true);
                });
            }

            it("should have the same iterator current index", () => {
                assert.equal(opts.iterator.getCurrentIndex(), opts.expected.currentIndex);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(opts.iterator.getNumberStatesForTesting(), 0);
            });
        }

        describe("finding parens with valid text", () => {
            const testText = "azAZ_.09!, ";
            const iterator = new StringIterator(`(${testText})`);

            runTryGetArgTextTests({
                iterator,
                expected: {
                    text: testText,
                    currentIndex: iterator.getLength()
                }
            });
        });

        describe("finding parens with invalid text", () => {
            const iterator = new StringIterator(`(#)`);

            runTryGetArgTextTests({
                iterator,
                expected: {
                    errorMessage: "Invalid character in nameof argument: #",
                    currentIndex: 0
                }
            });
        });

        describe("finding parens without text", () => {
            const iterator = new StringIterator(`()`);

            runTryGetArgTextTests({
                iterator,
                expected: {
                    text: "",
                    currentIndex: iterator.getLength()
                }
            });
        });

        describe("finding start paren, but not the end", () => {
            const iterator = new StringIterator("(te");

            runTryGetArgTextTests({
                iterator,
                expected: {
                    errorMessage: "Invalid nameof at end of file.",
                    currentIndex: 0
                }
            });
        });

        describe("not finding parens", () => {
            const iterator = new StringIterator("a()");

            runTryGetArgTextTests({
                iterator,
                expected: {
                    isValid: false,
                    currentIndex: 0
                }
            });
        });

        describe("finding multiple parens", () => {
            const iterator = new StringIterator("(one(two))");

            runTryGetArgTextTests({
                iterator,
                expected: {
                    text: "one(two)",
                    currentIndex: iterator.getLength()
                }
            });
        });

        describe("finding arrow function", () => {
            const iterator = new StringIterator("(t => t.someProperty)");

            runTryGetArgTextTests({
                iterator,
                expected: {
                    text: "t => t.someProperty",
                    currentIndex: iterator.getLength()
                }
            });
        });

        describe("finding arrow function with parenthesis", () => {
            const iterator = new StringIterator("((t) => t.someProperty)");

            runTryGetArgTextTests({
                iterator,
                expected: {
                    text: "(t) => t.someProperty",
                    currentIndex: iterator.getLength()
                }
            });
        });

        describe("finding function expression", () => {
            const iterator = new StringIterator("(function(t) { return t.someProperty; })");

            runTryGetArgTextTests({
                iterator,
                expected: {
                    text: "function(t) { return t.someProperty; }",
                    currentIndex: iterator.getLength()
                }
            });
        });
    });
});
