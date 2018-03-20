import { StatementBinder } from "./statement-binder";
import { ParseTree } from "../syntax/statements-parser";
import { Diagnostic, ErrorCode } from "../diagnostics";
import { BaseBoundStatement } from "./nodes/statements";
import { BaseStatementSyntax } from "../syntax/nodes/statements";

export class ModuleBinder {
    public static readonly MainModuleName: string = "<Main>";

    private _boundModules: { [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> } = {};

    public get boundModules(): { readonly [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> } {
        return this._boundModules;
    }

    public constructor(parseTree: ParseTree, private diagnostics: Diagnostic[]) {
        const subModuleNames: { [name: string]: boolean } = {};

        parseTree.subModules.forEach(subModule => {
            const nameToken = subModule.subCommand.nameToken;
            if (subModuleNames[nameToken.text]) {
                diagnostics.push(new Diagnostic(
                    ErrorCode.TwoSubModulesWithTheSameName,
                    nameToken.range,
                    nameToken.text));
            } else {
                subModuleNames[nameToken.text] = true;
            }
        });

        this._boundModules[ModuleBinder.MainModuleName] = new StatementBinder(parseTree.mainModule, subModuleNames, this.diagnostics).module;

        parseTree.subModules.forEach(subModule => {
            this._boundModules[subModule.subCommand.nameToken.text] =
                new StatementBinder(subModule.statementsList, subModuleNames, this.diagnostics).module;
        });
    }
}
