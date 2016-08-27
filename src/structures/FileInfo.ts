import {ReplaceInfo} from "./ReplaceInfo";

export interface FileInfo {
    readonly fileName: string;
    readonly callExpressionReplaces: ReplaceInfo[];
}
