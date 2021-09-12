import * as assert from "assert";
import { replaceInFiles } from "../../text";
import { getTestFilePath, readFile, writeFile } from "./helpers";

describe("replaceInFiles()", () => {
  async function runTest(fileName: string, expectedFileName: string) {
    fileName = getTestFilePath(fileName);
    expectedFileName = getTestFilePath(expectedFileName);

    const originalFileText = await readFile(expectedFileName);

    try {
      await replaceInFiles([fileName]);
      const data = await readFile(fileName);
      const expectedContents = await readFile(expectedFileName);
      assert.equal(data.replace(/\r?\n/g, "\n"), expectedContents.replace(/\r?\n/g, "\n"));
    } finally {
      await writeFile(expectedFileName, originalFileText);
    }
  }

  function runIssueTest(issueNumber: number) {
    describe(`issue ${issueNumber}`, () => {
      it("should replace", async () => {
        await runTest(`issues/${issueNumber}-source.txt`, `issues/${issueNumber}-expected.txt`);
      });
    });
  }

  runIssueTest(8);
  runIssueTest(11);
});
