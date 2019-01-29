import { ArgsChecker } from "../external/scripts-common";
import { verifyDeclarationFile } from "./verifyDeclarationFile";

const argsChecker = new ArgsChecker();

if (argsChecker.checkHasArg("verify-declaration-file")) {
    console.log("Verifying declaration file...");
    verifyDeclarationFile();
}

argsChecker.verifyArgsUsed();
