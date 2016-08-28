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
                typeChecker.getSymbolAtLocation((node as ts.CallExpression).expression) === nameOfSymbol;

            if (isValidCallExpression) {
                const callExpression = node as ts.CallExpression;
                let text = "";

                /* istanbul ignore else */
                if (callExpression.arguments.length === 1) {
                    text = callExpression.arguments[0].getText();
                }
                else if ((callExpression.typeArguments || []).length === 1) {
                    text = callExpression.typeArguments![0].getText();
                }

                /* istanbul ignore else */
                if (text.length > 0) {
                    fileInfo.callExpressionReplaces.push({
                        pos: node.pos,
                        end: node.end,
                        text
                    });
                }
            }
        });

        return fileInfo;
    }).filter(c => c.callExpressionReplaces.length > 0);
}
