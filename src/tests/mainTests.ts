import { runTestOnAllMethods } from "./helpers";

runTestOnAllMethods(doTestsForMethod);

function doTestsForMethod(runTest: (text: string, expected: string) => void, runThrowsTest: (text: string, expectedMessage?: string) => void) {
    describe("nameof", () => {
        describe("argument", () => {
            it("should get the result of an identifier", () => {
                runTest(`nameof(myObj);`, `"myObj";`);
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

            it("should get nameof nameof", () => {
                runTest(`nameof(nameof);`, `"nameof";`);
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

            it("should include the brackets when getting an ambient declaration's property", () => {
                runTest(`nameof<MyInterface>(i => i.prop[0]);`, `"prop[0]";`);
            });

            it("should include the nested brackets when getting an ambient declaration's property", () => {
                runTest(`nameof<MyInterface>(i => i.prop[0][1]);`, `"prop[0][1]";`);
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

            it("should throw when the function doesn't have a period", () => {
                runThrowsTest(`nameof<MyInterface>(i => i);`);
            });

            it("should throw when the function doesn't have a return statement", () => {
                runThrowsTest(`nameof<MyInterface>(i => { i; });`, "Cound not find return statement with an expression in function expression: {\n    i;\n}");
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
                runThrowsTest("nameof.full(MyTest.Test, 'test')");
            });

            it("should throw when the periodIndex is greater than the number of periods", () => {
                runThrowsTest("nameof.full(MyTest.Test, 2)");
            });

            it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
                runThrowsTest("nameof.full(MyTest.Test, -3)");
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
                runThrowsTest("nameof.full<MyTest.Test>('test')");
            });

            it("should throw when the periodIndex is greater than the number of periods", () => {
                runThrowsTest("nameof.full<MyTest.Test>(2)");
            });

            it("should throw when the absolute value of the negative periodIndex is greater than the number of periods + 1", () => {
                runThrowsTest("nameof.full<MyTest.Test>(-3)");
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
                runThrowsTest(`nameof.full<MyInterface>(i => i);`);
            });
        });
    });

    describe("general", () => {
        it("should replace handling comments", () => {
            const input = `
nameof(window);
// nameof(window);
nameof(window);
/* nameof(window);
nameof(window);
*/
nameof(window);
`;
            const expected = `
"window";
// nameof(window);
"window";
/* nameof(window);
nameof(window);
*/
"window";
`;
            runTest(input, expected);
        });

        it("should replace handling strings", () => {
            const input = `
nameof(window);
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
            const expected = `
"window";
const t = /\`/g;
\`nameof(window); /
$\{"window"\}
$\{"alert"\}
nameof(window);
\`; //test
"nameof(window);";
"\\"nameof(window);";
'nameof(window);';
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
}
