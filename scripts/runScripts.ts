import * as path from "path";
import { readFile } from "./readFile";
import { execScript } from "./execScript";
import { packagePathMappings, allPackageNames, allPackageInfos, rootFolder } from "./config";

export async function runScriptsForProcessArgs(parallel: boolean) {
    const args = process.argv.slice(2);

    (async () => {
        try {
            await runScripts(args[0], getPackageNames(), { parallel });
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    })();

    function getPackageNames() {
        const packageNames = args.slice(1);

        if (packageNames.length === 0)
            packageNames.push(...allPackageNames);

        for (let i = packageNames.length - 1; i >= 0; i--) {
            if (packageNames[i].endsWith("/")) {
                const packageDirStartPath = packageNames[i];
                packageNames.splice(i, 1);
                packageNames.push(...allPackageInfos.filter(info => info.dirPath.startsWith(packageDirStartPath)).map(info => info.name));
            }
        }

        return packageNames;
    }
}

export async function runScripts(commandName: string, packageNames: string[], options: { parallel?: boolean; } = {}) {
    const parallel = options.parallel || false;
    const packagePaths = getPackagePaths();
    const promises: Promise<any>[] = [];
    const fullCommandName = "yarn " + getEndCommandName();
    let hadError = false;

    for (const dirPath of packagePaths) {
        if (!(await checkHasCommandName(dirPath))) {
            console.log(`SKIPPING: ${fullCommandName} (${dirPath})`);
            continue;
        }

        console.log(`Running: ${fullCommandName} (${dirPath})`);
        const promise = execScript(fullCommandName + getCommandAdditionalArguments(), { cwd: dirPath }).catch((errMessage: string) => {
            console.error(`----`);
            console.error(`Error running command: ${fullCommandName} (${dirPath})\nMessage:\n\n${errMessage}`);
            hadError = true;
        });

        if (parallel)
            promises.push(promise);
        else {
            await promise;
            throwIfHadError();
        }
    }

    await Promise.all(promises);
    throwIfHadError();

    function throwIfHadError() {
        if (hadError)
            throw new Error("Failed.");
    }

    async function checkHasCommandName(dirPath: string) {
        if (commandName === "install")
            return true;

        const packageJson = JSON.parse(await readFile(path.join(rootFolder, dirPath, "package.json")));
        return packageJson.scripts[commandName] != null;
    }

    function getEndCommandName() {
        if (commandName === "install")
            return commandName;
        return "run " + commandName;
    }

    function getCommandAdditionalArguments() {
        if (commandName === "test")
            return " --colors";
        return "";
    }

    function getPackagePaths() {
        const result: string[] = [];

        for (const packageName of packageNames) {
            if (packagePathMappings[packageName] == null)
                throw new Error(`Could not find path to package: ${packageName}`);
            result.push(packagePathMappings[packageName]);
        }

        return result;
    }
}
