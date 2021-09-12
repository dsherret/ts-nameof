import { transformerFactory } from "@ts-nameof/transforms-ts";
import * as ts from "typescript";
import { replaceInFiles, replaceInText } from "./text";

interface Api {
    (): ts.TransformerFactory<ts.SourceFile>;
    replaceInFiles(fileNames: ReadonlyArray<string>): Promise<void[]>;
    replaceInText(fileName: string, fileText: string): { fileText?: string; replaced: boolean };
}

const api: Api = transformerFactory as any as Api;
api.replaceInFiles = replaceInFiles;
api.replaceInText = replaceInText;
// this is for ts-jest support... not ideal
(api as any).factory = () => transformerFactory;

export = api;
