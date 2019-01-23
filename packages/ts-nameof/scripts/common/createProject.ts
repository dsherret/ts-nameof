import { Project } from "ts-simple-ast";

export function getProject() {
    return new Project({ tsConfigFilePath: "tsconfig.json" });
}
