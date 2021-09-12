import { ArgsChecker } from "@ts-nameof/scripts-common";
import { getProject } from "../common";
import { createDeclarationFile } from "./createDeclarationFile";

const argsChecker = new ArgsChecker();
const project = getProject();

if (argsChecker.checkHasArg("create-declaration-file")) {
  console.log("Creating declaration file...");
  createDeclarationFile(project);
}

argsChecker.verifyArgsUsed();
project.save();
