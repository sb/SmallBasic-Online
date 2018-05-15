import { StatementBinder } from "./statement-binder";
import { ParseTree } from "../syntax/statements-parser";
import { Diagnostic, ErrorCode } from "../diagnostics";
import { BaseBoundStatement } from "./nodes/statements";
import { BaseStatementSyntax } from "../syntax/nodes/statements";

export class ModulesBinder {
    public static readonly MainModuleName: string = "<Main>";

    private _diagnostics: Diagnostic[] = [];
    private _definedSubModules: { [name: string]: boolean } = {};
    private _boundModules: { [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> } = {};

    public get boundModules(): { readonly [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> } {
        return this._boundModules;
    }

    public get diagnostics(): ReadonlyArray<Diagnostic> {
        return this._diagnostics;
    }

    public constructor(parseTree: ParseTree) {
        this.constructSubModulesMap(parseTree);

        this._boundModules[ModulesBinder.MainModuleName] = this.bindModule(parseTree.mainModule);

        parseTree.subModules.forEach(subModule => {
            this._boundModules[subModule.subCommand.nameToken.text] = this.bindModule(subModule.statementsList);
        });
    }

    private constructSubModulesMap(parseTree: ParseTree): void {
        parseTree.subModules.forEach(subModule => {
            const nameToken = subModule.subCommand.nameToken;
            if (this._definedSubModules[nameToken.text]) {
                this._diagnostics.push(new Diagnostic(
                    ErrorCode.TwoSubModulesWithTheSameName,
                    nameToken.range,
                    nameToken.text));
            } else {
                this._definedSubModules[nameToken.text] = true;
            }
        });
    }

    private bindModule(statements: ReadonlyArray<BaseStatementSyntax>): ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> {
        const binder = new StatementBinder(statements, this._definedSubModules);
        this._diagnostics.push.apply(this._diagnostics, binder.diagnostics);
        return binder.result;
    }
}
