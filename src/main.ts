import { stream, replaceInText, replaceInFiles } from "./text";
import { transformerFactory } from "./transformation";

interface Api {
    stream(): NodeJS.ReadWriteStream;
    replaceInFiles(fileNames: string[], opts?: { encoding: string }, onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInFiles(fileNames: string[], onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInText(fileText: string): { fileText?: string; replaced: boolean; };
}

const api: Api = transformerFactory as any as Api;
api.stream = stream;
api.replaceInFiles = replaceInFiles;
api.replaceInText = replaceInText;

export = api;
