import * as ts from "typescript";
import {FileInfo} from "./structures";
import {forAllChildrenOfNode} from "./forAllChildrenOfNode";

export function getFileInfos(sourceFiles: ts.SourceFile[], nameOfSymbol: ts.Symbol, typeChecker: ts.TypeChecker) {
    return sourceFiles.map(file => {
        const fileInfo: FileInfo = {
            fileName: file.fileName,
            callExpressionReplaces: []
        };

        forAllChildrenOfNode(file, node => {
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
        });

        return fileInfo;
    }).filter(c => c.callExpressionReplaces.length > 0);
}
