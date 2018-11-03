import * as assert from "assert";
import * as fs from "fs";
import { replaceInFiles } from "../../main";
import { getTestFilePath } from "./helpers";

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
});
