interface NameOfModule {
    nameof(obj: Object): string;
}

declare module "ts-nameof" {
    var t: NameOfModule;
    export = t;
}

declare function nameof(obj: Object): string;
