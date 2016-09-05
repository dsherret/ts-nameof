import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import * as tsNameof from "./../main";

describe("stream()", () => {
    function runTest(fileName: string, expectedContents: string) {
        fileName = path.join(__dirname, "testFiles", fileName);
        let contents = "";

        before((done) => {
            fs.createReadStream(fileName)
                .pipe(tsNameof())
                .on("data", (buffer: Buffer) => {
                    contents += buffer.toString();
                })
                .on("end", () => {
                    done();
                });
        });

        it("should replace", () => {
            assert.equal(contents.replace(/\r?\n/g, "\n"), expectedContents.replace(/\r?\n/g, "\n"));
        });
    }

    describe("stream test file", () => {
        const expected =
`"window";
`;
        runTest("StreamTestFile.ts", expected);
    });

    describe("stream no nameof test file", () => {
        const expected =
`console.log("");
`;
        runTest("StreamNoNameofTestFile.ts", expected);
    });
});
