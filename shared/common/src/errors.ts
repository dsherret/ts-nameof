export function throwError(message: string): never {
    throw new Error(`[ts-nameof]: ${message}`);
}

export function assertNever(value: never, message: string): never {
    return throwError(message);
}
