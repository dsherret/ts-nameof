import * as ts from "typescript";
import * as path from "path";
import {Promise} from "es6-promise";
import * as constants from "./constants";
import {getFileNamesFromGlobs} from "./getFileNamesFromGlobs";
import {getNameOfFunctionSymbol} from "./getNameOfFunctionSymbol";
import {updateFileBasedOnFileInfo} from "./updateFileBasedOnFileInfo";
import {getFileInfos} from "./getFileInfos";

export function replaceInFiles(fileNames: string[], onFinished?: (err?: NodeJS.ErrnoException) => void) {
    getFileNamesFromGlobs(fileNames).then(doReplace).then(() => {
        if (onFinished) {
            onFinished();
        }
    }).catch(/*istanbul ignore next*/ err => {
        if (onFinished) {
            onFinished(err);
        }
    });
}

export function doReplace(fileNames: string[]) {
    const compilerOptions: ts.CompilerOptions = {
        allowJs: true,
        experimentalDecorators: true
    };

    // the definition file is copied to the dist folder
    const definitionFileName = path.join(__dirname, constants.NAMEOF_DEFINITION_FILE_NAME);
    const program = ts.createProgram([...fileNames, definitionFileName], compilerOptions);
    const typeChecker = program.getTypeChecker();
    const sourceFiles = program.getSourceFiles().filter(f => f.fileName.indexOf("/node_modules/") === -1);

    const nameOfSymbol = getNameOfFunctionSymbol(sourceFiles);
    const fileInfos = getFileInfos(sourceFiles, nameOfSymbol, typeChecker);
    const promises = fileInfos.map(f => updateFileBasedOnFileInfo(f));

    return Promise.all(promises);
}
