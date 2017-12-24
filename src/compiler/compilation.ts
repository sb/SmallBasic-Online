import { ModuleEmitter } from "./runtime/module-emitter";
import { BaseInstruction } from "./models/instructions";
import { StatementsParser } from "./syntax/statements-parser";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./utils/diagnostics";
import { ModuleBinder } from "./binding/module-binder";
import { Scanner } from "./syntax/scanner";

export class Compilation {
    public readonly diagnostics: Diagnostic[];
    public readonly mainModule: BaseInstruction[];
    public readonly subModules: { [name: string]: BaseInstruction[] };

    public constructor(text: string) {
        this.diagnostics = [];

        const tokens = new Scanner(text, this.diagnostics).tokens;
        const commands = new CommandsParser(tokens, this.diagnostics).commands;
        const parseTree = new StatementsParser(commands, this.diagnostics).parseTree;
        const binder = new ModuleBinder(parseTree, this.diagnostics);

        if (!this.diagnostics.length) {
            this.mainModule = new ModuleEmitter(binder.mainModule).instructions;
            this.subModules = {};

            for (const name in binder.subModules) {
                const subModule = binder.subModules[name];
                this.subModules[name] = new ModuleEmitter(subModule).instructions;
            }
        }
    }
}
