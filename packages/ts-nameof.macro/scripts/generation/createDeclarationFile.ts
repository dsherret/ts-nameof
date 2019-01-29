import { Project, TypeGuards, NamespaceDeclarationKind } from "ts-simple-ast";

export function createDeclarationFile(project: Project) {
    const globalFile = project.addExistingSourceFile("../../shared/lib/global.d.ts");
    const declarationFile = project.createSourceFile("ts-nameof.macro.d.ts", "", { overwrite: true });
    const namespaceDec = declarationFile.addNamespace({
        name: `"ts-nameof.macro"`,
        declarationKind: NamespaceDeclarationKind.Module,
        hasDeclareKeyword: true
    });

    namespaceDec.setBodyText(globalFile.getFullText());

    for (const statement of namespaceDec.getStatements()) {
        if (TypeGuards.isAmbientableNode(statement))
            statement.setHasDeclareKeyword(false);
    }

    namespaceDec.addExportAssignment({
        expression: "nameof",
        isExportEquals: false
    });
}
