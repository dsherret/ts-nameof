import * as path from "path";

export function getTestFilePath(...paths: string[]) {
  return path.join("./temp/testFiles", ...paths);
}
