import { StatementBinder } from "./statement-binder";
import { Diagnostic, ErrorCode } from "../diagnostics";
import { BaseSyntax, ParseTreeSyntax } from "../syntax/syntax-nodes";
import { BaseBoundStatement } from "./bound-nodes";

export class ModulesBinder {
    public static readonly MainModuleName: string = "<Main>";

    private _diagnostics: Diagnostic[] = [];
    private _definedSubModules: { [name: string]: boolean } = {};
    private _boundModules: { [name: string]: ReadonlyArray<BaseBoundStatement<BaseSyntax>> } = {};

    public get boundModules(): { readonly [name: string]: ReadonlyArray<BaseBoundStatement<BaseSyntax>> } {
        return this._boundModules;
    }

    public get diagnostics(): ReadonlyArray<Diagnostic> {
        return this._diagnostics;
    }

    public constructor(parseTree: ParseTreeSyntax) {
        this.constructSubModulesMap(parseTree);

        this._boundModules[ModulesBinder.MainModuleName] = this.bindModule(parseTree.mainModule);

        parseTree.subModules.forEach(subModule => {
            this._boundModules[subModule.subCommand.nameToken.token.text] = this.bindModule(subModule.statementsList);
        });
    }

    private constructSubModulesMap(parseTree: ParseTreeSyntax): void {
        parseTree.subModules.forEach(subModule => {
            const nameToken = subModule.subCommand.nameToken;
            if (this._definedSubModules[nameToken.token.text]) {
                this._diagnostics.push(new Diagnostic(
                    ErrorCode.TwoSubModulesWithTheSameName,
                    nameToken.range,
                    nameToken.token.text));
            } else {
                this._definedSubModules[nameToken.token.text] = true;
            }
        });
    }

    private bindModule(statements: ReadonlyArray<BaseSyntax>): ReadonlyArray<BaseBoundStatement<BaseSyntax>> {
        const binder = new StatementBinder(statements, this._definedSubModules);
        this._diagnostics.push.apply(this._diagnostics, binder.diagnostics);
        return binder.result;
    }
}
