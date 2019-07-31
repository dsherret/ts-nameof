import * as fs from "fs";
import { getFileNamesFromGlobs } from "./getFileNamesFromGlobs";
import { replaceInText } from "./replaceInText";

type OnFinishedCallback = (err?: NodeJS.ErrnoException) => void;

export function replaceInFiles(fileNames: ReadonlyArray<string>, onFinished?: OnFinishedCallback): void;
export function replaceInFiles(fileNames: ReadonlyArray<string>, opts?: { encoding?: string; }, onFinished?: OnFinishedCallback): void;
export function replaceInFiles(fileNames: ReadonlyArray<string>, optsOrOnFinished?: { encoding?: string; } | OnFinishedCallback,
    onFinishedParam?: OnFinishedCallback): void
{
    const opts = { encoding: "utf8" };
    let onFinished: OnFinishedCallback;

    if (optsOrOnFinished instanceof Function)
        onFinished = optsOrOnFinished;
    else if (onFinishedParam instanceof Function)
        onFinished = onFinishedParam;
    else
        onFinished = () => {};

    if (optsOrOnFinished && !(optsOrOnFinished instanceof Function))
        opts.encoding = optsOrOnFinished.encoding || opts.encoding;

    getFileNamesFromGlobs(fileNames).then(globbedFileNames => doReplaceInFiles(globbedFileNames, opts.encoding)).then(() => {
        onFinished();
    }).catch(/*istanbul ignore next*/ err => {
        onFinished(err);
    });
}

function doReplaceInFiles(fileNames: ReadonlyArray<string>, encoding: string) {
    const promises: Promise<void>[] = [];

    fileNames.forEach(fileName => {
        promises.push(new Promise<void>((resolve, reject) => {
            fs.readFile(fileName, { encoding }, (err, fileText) => {
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
                }
                else {
                    resolve();
                }
            });
        }));
    });

    return Promise.all(promises);
}
