import * as assert from "assert";
import * as prettier from "prettier";

/**
 * Runs tests across different compilers.
 * @param getTransformedText Function to get the transformed text.
 * @param options Options for running the tests.
 */
export function runCommonTests(getTransformedText: (text: string) => string, options: { commonPrefix?: string; } = {}) {
    describe("nameof", () => {
        describe("argument", () => {
            it("should get the result of an identifier", () => {
                runTest(`nameof(myObj);`, `"myObj";`);
            });

            it("should get the result of the this keyword", () => {
                runTest(`nameof(this);`, `"this";`);
            });

            it("should get the result of a property access expression", () => {
                runTest(`nameof(myObj.prop);`, `"prop";`);
            });

            it("should get the result of a property access expression with null assertion operators", () => {
                runTest(`nameof(myObj!.prop!);`, `"prop";`);
            });

            it("should get the result of an identifier with a dollar sign", () => {
                runTest(`nameof(myObj.$prop);`, `"$prop";`);
            });

            it("should resolve to string when nesting nameofs", () => {
                runTest(`nameof(nameof(testing));`, `"testing";`);
            });
        });

        describe("type parameter", () => {
            it("should get the result of an identifier", () => {
                runTest(`nameof<Test>();`, `"Test";`);
            });

            it("should get the result of a fully qualified name", () => {
                runTest(`nameof<This.Is.A.Test>();`, `"Test";`);
            });

            it("should get an identifier with a dollar sign", () => {
                runTest(`nameof<Test$>();`, `"Test$";`);
            });
        });

        describe("arrays", () => {
            it("should include the brackets", () => {
                runTest(`nameof(anyProp[0]);`, `"anyProp[0]";`);
            });

            it("should get after the period", () => {
                runTest(`nameof(anyProp[0].prop);`, `"prop";`);
            });

            it("should escape strings inside element access expressions", () => {
                runTest(`nameof(obj["prop"]);`, `"obj[\\"prop\\"]";`);
            });

            it("should include the brackets when getting an ambient declaration's property", () => {
                runTest(`nameof<MyInterface>(i => i.prop[0]);`, `"prop[0]";`);
            });

            it("should include the nested brackets when getting an ambient declaration's property", () => {
                runTest(`nameof<MyInterface>(i => i.prop[0][1]);`, `"prop[0][1]";`);
            });

            it("should include brackets nested in brackets", () => {
                runTest(`nameof<MyInterface>(i => i.prop[prop[0]]);`, `"prop[prop[0]]";`);
            });

            it("should not allow only an array", () => {
                runThrowTest(`nameof([0]);`);
            });
        });

        describe("with function", () => {
            it("should get the last string", () => {
                runTest(`nameof<MyInterface>(i => i.prop1.prop2);`, `"prop2";`);
            });

            it("should get from the return statement", () => {
                // no reason for people to do this, but don't bother complaining
                runTest(`nameof<MyInterface>(i => { console.log('test'); return i.prop1.prop2; });`, `"prop2";`);
            });

            it("should throw when using an element access expression directly on the object", () => {
                runThrowTest(`nameof<MyInterface>(i => i["prop1"]);`, `First accessed property must not be computed: (i) => i["prop1"]`);
            });

            it("should throw when the function doesn't have a period", () => {
                runThrowTest(`nameof<MyInterface>(i => i);`);
            });

            it("should throw when the function doesn't have a return statement", () => {
                const errorPrefix = "Cound not find return statement with an expression in function expression: ";
                const possibleMessages = [
                    errorPrefix + "{ i; }", // babel
                    errorPrefix + "{\n    i;\n}" // typescript
                ];
                runThrowTest(`nameof<MyInterface>(i => { i; });`, possibleMessages);
            });
        });

        describe("literals", () => {
            it("should leave the string literal as-is", () => {
                // this allows for nested nameofs
                runTest(`nameof("test");`, `"test";`);
            });

            it("should transform a numeric literal as a string", () => {
                runTest(`nameof(5);`, `"5";`);
            });
        });

        describe("other", () => {
            it("should ignore spread syntax", () => {
                runTest(`nameof(...test);`, `"test";`);
            });
        });
    });

    describe("nameof.full", () => {
        describe("argument", () => {
            it("should include everything when no count arg is provided", () => {
                runTest(`nameof.full(obj.prop.other);`, `"obj.prop.other";`);
            });

            it("should not include null assertion operators", () => {
                runTest(`nameof.full(obj!.prop!.other!);`, `"obj.prop.other";`);
            });

            it("should not include null assertion operators when also using element access expressions", () => {
                runTest(`nameof.full(obj!.prop![0].other!);`, `"obj.prop[0].other";`);
            });

            it("should escape string literals in element access expressions", () => {
                runTest(`nameof.full(obj.prop["other"]);`, `"obj.prop[\\"other\\"]";`);
            });

            it("should allow using a period index", () => {
                runTest("nameof.full(MyTest.Test.This, 1);", `"Test.This";`);
            });

            it("should allow using a period index of 0", () => {
                runTest("nameof.full(MyTest.Test.This, 0);", `"MyTest.Test.This";`);
            });

            it("should allow using a period index up to its max value", () => {
                runTest("nameof.full(MyTest.Test.This, 2);", `"This";`);
            });

            it("should allow using a negative period index", () => {
                runTest("nameof.full(MyTest.Test.This, -1);", `"This";`);
            });

            it("should allow using a negative period index to its max value", () => {
                runTest("nameof.full(MyTest.Test.This, -3);", `"MyTest.Test.This";`);
            });

            it("should throw when the periodIndex is not a number literal", () => {
                runThrowTest("nameof.full(MyTest.Test, 'test')");
            });

            it("should throw when the periodIndex is greater than the number of periods", () => {
                runThrowTest("nameof.full(MyTest.Test, 2)");
            });

            it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
                runThrowTest("nameof.full(MyTest.Test, -3)");
            });

            it("should resolve to string when nesting nameofs", () => {
                runTest(`nameof.full(nameof(testing));`, `"testing";`);
            });
        });

        describe("type parameter", () => {
            it("should include everything when no count arg is provided", () => {
                runTest(`nameof.full<Some.Test.Name>();`, `"Some.Test.Name";`);
            });

            it("should allow using a period index", () => {
                runTest("nameof.full<MyTest.Test.This>(1);", `"Test.This";`);
            });

            it("should allow using a period index of 0", () => {
                runTest("nameof.full<MyTest.Test.This>(0);", `"MyTest.Test.This";`);
            });

            it("should allow using a period index up to its max value", () => {
                runTest("nameof.full<MyTest.Test.This>(2);", `"This";`);
            });

            it("should allow using a negative period index", () => {
                runTest("nameof.full<MyTest.Test.This>(-1);", `"This";`);
            });

            it("should allow using a negative period index to its max value", () => {
                runTest("nameof.full<MyTest.Test.This>(-3);", `"MyTest.Test.This";`);
            });

            it("should throw when the periodIndex is not a number literal", () => {
                runThrowTest("nameof.full<MyTest.Test>('test')");
            });

            it("should throw when the periodIndex is greater than the number of periods", () => {
                runThrowTest("nameof.full<MyTest.Test>(2)");
            });

            it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
                runThrowTest("nameof.full<MyTest.Test>(-3)");
            });
        });

        describe("arrays", () => {
            it("should include the brackets", () => {
                runTest(`nameof.full(anyProp[0].myProp);`, `"anyProp[0].myProp";`);
            });
        });

        describe("with function", () => {
            it("should get the text", () => {
                runTest(`nameof.full<MyInterface>(i => i.prop1.prop2);`, `"prop1.prop2";`);
            });

            it("should get the text without the null assertion operator", () => {
                runTest(`nameof.full<MyInterface>(i => i.prop1!.prop2!);`, `"prop1.prop2";`);
            });

            it("should get the text when there's a trailing comma with whitespace", () => {
                runTest("nameof.full<IState>(state => state.field.dates, );", `"field.dates";`);
            });

            it("should get the text when using a function", () => {
                runTest(`nameof.full<MyInterface>(function(i) { return i.prop1.prop2; });`, `"prop1.prop2";`);
            });

            it("should get the text when providing a period", () => {
                runTest(`nameof.full<MyInterface>(i => i.prop1.prop2, 0);`, `"prop1.prop2";`);
                runTest(`nameof.full<MyInterface>(i => i.prop1.prop2, 1);`, `"prop2";`);
                runTest(`nameof.full<MyInterface>(i => i.prop1.prop2.prop3, -1);`, `"prop3";`);
            });

            it("should throw when the function doesn't have a period", () => {
                runThrowTest(`nameof.full<MyInterface>(i => i);`);
            });
        });
    });

    describe("general", () => {
        it("should error when specifying a different nameof property", () => {
            runThrowTest(`nameof.nonExistent()`, "Unsupported nameof call expression: nameof.nonExistent()");
        });

        it("should replace handling comments", () => {
            const input = `nameof(window);
// nameof(window);
nameof(window);
/* nameof(window); nameof(window); */
nameof(window);
`;
            const expected = `"window";
// nameof(window);
"window";
/* nameof(window); nameof(window); */
"window";
`;
            runTest(input, expected);
        });

        it("should replace handling strings", () => {
            const input = `nameof(window);
const t = /\`/g;
\`nameof(window); /
\${nameof(window)}
\${nameof(alert)}
nameof(window);
\`; //test
"nameof(window);";
"\\"nameof(window);";
'nameof(window);';
'\\'\\"nameof(window);';
"C:\\\\";
nameof(window);
\`\${() => {
  nameof(console);
}}\`;
`;
            const expected = `"window";
const t = /\`/g;
\`nameof(window); /
$\{"window"\}
$\{"alert"\}
nameof(window);
\`; //test
"nameof(window);";
"\\"nameof(window);";
"nameof(window);";
'\\'\\"nameof(window);';
"C:\\\\";
"window";
\`\${() => {
  "console";
}}\`;
`;
            runTest(input, expected);
        });

        it("should handle division operators", () => {
            const input = `const t = 2 / 1;\nnameof(testing);`;
            const expected = `const t = 2 / 1;\n"testing";`;
            runTest(input, expected);
        });
    });

    function runTest(text: string, expected: string) {
        if (options.commonPrefix != null)
            text = options.commonPrefix + text;

        const result = getTransformedText(text);
        if (!expected.endsWith("\n"))
            expected += "\n";
        assert.equal(prettier.format(result, { parser: "typescript" }), expected);
    }

    function runThrowTest(text: string, possibleExpectedMessages?: string | string[]) {
        if (options.commonPrefix != null)
            text = options.commonPrefix + text;

        // for some reason, assert.throws was not working
        try {
            getTransformedText(text);
        } catch (ex) {
            possibleExpectedMessages = getPossibleExpectedMessages();
            if (possibleExpectedMessages == null)
                return;

            const actualMessage = (ex as any).message;
            for (const message of possibleExpectedMessages) {
                if (message === actualMessage)
                    return;
            }

            throw new Error(`Expected the error message of ${actualMessage} to equal one of the following messages: ${possibleExpectedMessages}`);
        }

        throw new Error("Expected to throw");

        function getPossibleExpectedMessages() {
            const result = getAsArray();

            if (result == null)
                return undefined;

            for (let i = result.length - 1; i >= 0; i--) {
                result[i] = "[ts-nameof]: " + result[i];
                result.push("./ts-nameof.macro: " + result[i]);
            }

            return result;

            function getAsArray() {
                if (typeof possibleExpectedMessages === "string")
                    return [possibleExpectedMessages];
                if (possibleExpectedMessages instanceof Array)
                    return possibleExpectedMessages;
                return undefined;
            }
        }
    }

}
