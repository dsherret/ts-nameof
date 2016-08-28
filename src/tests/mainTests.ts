import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import {replaceInFiles} from "./../main";

describe("replaceInFiles()", () => {
    describe("MyTestFile.js", () => {
        const fileName = path.join(__dirname, "testFiles/MyTestFile.js");
        before((done) => {
            replaceInFiles([fileName], () => done());
        });

        it("should replace in MyTestFile.js", () => {
            const data = fs.readFileSync(fileName, "utf-8");
            const expected =
`import * as fs from "fs";

var myVariable = "";

console.log("myVariable");
console.log("alert");

function withinFunction() {
    console.log("withinFunction");
}
`;

            assert.equal(data.replace(/\r?\n/g, "\n"), expected.replace(/\r?\n/g, "\n"));
        });
    });

    describe("glob support", () => {
        const fileName = path.join(__dirname, "testFiles/globFolder/MyGlobTestFile.js");

        before((done) => {
            replaceInFiles([path.join(__dirname, "testFiles/globFolder/**/*.js")], () => done());
        });

        it("should replace in MyGlobTestFile.js", () => {
            const data = fs.readFileSync(fileName, "utf-8");
            const expected =
`console.log("console");
`;

            assert.equal(data.replace(/\r?\n/g, "\n"), expected.replace(/\r?\n/g, "\n"));
        });
    });

    describe("interface file", () => {
        const fileName = path.join(__dirname, "testFiles/InterfaceTestFile.ts");

        before((done) => {
            replaceInFiles([fileName], () => done());
        });

        it("should replace in MyGlobTestFile.js", () => {
            const data = fs.readFileSync(fileName, "utf-8");
            const expected =
`interface MyInterface {
}

console.log("MyInterface");
`;

            assert.equal(data.replace(/\r?\n/g, "\n"), expected.replace(/\r?\n/g, "\n"));
        });
    });
});
