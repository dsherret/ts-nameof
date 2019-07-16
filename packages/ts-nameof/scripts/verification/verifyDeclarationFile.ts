import { Project } from "ts-morph";

export function verifyDeclarationFile() {
    const project = new Project();
    const declarationFile = project.addExistingSourceFile("ts-nameof.d.ts");
    const declarationFileTests = project.addExistingSourceFile("lib/declarationFileTests.ts");
    const diagnostics = [...declarationFile.getPreEmitDiagnostics(), ...declarationFileTests.getPreEmitDiagnostics()];

    if (diagnostics.length > 0)
        console.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
}
