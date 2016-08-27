import * as fs from "fs";
import {Promise} from "es6-promise";
import {FileInfo} from "./structures";
import {replaceCallExpressionReplacesInText} from "./replaceCallExpressionReplacesInText";

export function updateFileBasedOnFileInfo(fileInfo: FileInfo) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileInfo.fileName, "utf-8", (readErr, data) => {
            /* istanbul ignore if */
            if (readErr) {
                reject(readErr);
                return;
            }

            data = replaceCallExpressionReplacesInText(fileInfo.callExpressionReplaces, data);

            fs.writeFile(fileInfo.fileName, data, (writeErr) => {
                /* istanbul ignore if */
                if (writeErr) {
                    reject(writeErr);
                    return;
                }

                resolve();
            });
        });
    });
}
