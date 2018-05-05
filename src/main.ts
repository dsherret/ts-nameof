import * as fs from "fs";
import { getFileNamesFromGlobs, stream, replaceInText } from "./text";
import { transformerFactory } from "./transformation";

interface Api {
    stream(): NodeJS.ReadWriteStream;
    replaceInFiles(fileNames: string[], opts?: { encoding: string }, onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInFiles(fileNames: string[], onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInText(fileText: string): { fileText?: string; replaced: boolean; };
}

type OnFinishedType = (err?: NodeJS.ErrnoException) => void;

function replaceInFiles(fileNames: string[], onFinished?: OnFinishedType): void;
function replaceInFiles(fileNames: string[], opts?: { encoding?: string }, onFinished?: OnFinishedType): void;
function replaceInFiles(fileNames: string[], optsOrOnFinished?: { encoding?: string } | OnFinishedType, onFinishedParam?: OnFinishedType): void {
    const opts = { encoding: "utf8" };
    let onFinished: OnFinishedType = () => {};

    if (optsOrOnFinished instanceof Function)
        onFinished = optsOrOnFinished;
    else if (onFinishedParam instanceof Function)
        onFinished = onFinishedParam;

    if (optsOrOnFinished && !(optsOrOnFinished instanceof Function))
        opts.encoding = optsOrOnFinished.encoding || opts.encoding;

    getFileNamesFromGlobs(fileNames).then(globbedFileNames => doReplaceInFiles(globbedFileNames, opts.encoding)).then(() => {
        onFinished();
    }).catch(/*istanbul ignore next*/ err => {
        onFinished(err);
    });
}

let api: Api = transformerFactory as any as Api;
api.stream = stream;
api.replaceInFiles = replaceInFiles;
api.replaceInText = replaceInText;

export = api;

function doReplaceInFiles(fileNames: string[], encoding: string) {
    const promises: Promise<void>[] = [];

    fileNames.forEach(fileName => {
        promises.push(new Promise<void>((resolve, reject) => {
            let contents = "";
            fs.createReadStream(fileName, { encoding })
                .pipe(stream())
                .on("error", /* istanbul ignore next */ (e: any) => {
                    reject(e);
                })
                .on("data", (buffer: Buffer) => {
                    contents += buffer.toString();
                })
                .on("finish", () => {
                    fs.writeFile(fileName, contents, (writeErr) => {
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
