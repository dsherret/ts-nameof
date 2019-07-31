import * as assert from "assert";
import * as prettier from "prettier";

/**
 * Runs tests across different compilers.
 * @param getTransformedText Function to get the transformed text.
 * @param options Options for running the tests.
 */
export function runCommonTests(getTransformedText: (text: string) => string, options: { commonPrefix?: string; } = {}) {
    describe("nameof", () => {
        describe("bad call expressions", () => {
            it("should throw if someone does not provide arguments or type arguments", () => {
                runThrowTest("nameof();", "Call expression must have one argument or type argument: nameof()");
            });
        });

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

            it("should get the result of an expression with a parenthesized expression", () => {
                runTest(`nameof((myObj).prop);`, `"prop";`);
            });

            it("should get the result of an expression with a type assertion", () => {
                runTest(`nameof((myObj as any).prop);`, `"prop";`);
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

            it("should handle when someone uses an import type as not the last node", () => {
                runTest(`nameof<import('test').prop>();`, `"prop";`);
            });

            it("should throw when someone only uses an import type", () => {
                runThrowTest(`nameof<import('test')>();`, "The node `import(\"test\")` is not supported in this scenario.");
            });

            it("should throw when someone only uses an import type with typeof", () => {
                runThrowTest(`nameof<typeof import('test')>();`, "The node `typeof import(\"test\")` is not supported in this scenario.");
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

            it("should handle when someone uses an import type", () => {
                runTest(`nameof<import('test')>(x => x.Foo);`, `"Foo";`);
            });

            it("should throw when using an element access expression directly on the object", () => {
                runThrowTest(`nameof<MyInterface>(i => i["prop1"]);`, `First accessed property must not be computed: (i) => i["prop1"]`);
            });

            it("should throw when the function doesn't have a period", () => {
                runThrowTest(`nameof<MyInterface>(i => i);`, "A property must be accessed on the object: (i) => i");
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
        describe("bad call expressions", () => {
            it("should throw if someone does not provide arguments or type arguments", () => {
                runThrowTest("nameof.full();", "Unsupported use of nameof.full: nameof.full()");
            });
        });

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
                runThrowTest("nameof.full(MyTest.Test, 'test')", `Expected count to be a number, but was: "test"`);
            });

            it("should throw when the periodIndex is greater than the number of periods", () => {
                runThrowTest("nameof.full(MyTest.Test, 2)", "Count of 2 was larger than max count of 1: nameof.full(MyTest.Test, 2)");
            });

            it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
                runThrowTest("nameof.full(MyTest.Test, -3)", "Count of -3 was larger than max count of -2: nameof.full(MyTest.Test, -3)");
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
                runThrowTest("nameof.full<MyTest.Test>('test')", `Expected count to be a number, but was: "test"`);
            });

            it("should throw when the periodIndex is greater than the number of periods", () => {
                runThrowTest("nameof.full<MyTest.Test>(2)", "Count of 2 was larger than max count of 1: nameof.full<MyTest.Test>(2)");
            });

            it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
                runThrowTest("nameof.full<MyTest.Test>(-3)", "Count of -3 was larger than max count of -2: nameof.full<MyTest.Test>(-3)");
            });

            it("should throw when someone uses an import type", () => {
                runThrowTest(`nameof.full<import('test').other.test>();`, "The node `import(\"test\").other.test` is not supported in this scenario.");
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
                runThrowTest(`nameof.full<MyInterface>(i => i);`, "A property must be accessed on the object: (i) => i");
            });
        });
    });

    describe("toArray", () => {
        it("should return an array of values when given a function that returns an array as input", () => {
            runTest(`nameof.toArray<MyInterface>(o => [o.Prop1, o.Prop2, o.Prop3]);`, `["Prop1", "Prop2", "Prop3"];`);
        });

        it("should return an array of values when given multiple arguments", () => {
            runTest(`nameof.toArray(myObject.Prop1, otherObject.Prop2);`, `["Prop1", "Prop2"];`);
        });

        it("should return an array with a single element if a non-function argument is passed", () => {
            runTest(`nameof.toArray(myObject.Prop1);`, `["Prop1"];`);
        });

        it("should support nested nameof calls", () => {
            runTest(`nameof.toArray(nameof.full(Some.Qualified.Name), Some.Qualified.Name);`, `["Some.Qualified.Name", "Name"];`);
        });

        it("should support a non-arrow function expression", () => {
            runTest(`nameof.toArray<MyInterface>(function(o) { return [o.Prop1, o.Prop2]; });`, `["Prop1", "Prop2"];`);
        });

        it("should throw when the function argument does not return an array", () => {
            runThrowTest(
                `nameof.toArray<MyInterface>(o => o.Prop1);`,
                "Unsupported toArray call expression, an array must be returned by the provided function: nameof.toArray<MyInterface>((o) => o.Prop1)"
            );
        });

        it("should throw when no arguments are provided", () => {
            runThrowTest(`nameof.toArray<MyInterface>();`, "Unable to parse call expression, no arguments provided: nameof.toArray<MyInterface>()");
        });
    });

    describe("general", () => {
        it("should error when specifying a different nameof property", () => {
            runThrowTest(`nameof.nonExistent()`, "Unsupported nameof call expression with property 'nonExistent': nameof.nonExistent()");
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
        let transformedText: string | undefined;

        // for some reason, assert.throws was not working
        try {
            transformedText = getTransformedText(text);
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

        throw new Error(`Expected to throw, but returned: ${transformedText}`);

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
