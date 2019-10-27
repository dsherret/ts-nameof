// @ts-check
// ===============
// To Local Source
// ===============
// Converts all the module specifiers referencing another package in the repository
// to point to the package's main TypeScript file itself. This is only meant as a
// temporary change to improve debugging between packages.
//
// .USAGE
// yarn to-local-source
// yarn to-local-source --undo

console.log("This script currently doesn't work with the build system. Please fix it...");
process.exit(1);

const { Project } = require("ts-morph");

const project = new Project();

project.addSourceFilesFromTsConfig("packages/babel-plugin-ts-nameof/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/common/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/scripts-common/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/tests-common/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/transforms-babel/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/transforms-common/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/transforms-ts/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/ts-nameof/tsconfig.json");
project.addSourceFilesFromTsConfig("packages/ts-nameof.macro/tsconfig.json");

/** @type {[string, import("ts-morph").SourceFile][]} */
const mappings = [
    ["@ts-nameof/common", project.getSourceFileOrThrow("packages/common/src/index.ts")],
    ["@ts-nameof/scripts-common", project.getSourceFileOrThrow("packages/scripts-common/src/index.ts")],
    ["@ts-nameof/transforms-common", project.getSourceFileOrThrow("packages/transforms-common/src/index.ts")],
    ["@ts-nameof/transforms-ts", project.getSourceFileOrThrow("packages/transforms-ts/src/index.ts")],
    ["@ts-nameof/transforms-babel", project.getSourceFileOrThrow("packages/transforms-babel/src/index.ts")],
    ["@ts-nameof/tests-common", project.getSourceFileOrThrow("packages/tests-common/src/index.ts")],
];

if (process.argv[2] === "--undo")
    undoToLocalSource();
else
    toLocalSource();

project.save();

function toLocalSource() {
    for (const importDec of getAllImportDeclarations()) {
        const moduleSpecifierValue = importDec.getModuleSpecifierValue();
        for (const [packageName, sourceFile] of mappings) {
            if (packageName === moduleSpecifierValue)
                importDec.setModuleSpecifier(sourceFile);
        }
    }
}

function undoToLocalSource() {
    for (const importDec of getAllImportDeclarations()) {
        const moduleSpecifierSourceFile = importDec.getModuleSpecifierSourceFile();
        for (const [packageName, sourceFile] of mappings) {
            if (sourceFile === moduleSpecifierSourceFile)
                importDec.setModuleSpecifier(packageName);
        }
    }
}

function* getAllImportDeclarations() {
    for (const file of project.getSourceFiles())
        yield* file.getImportDeclarations();
}