import { getProject } from "../common";
import { createDeclarationFile } from "./createDeclarationFile";

const args = process.argv.slice(2);
const originalArgs = [...args];
const project = getProject();

if (checkHasArg("create-declaration-file")) {
    console.log("Creating declaration file...");
    createDeclarationFile(project);
}

if (args.length > 0)
    console.error(`Unknown args: ${args}`);

project.save();

function checkHasArg(argName: string) {
    if (originalArgs.length === 0)
        return true; // run all

    return checkHasExplicitArg(argName);
}

function checkHasExplicitArg(argName: string) {
    const index = args.indexOf(argName);
    if (index === -1)
        return false;

    args.splice(index, 1);
    return true;
}
