import * as glob from "glob";
import {Promise} from "es6-promise";

export function getFileNamesFromGlobs(globs: string[]) {
    const promises = globs.map(g => getFileNamesFromGlob(g));

    return Promise.all(promises).then(values => values.reduce((a, b) => a.concat(b), []));
}

function getFileNamesFromGlob(globFileName: string) {
    return new Promise<string[]>((resolve, reject) => {
        glob(globFileName, (err, files) => {
            /* istanbul ignore if */
            if (err) {
                reject(err);
                return;
            }

            resolve(files);
        });
    });
}
