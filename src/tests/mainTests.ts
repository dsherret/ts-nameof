import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import {replaceInFiles} from "./../main";

describe("replaceInFiles()", () => {
    describe("MyTestFile.js", () => {
        const fileName = path.join(__dirname, "testFiles/MyTestFile.js");
        before(function(done) {
            replaceInFiles([fileName], () => done());
        });

        it("should replace in MyTestFile.js", () => {
            const data = fs.readFileSync(fileName, "utf-8");
            const expected =
`var myVariable = "";

console.log("myVariable");
console.log("alert");

function withinFunction() {
    console.log("withinFunction");
}
`;

            assert.equal(data.replace(/\r?\n/g, "\n"), expected.replace(/\r?\n/g, "\n"));
        });
    });
});
