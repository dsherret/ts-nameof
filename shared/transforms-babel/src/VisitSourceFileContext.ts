import { Node } from "@babel/types";

export interface VisitSourceFileContext {
    interpolateExpressions: Set<Node>;
}
