import * as assert from "assert";
import {StringIterator} from "./../StringIterator";
import {handleNameOf, tryHandleFunctionName, tryHandleFullProperty, tryGetTypeArgText, tryGetArgText} from "./../handleNameOf";
import {testReplaceInfo} from "./testReplaceInfo";

describe("handleNameOf", () => {
    describe("#handleNameOf()", () => {
        describe("finding a nameof with a type arg and arg text", () => {
            const iterator = new StringIterator("nameof<typeArg>(argText)");
            const result = handleNameOf(iterator);

            testReplaceInfo(result!, {
                pos: 0,
                end: iterator.getLength(),
                typeArgText: "typeArg",
                argText: "argText",
                showFull: false
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding a nameof with a type arg and arg text with spaces", () => {
            const iterator = new StringIterator("nameof   <  typeArg  >  (  argText  )");
            const result = handleNameOf(iterator);

            testReplaceInfo(result!, {
                pos: 0,
                end: iterator.getLength(),
                typeArgText: "typeArg",
                argText: "argText",
                showFull: false
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding a nameof.full with a type arg and arg text", () => {
            const iterator = new StringIterator("nameof.full<typeArg>(argText)");
            const result = handleNameOf(iterator);

            testReplaceInfo(result!, {
                pos: 0,
                end: iterator.getLength(),
                typeArgText: "typeArg",
                argText: "argText",
                showFull: true
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding a nameof with a type arg and arg text with spaces", () => {
            const iterator = new StringIterator("nameof  .  full  <  typeArg  >  (  argText  )");
            const result = handleNameOf(iterator);

            testReplaceInfo(result!, {
                pos: 0,
                end: iterator.getLength(),
                typeArgText: "typeArg",
                argText: "argText",
                showFull: true
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding a nameof with invalid arg text", () => {
            const iterator = new StringIterator("nameof<,>(argText)");
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

        describe("finding a nameof with invalid arg text", () => {
            const iterator = new StringIterator("nameof(,)");
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

        describe("finding a nameof with invalid function name", () => {
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
            const testText = "azAZ_.09 ";
            const iterator = new StringIterator(`<${testText}>`);
            const result = tryGetTypeArgText(iterator);

            it("should be valid", () => {
                assert.equal(result.isValid, true);
            });

            it("should have the text inside the angle brackets", () => {
                assert.equal(result.text, testText);
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
            const result = tryGetTypeArgText(iterator);

            it("should be valid", () => {
                assert.equal(result.isValid, true);
            });

            it("should have the text inside the angle brackets", () => {
                assert.equal(result.text, "Array<string>");
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding start angle bracket, but invalid character", () => {
            const iterator = new StringIterator("<te,st>");
            const result = tryGetTypeArgText(iterator);

            it("should not be valid", () => {
                assert.equal(result.isValid, false);
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
            const result = tryGetTypeArgText(iterator);

            it("should not be valid", () => {
                assert.equal(result.isValid, false);
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
            const result = tryGetTypeArgText(iterator);

            it("should be valid", () => {
                assert.equal(result.isValid, true);
            });

            it("should not return any text", () => {
                assert.equal(result.text, undefined);
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
        describe("finding parens with text", () => {
            const testText = "azAZ_.09 ";
            const iterator = new StringIterator(`(${testText})`);
            const result = tryGetArgText(iterator);

            it("should be valid", () => {
                assert.equal(result.isValid, true);
            });

            it("should have the text inside the parenthesis", () => {
                assert.equal(result.text, testText);
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding parens without text", () => {
            const iterator = new StringIterator(`()`);
            const result = tryGetArgText(iterator);

            it("should be valid", () => {
                assert.equal(result.isValid, true);
            });

            it("should have an empty text", () => {
                assert.equal(result.text, "");
            });

            it("should have the iterator at the end", () => {
                assert.equal(iterator.getCurrentIndex(), iterator.getLength());
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding start paren, but invalid character", () => {
            const iterator = new StringIterator("(te,st)");
            const result = tryGetArgText(iterator);

            it("should not be valid", () => {
                assert.equal(result.isValid, false);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("finding start paren, but not the end", () => {
            const iterator = new StringIterator("(te");
            const result = tryGetArgText(iterator);

            it("should not be valid", () => {
                assert.equal(result.isValid, false);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });

        describe("not finding parens", () => {
            const iterator = new StringIterator("a()");
            const result = tryGetArgText(iterator);

            it("should not be valid", () => {
                assert.equal(result.isValid, false);
            });

            it("should not return any text", () => {
                assert.equal(result.text, undefined);
            });

            it("should have the iterator at the same location", () => {
                assert.equal(iterator.getCurrentIndex(), 0);
            });

            it("should have the iterator with zero states", () => {
                assert.equal(iterator.getNumberStatesForTesting(), 0);
            });
        });
    });
});
