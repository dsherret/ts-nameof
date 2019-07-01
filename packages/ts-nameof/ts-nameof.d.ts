declare module "ts-nameof" {
    interface Api {
        (): any /* ts.TransformerFactory<ts.SourceFile> */;
        replaceInFiles(fileNames: ReadonlyArray<string>, opts?: {
            encoding?: string;
        }, onFinished?: (err?: any /* NodeJS.ErrnoException */) => void): void;
        replaceInFiles(fileNames: ReadonlyArray<string>, onFinished?: (err?: any /* NodeJS.ErrnoException */) => void): void;
        replaceInText(fileName: string, fileText: string): {
            fileText?: string;
            replaced: boolean;
        };
    }
    const api: Api;
    export = api;
}

declare function nameof<T>(func?: (obj: T) => void): string;
declare function nameof(obj: any): string;
declare namespace nameof {
    function full<T>(periodIndex?: number): string;
    function full<T>(func: (obj: T) => void, periodIndex?: number): string;
    function full(obj: any, periodIndex?: number): string;
    function toArray<T>(func: (obj: T) => any[]): string[];
    function toArray(...args: any[]): string[];
}
