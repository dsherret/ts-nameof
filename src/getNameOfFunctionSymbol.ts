import * as ts from "typescript";
import * as constants from "./constants";

export function getNameOfFunctionSymbol(sourceFiles: ts.SourceFile[]) {
    for (const file of sourceFiles) {
        if (file.fileName.indexOf(constants.NAMEOF_DEFINITION_FILE_NAME) >= 0) {
            const symbol = (file as any).locals["nameof"] as ts.Symbol;
            /* istanbul ignore else */
            if (symbol != null) {
                return symbol;
            }
        }
    }

    /* istanbul ignore next */
    throw new Error("Could not find definition file symbol.");
}
