declare module "ts-nameof" {
    interface Api {
        (): NodeJS.ReadWriteStream;
        replaceInFiles(fileNames: string[], opts?: { encoding?: string }, onFinished?: (err?: NodeJS.ErrnoException) => void): void;
        replaceInFiles(fileNames: string[], onFinished?: (err?: NodeJS.ErrnoException) => void): void;
    }
    var func: Api;
    export = func;
}

declare function nameof<T>(func?: (obj: T) => void): string;
declare function nameof(obj: Object | null | undefined): string;
declare namespace nameof {
    function full<T>(): string;
    function full(obj: Object | null | undefined): string;
}
