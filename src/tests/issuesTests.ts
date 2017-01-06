import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import {replaceInFiles} from "./../main";

describe("replaceInFiles()", () => {
    function runTest(fileName: string, expectedFileName: string) {
        fileName = getTestFilePath(fileName);

        before((done: MochaDone) => {
            replaceInFiles([fileName], () => done());
        });

        it("should replace", () => {
            const data = fs.readFileSync(fileName, "utf-8");
            const expectedContents = fs.readFileSync(getTestFilePath(expectedFileName), "utf-8");
            assert.equal(data.replace(/\r?\n/g, "\n"), expectedContents.replace(/\r?\n/g, "\n"));
        });
    }

    function getTestFilePath(relativeFilePath: string) {
        return path.join(__dirname, "testFiles", relativeFilePath);
    }

    describe("issue 8", () => {
        runTest("issues/8-source.txt", "issues/8-expected.txt");
    });
});
