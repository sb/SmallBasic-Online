import { ModuleEmitter } from "./runtime/module-emitter";
import { BaseInstruction } from "./runtime/instructions";
import { StatementsParser, ParseTree } from "./syntax/statements-parser";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./diagnostics";
import { ModuleBinder } from "./binding/module-binder";
import { Scanner } from "./syntax/scanner";
import { Token } from "./syntax/nodes/tokens";
import { BaseCommandSyntax } from "./syntax/nodes/commands";
import { BaseBoundStatement } from "./binding/nodes/statements";
import { BaseStatementSyntax } from "./syntax/nodes/statements";

export class Compilation {
    public readonly diagnostics: ReadonlyArray<Diagnostic>;
    public readonly tokens: ReadonlyArray<Token>;
    public readonly commands: ReadonlyArray<BaseCommandSyntax>;
    public readonly parseTree: ParseTree;
    public readonly boundModules: { readonly [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> };

    public constructor(public readonly text: string) {
        const diagnostics: Diagnostic[] = [];

        this.tokens = new Scanner(text, diagnostics).tokens;
        this.commands = new CommandsParser(this.tokens, diagnostics).commands;
        this.parseTree = new StatementsParser(this.commands, diagnostics).parseTree;
        this.boundModules = new ModuleBinder(this.parseTree, diagnostics).boundModules;

        this.diagnostics = diagnostics;
    }

    public emit(): { readonly [name: string]: ReadonlyArray<BaseInstruction> } {
        if (this.diagnostics.length) {
            throw new Error(`Cannot emit a compilation with diagnostics`);
        }

        const modules: { [name: string]: ReadonlyArray<BaseInstruction> } = {};
        for (const name in this.boundModules) {
            modules[name] = new ModuleEmitter(this.boundModules[name]).instructions;
        }

        return modules;
    }

    public get isReadyToRun(): boolean {
        return !!this.text.trim() && !this.diagnostics.length;
    }
}
