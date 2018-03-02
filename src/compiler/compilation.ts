import { ModuleEmitter } from "./runtime/module-emitter";
import { BaseInstruction } from "./models/instructions";
import { StatementsParser, ParseTree } from "./syntax/statements-parser";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./diagnostics";
import { ModuleBinder, BoundTree } from "./binding/module-binder";
import { Scanner } from "./syntax/scanner";
import { Token } from "./syntax/nodes/tokens";
import { BaseCommandSyntax } from "./syntax/nodes/commands";

interface EmitResult {
    readonly mainModule: ReadonlyArray<BaseInstruction>;
    readonly subModules: { readonly [name: string]: ReadonlyArray<BaseInstruction> };
}

export class Compilation {
    public readonly diagnostics: ReadonlyArray<Diagnostic>;
    public readonly tokens: ReadonlyArray<Token>;
    public readonly commands: ReadonlyArray<BaseCommandSyntax>;
    public readonly parseTree: ParseTree;
    public readonly boundTree: BoundTree;

    public constructor(public readonly text: string) {
        const diagnostics: Diagnostic[] = [];

        this.tokens = new Scanner(text, diagnostics).tokens;
        this.commands = new CommandsParser(this.tokens, diagnostics).commands;
        this.parseTree = new StatementsParser(this.commands, diagnostics).parseTree;
        this.boundTree = new ModuleBinder(this.parseTree, diagnostics).boundTree;

        this.diagnostics = diagnostics;
    }

    public emit(): EmitResult {
        if (this.diagnostics.length) {
            throw new Error(`Cannot emit a compilation with diagnostics`);
        }

        const mainModule = new ModuleEmitter(this.boundTree.mainModule).instructions;
        const subModules: { [name: string]: ReadonlyArray<BaseInstruction> } = {};

        for (const name in this.boundTree.subModules) {
            const subModule = this.boundTree.subModules[name];
            subModules[name] = new ModuleEmitter(subModule).instructions;
        }

        return {
            mainModule: mainModule,
            subModules: subModules
        };
    }

    public get isReadyToRun(): boolean {
        return !!this.text.trim() && !this.diagnostics.length;
    }
}
