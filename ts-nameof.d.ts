declare module "ts-nameof" {
    export function replaceInFiles(fileNames: string[], onFinished: () => void): void;
}

declare function nameof(obj: Object): string;
