export function throwError(message: string): never {
    throw new Error(`[ts-nameof]: ${message}`);
}
