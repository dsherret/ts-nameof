import * as fs from "fs";
import { getFileNamesFromGlobs } from "./getFileNamesFromGlobs";
import { replaceInText } from "./replaceInText";

export function replaceInFiles(fileNames: ReadonlyArray<string>): Promise<void[]> {
  return getFileNamesFromGlobs(fileNames).then(globbedFileNames => doReplaceInFiles(globbedFileNames));
}

function doReplaceInFiles(fileNames: ReadonlyArray<string>) {
  const promises: Promise<void>[] = [];

  fileNames.forEach(fileName => {
    promises.push(
      new Promise<void>((resolve, reject) => {
        fs.readFile(fileName, { encoding: "utf8" }, (err, fileText) => {
          /* istanbul ignore if */
          if (err) {
            reject(err);
            return;
          }

          const result = replaceInText(fileName, fileText);

          if (result.replaced) {
            fs.writeFile(fileName, result.fileText!, writeErr => {
              /* istanbul ignore if */
              if (writeErr) {
                reject(writeErr);
                return;
              }

              resolve();
            });
          } else {
            resolve();
          }
        });
      }),
    );
  });

  return Promise.all(promises);
}
