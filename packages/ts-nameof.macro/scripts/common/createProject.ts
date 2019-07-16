import { Project } from "ts-morph";

export function getProject() {
    return new Project({ tsConfigFilePath: "tsconfig.json" });
}
