import { ArgsChecker } from "@ts-nameof/scripts-common";
import { verifyDeclarationFile } from "./verifyDeclarationFile";

const argsChecker = new ArgsChecker();

if (argsChecker.checkHasArg("verify-declaration-file")) {
  console.log("Verifying declaration file...");
  verifyDeclarationFile();
}

argsChecker.verifyArgsUsed();
