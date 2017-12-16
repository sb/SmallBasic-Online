import { StatementsParser } from "./syntax/statements-parser";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./utils/diagnostics";
import { ModuleBinder, BoundTree } from "./binding/module-binder";
import { Scanner } from "./syntax/scanner";

export class Compilation {
    public readonly diagnostics: Diagnostic[];
    public readonly boundTree: BoundTree;

    public constructor(text: string) {
        this.diagnostics = [];

        const tokens = new Scanner(text, this.diagnostics).tokens;
        const commands = new CommandsParser(tokens, this.diagnostics).commands;
        const parseTree = new StatementsParser(commands, this.diagnostics).parseTree;
        this.boundTree = new ModuleBinder(parseTree, this.diagnostics).boundTree;
    }
}
