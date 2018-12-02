declare function nameof<T>(func?: (obj: T) => void): string;
declare function nameof(obj: object | null | undefined): string;
declare namespace nameof {
    function full<T>(periodIndex?: number): string;
    function full<T>(func: (obj: T) => void, periodIndex?: number): string;
    function full(obj: object | null | undefined, periodIndex?: number): string;
}
