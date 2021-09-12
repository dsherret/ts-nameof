import * as fs from "fs";

export function readFile(path: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

export function writeFile(path: string, contents: string) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, contents, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
