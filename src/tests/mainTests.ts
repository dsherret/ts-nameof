import * as assert from "assert";
import * as fs from "fs";
import {replaceInFiles, replaceInText} from "../main";
import {getTestFilePath} from "./getTestFilePath";

describe("replaceInFiles()", () => {
    function runTest(fileName: string, expectedContents: string) {
        fileName = getTestFilePath(fileName);

        before((done: MochaDone) => {
            replaceInFiles([fileName], () => done());
        });

        it("should replace", () => {
            const data = fs.readFileSync(fileName, "utf-8");
            assert.equal(data.replace(/\r?\n/g, "\n"), expectedContents.replace(/\r?\n/g, "\n"));
        });
    }

    describe("glob support", () => {
        const fileName = getTestFilePath("globFolder/MyGlobTestFile.js");

        before((done: MochaDone) => {
            replaceInFiles([getTestFilePath("globFolder/**/*.js")], () => done());
        });

        it("should replace in MyGlobTestFile.js", () => {
            const data = fs.readFileSync(fileName, "utf-8");
            const expected =
`console.log("console");
`;

            assert.equal(data.replace(/\r?\n/g, "\n"), expected.replace(/\r?\n/g, "\n"));
        });
    });

    describe("general file", () => {
        it("should have the correct number of characters", () => {
            // because an IDE might auto-format the code, this makes sure that hasn't happened
            assert.equal(fs.readFileSync(getTestFilePath("GeneralTestFile.txt"), "utf-8").replace(/\r?\n/g, "\n").length, 1121);
        });

        const expected =
`console.log("alert");
console.log("alert");
console.log("window.alert");
console.log("window.alert");
console.log("window.alert.length");
console.log("alert.length");
console.log("length");
console.log("window.alert.length");
console.log("alert.length");
console.log("length");
console.log( "window" );
console.log(  "window" );
console.log("nameof(nameof(clearTimeout))");
console.log("Array");
console.log("Array");
console.log("prop");
console.log("prop");
console.log("prop");
console.log("MyNamespace.MyInnerInterface");
console.log("MyNamespace.MyInnerInterface");
console.log("MyInnerInterface");
console.log("MyNamespace.MyInnerInterface");
console.log("MyInnerInterface");
`;

        describe("file modifying test", () => {
            runTest("GeneralTestFile.txt", expected);
        });
    });

    describe("interface file", () => {
        const expected =
`"MyInterface";
console.log("MyInterface");
console.log("Array");
"MyInnerInterface";
"MyNamespace.MyInnerInterface";
`;

        runTest("InterfaceTestFile.txt", expected);
    });

    describe("single statement test file", () => {
        const expected =
`"window";
`;
        runTest("SingleStatementTestFile.txt", expected);
    });

    describe("comments test file", () => {
        const expected =
`"window";
// nameof(window);
"window";
/* nameof(window);
nameof(window);
*/
"window";
`;
        runTest("CommentsTestFile.txt", expected);
    });

    describe("strings test file", () => {
        const expected =
`"window";
\`nameof(window);
$\{"window"\}
$\{ "alert" \}
nameof(window);
\`;
"nameof(window);";
"\\"nameof(window);";
'nameof(window);';
'\\'\\"nameof(window);';
"C:\\\\";
"window";
\`\${() => { "console"; }}\`;
`;
        runTest("StringsTestFile.txt", expected);
    });

    describe("replaceInText", () => {
        it("should not replace when no nameof", () => {
            const result = replaceInText("some random text with no nameof in it");
            assert.equal(result.replaced, false);
            assert.equal(result.fileText, undefined);
        });

        it("should replace when there was a nameof", () => {
            const result = replaceInText("describe(nameof(myTest), () => {});");
            assert.equal(result.replaced, true);
            assert.equal(result.fileText, `describe("myTest", () => {});`);
        });
    });
});
