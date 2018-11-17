import * as ts from "typescript";
import { replaceInText, replaceInFiles } from "./text";
import { transformerFactory } from "./transformation";

interface Api {
    (): ts.TransformerFactory<ts.SourceFile>;
    replaceInFiles(fileNames: string[], opts?: { encoding: string }, onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInFiles(fileNames: string[], onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInText(fileName: string, fileText: string): { fileText?: string; replaced: boolean; };
}

const api: Api = transformerFactory as any as Api;
api.replaceInFiles = replaceInFiles;
api.replaceInText = replaceInText;

export = api;
