import * as fs from "fs";

export function readFile(filePath: string) {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
