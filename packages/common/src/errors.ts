export function throwError(message: string): never {
    throw new Error(`[ts-nameof]: ${sanitizeMessage(message)}`);
}

export function throwErrorForSourceFile(message: string, sourceFilePath: string): never {
    throw new Error(`[ts-nameof:${sourceFilePath}]: ${sanitizeMessage(message)}`);
}

export function assertNever(value: never, message: string): never {
    return throwError(message);
}

function sanitizeMessage(message: string) {
    return message.replace(/^\[ts\-nameof[^\]]*\]: /, "");
}
