declare module "ts-nameof" {
    interface Api {
        // these types are any because I don't know a good way of making this work with web projects (see issue #22)
        (): any; // actually: ts.TransformerFactory<ts.SourceFile>
        stream(): any; // actually: NodeJS.ReadWriteStream
        replaceInFiles(fileNames: string[], opts?: { encoding?: string }, onFinished?: (err?: any /* NodeJS.ErrnoException */) => void): void;
        replaceInFiles(fileNames: string[], onFinished?: (err?: any /* NodeJS.ErrnoException */) => void): void;
        replaceInText(fileText: string): { fileText?: string; replaced: boolean; };
    }
    var func: Api;
    export = func;
}

declare function nameof<T>(func?: (obj: T) => void): string;
declare function nameof(obj: Object | null | undefined): string;
declare namespace nameof {
    function full<T>(periodIndex?: number): string;
    function full<T>(func: (obj: T) => void, periodIndex?: number): string;
    function full(obj: Object | null | undefined, periodIndex?: number): string;
}
