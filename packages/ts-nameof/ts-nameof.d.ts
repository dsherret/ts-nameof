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

/**
 * Gets a string representation of the last identifier of the given expression.
 *
 * @example nameof(console) -> "console"
 * @example nameof(console.log) -> "log"
 * @example nameof(console["warn"]) -> "warn"
 *
 * @param obj An expression for which the last identifier will be parsed.
 */
declare function nameof(obj: any): string;

declare namespace nameof {
    /**
     * Gets the string representation of the entire type parameter expression.
     *
     * @example nameof.full<MyNamespace.MyInnerInterface>() -> "MyNamespace.MyInnerInterface"
     * @example nameof.full<MyNamespace.MyInnerInterface>(1) -> "MyInnerInterface"
     * @example nameof.full<Array<MyInterface>>() -> "Array"
     * @example nameof.full<MyNamespace.AnotherNamespace.MyInnerInterface>>(-1) -> "MyInnerInterface"
     *
     * @param periodIndex Specifies the index of the part of the expression to parse.
     * When absent, the full expression will be parsed.
     * A negative index can be used, indicating an offset from the end of the sequence.
     */
    function full<T>(periodIndex?: number): string;

    /**
     * Gets the string representation of the entire resultant expression.
     *
     * @example nameof.full<MyInterface>(o => o.prop.prop2) -> "prop.prop2"
     * @example nameof.full<MyInterface>(o => o.prop.prop2.prop3, 1) -> "prop2.prop3"
     * @example nameof.full<MyInterface>(o => o.prop.prop2.prop3, -1) -> `"prop3"
     *
     * @param func A function for which the result will be parsed, excluding the parameter's identifier.
     * @param periodIndex Specifies the index of the part of the expression to parse.
     * When absent, the full expression will be parsed.
     * A negative index can be used, indicating an offset from the end of the sequence.
     */
    function full<T>(func: (obj: T) => void, periodIndex?: number): string;

    /**
     * Gets the string representation of the entire given expression.
     *
     * @example nameof.full(console.log) -> "console.log"
     * @example nameof.full(window.alert.length, -1) -> "length"
     * @example nameof.full(window.alert.length, 2) -> "length"
     *
     * @param obj The expression which will be parsed.
     * @param periodIndex Specifies the index of the part of the expression to parse.
     * When absent, the full expression will be parsed.
     * A negative index can be used, indicating an offset from the end of the sequence.
     */
    function full(obj: any, periodIndex?: number): string;

    /**
     * Gets an array containing the string representation of the final identifier of each expression in the array returned by the provided function.
     *
     * @example nameof.toArray<MyType>(o => [o.firstProp, o.otherProp.secondProp, o.other]) -> ["firstProp", "secondProp", "other"]
     * @example nameof.toArray<MyType>(o => [o.prop, nameof.full(o.myProp.otherProp, 1)]) -> ["prop", "myProp.otherProp"]
     *
     * @param func A function returning an array of expressions to be parsed, excluding the parameter's identifier.
     */
    function toArray<T>(func: (obj: T) => any[]): string[];

    /**
     * Gets an array containing the string representation of each expression in the arguments.
     *
     * @example nameof.toArray(myObject, otherObject) -> ["myObject", "otherObject"]
     * @example nameof.toArray(obj.firstProp, obj.secondProp, otherObject, nameof.full(obj.other)) -> ["firstProp", "secondProp", "otherObject", "obj.other"]
     *
     * @param args An array of expressions to be parsed.
     */
    function toArray(...args: any[]): string[];

    /**
     * Embeds an expression into the string representation of the result of nameof.full.
     *
     * @example nameof.full(myObj.prop[nameof.interpolate(i)]) -> `myObj.prop[${i}]`
     *
     * @param value The value to interpolate.
     */
    function interpolate<T>(value: T): T;

    /**
     * Gets an array of strings where each element is a subsequent part of the expression provided.
     *
     * @example nameof.split<MyInterface>(o => o.prop.prop2.prop3) -> ["prop", "prop2", "prop3"]
     * @example nameof.split<MyInterface>(o => o.prop.prop2.prop3, 1) -> ["prop2", "prop3"]
     * @example nameof.split<MyInterface>(o => o.prop.prop2.prop3, -1) -> ["prop", "prop2"]
     *
     * @param func A function for which the resultant parts will be parsed, excluding the parameter's identifier.
     * @param periodIndex Specifies the index of the part of the expression to parse.
     * When absent, the full expression will be parsed.
     * A negative index can be used, indicating an offset from the end of the sequence.
     */
    function split<T>(func: (obj: T) => any, periodIndex?: number): string[];

    /**
     * Gets an array of strings where each element is a subsequent part of the expression provided.
     *
     * @example nameof.split(myObj.prop.prop2.prop3) -> ["myObj", "prop", "prop2", "prop3"]
     * @example nameof.split(myObj.prop.prop2.prop3, -3);`, `["prop", "prop2", "prop3"];
     * @example nameof.split(myObj.prop.prop2.prop3, 2);`, `["prop2", "prop3"]
     *
     * @param obj An expression for which the parts will be parsed.
     * @param periodIndex Specifies the index of the part of the expression to parse.
     * When absent, the full expression will be parsed.
     * A negative index can be used, indicating an offset from the end of the sequence.
     */
    function split(obj: any, periodIndex?: number): string[];
}
