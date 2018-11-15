import * as fs from "fs";
import { getFileNamesFromGlobs } from "./getFileNamesFromGlobs";
import { stream } from "./stream";

type OnFinishedCallback = (err?: NodeJS.ErrnoException) => void;

export function replaceInFiles(fileNames: string[], onFinished?: OnFinishedCallback): void;
export function replaceInFiles(fileNames: string[], opts?: { encoding?: string }, onFinished?: OnFinishedCallback): void;
export function replaceInFiles(fileNames: string[], optsOrOnFinished?: { encoding?: string } | OnFinishedCallback, onFinishedParam?: OnFinishedCallback): void {
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

function doReplaceInFiles(fileNames: string[], encoding: string) {
    const promises: Promise<void>[] = [];

    fileNames.forEach(fileName => {
        promises.push(new Promise<void>((resolve, reject) => {
            let contents = "";
            fs.createReadStream(fileName, { encoding })
                .pipe(stream(fileName.toLowerCase().endsWith("tsx")))
                .on("error", /* istanbul ignore next */ (e: any) => {
                    reject(e);
                })
                .on("data", (buffer: Buffer) => {
                    contents += buffer.toString();
                })
                .on("finish", () => {
                    fs.writeFile(fileName, contents, writeErr => {
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
