import * as ts from "typescript";
import { replaceInText, replaceInFiles } from "./text";
import { transformerFactory } from "ts-nameof-transforms-ts";

interface Api {
    (): ts.TransformerFactory<ts.SourceFile>;
    replaceInFiles(fileNames: ReadonlyArray<string>, opts?: { encoding?: string }, onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInFiles(fileNames: ReadonlyArray<string>, onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    replaceInText(fileName: string, fileText: string): { fileText?: string; replaced: boolean; };
}

const api: Api = transformerFactory as any as Api;
api.replaceInFiles = replaceInFiles;
api.replaceInText = replaceInText;

export = api;
