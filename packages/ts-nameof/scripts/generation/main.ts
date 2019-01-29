import { getProject } from "../common";
import { ArgsChecker } from "../external/scripts-common";
import { createDeclarationFile } from "./createDeclarationFile";

const argsChecker = new ArgsChecker();
const project = getProject();

if (argsChecker.checkHasArg("create-declaration-file")) {
    console.log("Creating declaration file...");
    createDeclarationFile(project);
}

argsChecker.verifyArgsUsed();
project.save();
