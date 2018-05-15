import { ModuleEmitter } from "./runtime/module-emitter";
import { BaseInstruction } from "./runtime/instructions";
import { StatementsParser, ParseTree } from "./syntax/statements-parser";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./diagnostics";
import { ModulesBinder } from "./binding/modules-binder";
import { Scanner } from "./syntax/scanner";
import { Token } from "./syntax/nodes/tokens";
import { BaseCommandSyntax } from "./syntax/nodes/commands";
import { BaseBoundStatement } from "./binding/nodes/statements";
import { BaseStatementSyntax } from "./syntax/nodes/statements";

export class Compilation {
    private _diagnostics: Diagnostic[] = [];

    private _scanner?: Scanner;
    private _commandsParser?: CommandsParser;
    private _statementsParser?: StatementsParser;
    private _modulesBinder?: ModulesBinder;

    public get isReadyToRun(): boolean {
        return !!this.text.trim() && !this._diagnostics.length;
    }

    public get diagnostics(): ReadonlyArray<Diagnostic> {
        this.modules; /* finish compilation */

        return this._diagnostics;
    }

    public get tokens(): ReadonlyArray<Token> {
        if (!this._scanner) {
            this._scanner = new Scanner(this.text);
            this._diagnostics.push.apply(this._diagnostics, this._scanner.diagnostics);
        }
        return this._scanner.result;
    }

    public get commands(): ReadonlyArray<BaseCommandSyntax> {
        if (!this._commandsParser) {
            this._commandsParser = new CommandsParser(this.tokens);
            this._diagnostics.push.apply(this._diagnostics, this._commandsParser.diagnostics);
        }
        return this._commandsParser.result;
    }

    public get statements(): ParseTree {
        if (!this._statementsParser) {
            this._statementsParser = new StatementsParser(this.commands);
            this._diagnostics.push.apply(this._diagnostics, this._statementsParser.diagnostics);
        }
        return this._statementsParser.result;
    }

    public get modules(): { readonly [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> } {
        if (!this._modulesBinder) {
            this._modulesBinder = new ModulesBinder(this.statements);
            this._diagnostics.push.apply(this._diagnostics, this._modulesBinder.diagnostics);
        }
        return this._modulesBinder.boundModules;
    }

    public constructor(public readonly text: string) {
    }

    public emit(): { readonly [name: string]: ReadonlyArray<BaseInstruction> } {
        const modules = this.modules;

        if (!this.isReadyToRun) {
            throw new Error(`Cannot emit an empty or errornous compilation`);
        }

        const result: { [name: string]: ReadonlyArray<BaseInstruction> } = {};
        for (const name in modules) {
            result[name] = new ModuleEmitter(modules[name]).instructions;
        }

        return result;
    }
}
