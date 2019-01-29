import * as path from "path";
import { exec } from "child_process";
import { rootFolder } from "./config";

export function execScript(command: string, options: { cwd: string; }) {
    const cwd = path.join(rootFolder, options.cwd || "");
    return new Promise<string>((resolve, reject) => {
        exec(command, {
            cwd
        }, (err, stdout, stderr) => {
            if (err) {
                const result = stdout + "\n" + stderr;
                reject(result);
                return;
            }
            resolve(stdout);
        });
    });
}
