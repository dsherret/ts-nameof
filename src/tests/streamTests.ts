import * as gulp from "gulp";
import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";
import {Promise} from "es6-promise";
import * as tsNameof from "./../main";

describe("stream()", () => {
    function runTest(fileName: string, expectedContents: string) {
        fileName = path.join(__dirname, "testFiles", fileName);
        let contents = "";

        before((done) => {
            getContentsFromStream(fs.createReadStream(fileName))
                .then(readContents => {
                    contents = readContents;
                    done();
                });
        });

        it("should replace", () => {
            assert.equal(contents.replace(/\r?\n/g, "\n"), expectedContents.replace(/\r?\n/g, "\n"));
        });
    }

    function getContentsFromStream(stream: fs.ReadStream | NodeJS.ReadWriteStream) {
        return new Promise<string>((resolve, reject) => {
            let contents = "";

            stream.pipe(tsNameof())
                .on("data", (buffer: Buffer) => {
                    contents += buffer.toString();
                })
                .on("end", () => {
                    resolve(contents);
                });
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

    describe("gulp test file", () => {
        const expected =
`"window";
`;

        it("should get the contents for a gulp stream", (done) => {
            let gulpStream = gulp.src(path.join(__dirname, "testFiles", "StreamTestFile.ts")).pipe(tsNameof());
            getContentsFromStream(gulpStream).then(contents => {
                assert.equal(contents.replace(/\r?\n/g, "\n"), expected.replace(/\r?\n/g, "\n"));
                done();
            });
        });
        runTest("StreamTestFile.ts", expected);
    });
});
