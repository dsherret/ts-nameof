import * as fs from "fs";
import {Promise} from "es6-promise";
import {getFileNamesFromGlobs} from "./getFileNamesFromGlobs";
import {NameOfFinder} from "./NameOfFinder";
import {replaceCallExpressionReplacesInText} from "./replaceCallExpressionReplacesInText";

// todo: cleanup

export function replaceInFiles(fileNames: string[], onFinished?: (err?: NodeJS.ErrnoException) => void) {
    getFileNamesFromGlobs(fileNames).then(doReplace).then(() => {
        if (onFinished) {
            onFinished();
        }
    }).catch(/*istanbul ignore next*/ err => {
        if (onFinished) {
            onFinished(err);
        }
    });
}

export function doReplace(fileNames: string[]) {
    const promises: Promise<void>[] = [];

    fileNames.forEach(fileName => {
        promises.push(new Promise<void>((resolve, reject) => {
            fs.readFile(fileName, "utf-8", (readErr, fileText) => {
                /* istanbul ignore if */
                if (readErr) {
                    reject(readErr);
                    return;
                }

                const finder = new NameOfFinder(fileText);
                const indexes = finder.indexOfAll();

                if (indexes.length === 0) {
                    resolve();
                    return;
                }

                fileText = replaceCallExpressionReplacesInText(indexes, fileText);

                fs.writeFile(fileName, fileText, (writeErr) => {
                    /* istanbul ignore if */
                    if (writeErr) {
                        reject(writeErr);
                        return;
                    }

                    resolve();
                });
            });
        }));
    });

    return Promise.all(promises);
}
