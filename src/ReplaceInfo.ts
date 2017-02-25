export interface ReplaceInfo {
    pos: number;
    end: number;
    readonly args: string[];
    readonly typeArgText: string;
    showFull: boolean;
}
