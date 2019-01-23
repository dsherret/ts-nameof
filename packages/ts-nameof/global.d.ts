declare function nameof<T>(func?: (obj: T) => void): string;
declare function nameof(obj: any): string;
declare namespace nameof {
    function full<T>(periodIndex?: number): string;
    function full<T>(func: (obj: T) => void, periodIndex?: number): string;
    function full(obj: any, periodIndex?: number): string;
}
