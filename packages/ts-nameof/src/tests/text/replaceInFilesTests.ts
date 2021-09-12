import * as assert from "assert";
import { replaceInFiles } from "../../text";
import { getTestFilePath, readFile, writeFile } from "./helpers";

describe("replaceInFiles()", () => {
  interface FileInfo {
    filePath: string;
    contents: string;
  }

  async function runTest(paths: string[], expectedFiles: FileInfo[]) {
    paths = paths.map(p => getTestFilePath(p));
    expectedFiles.forEach(f => f.filePath = getTestFilePath(f.filePath));

    const initialFiles = await Promise.all(expectedFiles.map(f =>
      readFile(f.filePath).then(data => ({
        filePath: f.filePath,
        contents: data,
      } as FileInfo))
    ));

    try {
      await replaceInFiles(paths);
      const readFilePromises = expectedFiles.map(f => readFile(f.filePath).then(data => ({ data, expectedContents: f.contents })));

      for (const promise of readFilePromises) {
        const { data, expectedContents } = await promise;
        assert.equal(data.replace(/\r?\n/g, "\n"), expectedContents.replace(/\r?\n/g, "\n"));
      }
    } finally {
      await Promise.all(initialFiles.map(f => writeFile(f.filePath, f.contents)));
    }
  }

  describe("glob support", () => {
    it("should replace in MyGlobTestFile.txt", async () => {
      await runTest(["globFolder/**/*.txt"], [{
        filePath: "globFolder/MyGlobTestFile.txt",
        contents: `console.log("console");\n`,
      }]);
    });
  });

  describe("general file", () => {
    it("should have the correct number of characters", async () => {
      // because an IDE might auto-format the code, this makes sure that hasn't happened
      assert.equal((await readFile(getTestFilePath("GeneralTestFile.txt"))).replace(/\r?\n/g, "\n").length, 1121);
    });

    const expected = `console.log("alert");
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
console.log("clearTimeout");
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
      it("should modify the file", async () => {
        await runTest(["GeneralTestFile.txt"], [{
          filePath: "GeneralTestFile.txt",
          contents: expected,
        }]);
      });
    });
  });
});
