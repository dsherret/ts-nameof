import { ModuleDeclarationKind, Node, Project } from "ts-morph";

export function createDeclarationFile(project: Project) {
  const globalFile = project.addSourceFileAtPath("../../lib/global.d.ts");
  const declarationFile = project.createSourceFile("ts-nameof.macro.d.ts", "", { overwrite: true });
  const namespaceDec = declarationFile.addModule({
    name: `"ts-nameof.macro"`,
    declarationKind: ModuleDeclarationKind.Module,
    hasDeclareKeyword: true,
  });

  namespaceDec.setBodyText(globalFile.getFullText());

  for (const statement of namespaceDec.getStatements()) {
    if (Node.isAmbientable(statement)) {
      statement.setHasDeclareKeyword(false);
    }
  }

  namespaceDec.addExportAssignment({
    expression: "nameof",
    isExportEquals: false,
  });
}
