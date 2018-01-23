import { ModuleEmitter } from "./runtime/module-emitter";
import { BaseInstruction } from "./models/instructions";
import { StatementsParser } from "./syntax/statements-parser";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./utils/diagnostics";
import { ModuleBinder } from "./binding/module-binder";
import { Scanner } from "./syntax/scanner";

export class Compilation {
    public readonly diagnostics: ReadonlyArray<Diagnostic>;
    public readonly mainModule: ReadonlyArray<BaseInstruction>;
    public readonly subModules: { readonly [name: string]: ReadonlyArray<BaseInstruction> };

    public constructor(public readonly text: string) {
        const diagnostics: Diagnostic[] = [];

        const tokens = new Scanner(text, diagnostics).tokens;
        const commands = new CommandsParser(tokens, diagnostics).commands;
        const parseTree = new StatementsParser(commands, diagnostics).parseTree;
        const boundTree = new ModuleBinder(parseTree, diagnostics).boundTree;

        this.diagnostics = diagnostics;

        if (!this.diagnostics.length) {
            this.mainModule = new ModuleEmitter(boundTree.mainModule).instructions;
            const subModules: { [name: string]: ReadonlyArray<BaseInstruction> } = {};

            for (const name in boundTree.subModules) {
                const subModule = boundTree.subModules[name];
                subModules[name] = new ModuleEmitter(subModule).instructions;
            }

            this.subModules = subModules;
        }
    }

    public get isReadyToRun(): boolean {
        return !!this.text.trim() && !this.diagnostics.length;
    }
}
