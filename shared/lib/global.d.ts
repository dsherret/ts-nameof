declare function nameof<T>(func?: (obj: T) => void): string;
declare function nameof(obj: any): string;
declare namespace nameof {
    function full<T>(periodIndex?: number): string;
    function full<T>(func: (obj: T) => void, periodIndex?: number): string;
    function full(obj: any, periodIndex?: number): string;
    function toArray<T>(func: (obj: T) => any[]): string[];
    function toArray(...args: any[]): string[];
    function interpolate<T>(value: T): T;
}
