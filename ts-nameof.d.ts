declare module "ts-nameof" {
    export function replaceInFiles(fileNames: string[], onFinished?: (err?: any) => void): void;
}

declare function nameof<T>(): string;
declare function nameof(obj: Object): string;
