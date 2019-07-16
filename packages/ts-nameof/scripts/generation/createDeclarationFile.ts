import { Project, NamespaceDeclarationKind } from "ts-morph";

export function createDeclarationFile(project: Project) {
    const mainFile = project.getSourceFileOrThrow("src/main.ts");
    const outputFiles = mainFile.getEmitOutput({ emitOnlyDtsFiles: true }).getOutputFiles();
    if (outputFiles.length !== 1)
        throw new Error(`Expected 1 file when emitting, but had ${outputFiles.length}`);

    const declarationFile = project.createSourceFile("ts-nameof.d.ts", outputFiles[0].getText(), { overwrite: true });

    removePreceedingCommentReference();
    commentExternalTypes();
    removeTypeScriptImport();
    wrapInGlobalModule();
    addGlobalDeclarations();

    function removePreceedingCommentReference() {
        const firstChild = declarationFile.getFirstChildOrThrow();
        declarationFile.removeText(0, firstChild.getStart());
    }

    function commentExternalTypes() {
        // these types are made to be any so that this library will work when included in
        // web projects and NodeJS does not exist. See issue #22.
        const typesToComment = [
            "ts.TransformerFactory<ts.SourceFile>",
            "NodeJS.ErrnoException"
        ];
        declarationFile.forEachDescendant(descendant => {
            if (typesToComment.indexOf(descendant.getText()) >= 0)
                descendant.replaceWithText(`any /* ${descendant.getText()} */`);
        });
    }

    function removeTypeScriptImport() {
        declarationFile.getImportDeclarationOrThrow("typescript").remove();
    }

    function wrapInGlobalModule() {
        const fileText = declarationFile.getText();
        declarationFile.removeText();
        const apiModule = declarationFile.addNamespace({
            hasDeclareKeyword: true,
            declarationKind: NamespaceDeclarationKind.Module,
            name: `"ts-nameof"`
        });
        apiModule.setBodyText(fileText);
        apiModule.getVariableStatementOrThrow(s => s.getDeclarations().some(d => d.getName() === "api"))
            .setHasDeclareKeyword(false);
    }

    function addGlobalDeclarations() {
        const globalFile = project.addExistingSourceFile("../../shared/lib/global.d.ts");
        declarationFile.addStatements(writer => {
            writer.newLine();
            writer.write(globalFile.getText().replace(/\r?\n$/, ""));
        });
    }
}
