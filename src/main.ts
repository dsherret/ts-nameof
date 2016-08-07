import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";

// todo: Clean and split up this file

const NAMEOF_DEFINITION_FILE_NAME = "ts-nameof.d.ts";

interface FileInfo {
    readonly fileName: string;
    readonly callExpressionReplaces: ReplaceInfo[];
}

interface ReplaceInfo {
    pos: number;
    end: number;
    readonly text: string;
}

export function replaceInFiles(fileNames: string[], onFinished?: (err?: NodeJS.ErrnoException) => void) {
    const compilerOptions: ts.CompilerOptions = {
        allowJs: true,
        experimentalDecorators: true
    };

    const program = ts.createProgram([...fileNames, path.join(__dirname, NAMEOF_DEFINITION_FILE_NAME)], compilerOptions);
    const typeChecker = program.getTypeChecker();
    const sourceFiles = program.getSourceFiles().filter(f => f.fileName.indexOf("/node_modules/") === -1);

    const nameOfSymbol = getNameOfFunctionSymbol(sourceFiles);
    const fileInfos = getFileInfos(sourceFiles, nameOfSymbol, typeChecker).filter(f => f.callExpressionReplaces.length > 0);
    let completeCount = 0;

    function tryOnFinished(err?: NodeJS.ErrnoException) {
        /* istanbul ignore else  */
        if (onFinished != null) {
            onFinished();
        }
    }

    function checkFinished() {
        if (fileInfos.length === completeCount) {
            tryOnFinished();
        }
    }

    for (let fileInfo of fileInfos) {
        fs.readFile(fileInfo.fileName, "utf-8", (readErr, data) => {
            /* istanbul ignore if  */
            if (readErr) {
                tryOnFinished(readErr);
            }

            data = replaceCallExpressionReplacesInText(fileInfo.callExpressionReplaces, data);

            fs.writeFile(fileInfo.fileName, data, (writeErr) => {
                /* istanbul ignore if  */
                if (writeErr) {
                    tryOnFinished(writeErr);
                }

                completeCount++;
                checkFinished();
            });
        });
    }

    checkFinished();
}

function getNameOfFunctionSymbol(sourceFiles: ts.SourceFile[]) {
    for (const file of sourceFiles) {
        if (file.fileName.indexOf(NAMEOF_DEFINITION_FILE_NAME) >= 0) {
            const symbol = (file as any).locals["nameof"] as ts.Symbol;
            /* istanbul ignore else  */
            if (symbol != null) {
                return symbol;
            }
        }
    }

    /* istanbul ignore next */
    throw new Error("Could not find definition file symbol.");
}

function getFileInfos(sourceFiles: ts.SourceFile[], nameOfSymbol: ts.Symbol, typeChecker: ts.TypeChecker) {
    return sourceFiles.map(file => {
        const fileInfo: FileInfo = {
            fileName: file.fileName,
            callExpressionReplaces: []
        };

        const nodes = getAllChildren(file);

        for (let node of nodes) {
            const isValidCallExpression = node.kind === ts.SyntaxKind.CallExpression &&
                typeChecker.getSymbolAtLocation((node as ts.CallExpression).expression) === nameOfSymbol &&
                (node as ts.CallExpression).arguments.length === 1;

            if (isValidCallExpression) {
                fileInfo.callExpressionReplaces.push({
                    pos: node.pos,
                    end: node.end,
                    text: (node as ts.CallExpression).arguments[0].getText()
                });
            }
        }

        return fileInfo;
    });
}

function getAllChildren(node: ts.Node): ts.Node[] {
    // todo: probably really bad for performance... will change to use generators later
    return [node, ...node.getChildren().map(getAllChildren).reduce((a, b) => a.concat(b), [])];
}

function replaceCallExpressionReplacesInText(callExpressionReplaces: ReplaceInfo[], data: string) {
    for (let i = 0; i < callExpressionReplaces.length; i++) {
        const newText = `"${callExpressionReplaces[i].text.substr(callExpressionReplaces[i].text.lastIndexOf(".") + 1)}"`;
        const offset = newText.length - (callExpressionReplaces[i].end - callExpressionReplaces[i].pos);

        data = data.substring(0, callExpressionReplaces[i].pos) + newText + data.substring(callExpressionReplaces[i].end);

        for (let j = i + 1; j < callExpressionReplaces.length; j++) {
            callExpressionReplaces[j].pos += offset;
            callExpressionReplaces[j].end += offset;
        }
    }

    return data;
}
