// todo: consolidate this with other ArgsChecker in ts-nameof
export class ArgsChecker {
    private readonly originalArgs: ReadonlyArray<string>;
    private readonly args: string[];

    constructor(args?: string[]) {
        this.args = args || process.argv.slice(2);
        this.originalArgs = [...this.args];
    }

    checkHasArg(argName: string) {
        if (this.originalArgs.length === 0)
            return true; // run all

        return this.checkHasExplicitArg(argName);
    }

    checkHasExplicitArg(argName: string) {
        const index = this.args.indexOf(argName);
        if (index === -1)
            return false;

        this.args.splice(index, 1);
        return true;
    }

    verifyArgsUsed() {
        if (this.args.length > 0)
            console.error(`Unknown args: ${this.args.join(", ")}`);
    }
}
