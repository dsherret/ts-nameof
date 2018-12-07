import { replaceInFiles } from "../../../main";

export function replaceInFilesPromise(paths: string[]) {
    return new Promise<string>((resolve, reject) => {
        replaceInFiles(paths, { encoding: "utf-8" }, err => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}
