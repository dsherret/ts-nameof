import * as path from "path";
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
                runThrowTest(`nameof<import('test')>();`, getNotSupportedErrorText("import(\"test\")"));
            });

            it("should throw when someone only uses an import type with typeof", () => {
                runThrowTest(`nameof<typeof import('test')>();`, getNotSupportedErrorText("typeof import(\"test\")"));
            });
        });

        describe("computed properties", () => {
            it("should not allow a computed property to be at the end with a number", () => {
                runThrowTest(`nameof(anyProp[0]);`, getFirstAccessedPropertyMustNotBeComputedErrorText(`anyProp[0]`));
            });

            it("should get after the period", () => {
                runTest(`nameof(anyProp[0].prop);`, `"prop";`);
            });

            it("should get the string inside the computed property", () => {
                runTest(`nameof(obj["prop"]);`, `"prop";`);
            });

            it("should get the string inside the computed property for a function", () => {
                runTest(`nameof<MyInterface>(i => i["prop"]);`, `"prop";`);
            });

            it("should not allow a computed property to be at the end with a number when using a function", () => {
                runThrowTest(`nameof<MyInterface>(i => i.prop[0]);`, getFirstAccessedPropertyMustNotBeComputedErrorText("(i) => i.prop[0]"));
            });

            it("should not allow an identifier nested in a computed property", () => {
                runThrowTest(`nameof<MyInterface>(i => i.prop[prop[0]]);`, getFirstAccessedPropertyMustNotBeComputedErrorText("(i) => i.prop[prop[0]]"));
            });
        });

        describe("array", () => {
            it("should not allow only an array", () => {
                runThrowTest(`nameof([0]);`, getNotSupportedErrorText("[0]"));
            });

            it("should allow getting an array's property", () => {
                runTest(`nameof([].length);`, `"length";`);
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

            it("should get when using an element access expression directly on the object", () => {
                runTest(`nameof<MyInterface>(i => i["prop1"]);`, `"prop1";`);
            });

            it("should throw when using an element access expression directly on the object and it is not a string", () => {
                runThrowTest(`nameof<MyInterface>(i => i[0]);`, getFirstAccessedPropertyMustNotBeComputedErrorText(`(i) => i[0]`));
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

        describe("interpolate", () => {
            it("should throw when providing nameof.interpolate to nameof", () => {
                runThrowTest(`nameof(nameof.interpolate(5));`, [
                    getNotSupportedErrorText("nameof.interpolate(5)"),
                    // it will be this for babel because it checks the parent nodes
                    getUnusedNameofInterpolateErrorText("5")
                ]);
            });
        });

        describe("template expression", () => {
            it("should return a no substitution template literal", () => {
                runTest("nameof(`testing`);", "`testing`;");
            });

            it("should return the template expression when it has only a template tail", () => {
                runTest("nameof(`testing${test}final`);", "`testing${test}final`;");
            });

            it("should return the template expression when it has a template middle", () => {
                runTest("nameof(`testing${other}asdf${test}${asdf}final`);", "`testing${other}asdf${test}${asdf}final`;");
            });

            it("should return the template expression when it starts and ends with one", () => {
                runTest("nameof(`${other}`);", "`${other}`;");
            });

            it("should return the template expression when it starts and ends with multiple", () => {
                runTest("nameof(`${other}${asdf}${test}`);", "`${other}${asdf}${test}`;");
            });

            it("should throw when a nameof.interpolate is not used", () => {
                runThrowTest("nameof(`${nameof.interpolate(other)}`);", getUnusedNameofInterpolateErrorText("other"));
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

            it("should get the result of the super keyword", () => {
                runTest(
                    `class Test {\n  constructor() {\n    nameof.full(super.test);\n  }\n}`,
                    `class Test {\n  constructor() {\n    "super.test";\n  }\n}`
                );
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
                runThrowTest(`nameof.full<import('test').other.test>();`, getNotSupportedErrorText("import(\"test\").other.test"));
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

            it("should throw when someone nests a function within a function", () => {
                runThrowTest(`nameof.full<MyInterface>(i => () => 5);`, "A property must be accessed on the object: (i) => () => 5");
            });
        });

        describe("interpolate", () => {
            const singleArgumentErrorMessage = "Unexpected scenario where a nameof.interpolate function did not have a single argument.";

            it("should interpolate the provided expression", () => {
                runTest(`nameof.full(Test.Other[nameof.interpolate(other)]);`, "`Test.Other[${other}]`;");
            });

            it("should interpolate when using a function", () => {
                runTest(`nameof.full<a>(a => a.b.c[nameof.interpolate(index)].d);`, "`b.c[${index}].d`;");
            });

            it("should throw when the interpolate function has zero arguments", () => {
                runThrowTest(`nameof.full(Test.Other[nameof.interpolate()]);`, singleArgumentErrorMessage);
            });

            it("should throw when the interpolate function has multiple arguments", () => {
                runThrowTest(`nameof.full(Test.Other[nameof.interpolate(test, test)]);`, singleArgumentErrorMessage);
            });

            it("should throw when a nameof.interpolate is not used inside a nameof.full", () => {
                runThrowTest("nameof.interpolate(some.expression);", getUnusedNameofInterpolateErrorText("some.expression"));
            });

            it("should handle the scenarios in issue #104", () => {
                runTest("nameof.full(m.Data[nameof.interpolate(i)].Title);", "`m.Data[${i}].Title`;");
                runTest("nameof.full(m.Data[i].Title);", `"m.Data[i].Title";`);
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
                "Unsupported toArray call expression. An array must be returned by the provided function: nameof.toArray<MyInterface>((o) => o.Prop1)"
            );
        });

        it("should throw when no arguments are provided", () => {
            runThrowTest(`nameof.toArray<MyInterface>();`, "Unable to parse call expression. No arguments provided: nameof.toArray<MyInterface>()");
        });
    });

    describe("split", () => {
        it("should return an array of values where each element is a subsequent part of the path provided", () => {
            runTest(`nameof.split<MyInterface>(o => o.Prop1.Prop2.Prop3);`, `["Prop1", "Prop2", "Prop3"];`);
        });

        it("should return an array of values where each element is a subsequent part of the path provided", () => {
            runTest(`nameof.split(o.Prop1.Prop2.Prop3);`, `["o", "Prop1", "Prop2", "Prop3"];`);
        });

        it("should allow using a period index", () => {
            runTest(`nameof.split(MyTest.Test.This, 1);`, `["Test", "This"];`);
        });

        it("should allow using a period index of 0", () => {
            runTest(`nameof.split(MyTest.Test.This, 0);`, `["MyTest", "Test", "This"];`);
        });

        it("should allow using a period index up to its max value", () => {
            runTest(`nameof.split(MyTest.Test.This, 2);`, `["This"];`);
        });

        it("should allow using a negative period index", () => {
            runTest(`nameof.split(MyTest.Test.This, -1);`, `["This"];`);
        });

        it("should allow using a negative period index to its max value", () => {
            runTest(`nameof.split(MyTest.Test.This, -3);`, `["MyTest", "Test", "This"];`);
        });

        it("should throw when the periodIndex is not a number literal", () => {
            runThrowTest(`nameof.split(MyTest.Test, 'test')`, `Expected count to be a number, but was: "test"`);
        });

        it("should throw when the periodIndex is greater than the number of periods", () => {
            runThrowTest(`nameof.split(MyTest.Test, 2)`, "Count of 2 was larger than max count of 1: nameof.split(MyTest.Test, 2)");
        });

        it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
            runThrowTest(`nameof.split(MyTest.Test, -3)`, "Count of -3 was larger than max count of -2: nameof.split(MyTest.Test, -3)");
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

    function runThrowTest(text: string, possibleExpectedMessages: string | string[]) {
        if (options.commonPrefix != null)
            text = options.commonPrefix + text;
        let transformedText: string | undefined;

        // for some reason, assert.throws was not working
        try {
            transformedText = getTransformedText(text);
        } catch (ex) {
            possibleExpectedMessages = getPossibleExpectedMessages();

            const actualMessage = (ex as any).message;
            for (const message of possibleExpectedMessages) {
                if (message === actualMessage)
                    return;
            }

            throw new Error(`Expected the error message of ${JSON.stringify(actualMessage)} to equal `
                + `one of the following messages: ${JSON.stringify(possibleExpectedMessages)}`);
        }

        throw new Error(`Expected to throw, but returned: ${transformedText}`);

        function getPossibleExpectedMessages() {
            const result = getAsArray();

            for (let i = result.length - 1; i >= 0; i--) {
                const originalText = result[i];
                result[i] = "[ts-nameof]: " + originalText;
                // ts
                result.push("[ts-nameof:/file.ts]: " + originalText);
                // babel
                const babelPath = path.resolve(__dirname, "../../transforms-babel/src/tests/test.ts");
                // todo: temporary... switch to one path in the year 2021 (old versions of babel won't have the prefixed path)
                result.push(`${babelPath}: [ts-nameof:${babelPath}]: ${originalText}`);
                // babel macro (not ideal, but whatever)
                result.push(`${path.resolve(__dirname, "../../ts-nameof.macro/src/tests/test.ts")}: ./ts-nameof.macro: [ts-nameof]: ${originalText}`);
            }

            return result;

            function getAsArray() {
                if (typeof possibleExpectedMessages === "string")
                    return [possibleExpectedMessages];
                return possibleExpectedMessages;
            }
        }
    }
}

function getFirstAccessedPropertyMustNotBeComputedErrorText(nodeText: string) {
    return `First accessed property must not be computed except if providing a string: ${nodeText}`;
}

function getNotSupportedErrorText(nodeText: string) {
    return `The node \`${nodeText}\` is not supported in this scenario.`;
}

function getUnusedNameofInterpolateErrorText(nodeText: string) {
    return `Found a nameof.interpolate that did not exist within a nameof.full call expression: nameof.interpolate(${nodeText})`;
}
