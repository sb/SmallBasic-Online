import { StatementBinder } from "./statement-binder";
import { ParseTree } from "../syntax/statements-parser";
import { Diagnostic, ErrorCode } from "../diagnostics";
import { BaseBoundStatement } from "./nodes/statements";
import { BaseStatementSyntax } from "../syntax/nodes/statements";

export interface BoundTree {
    readonly mainModule: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>;
    readonly subModules: { readonly [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> };
}

export class ModuleBinder {
    private mainModule: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>>;
    private subModules: { [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> };

    public get boundTree(): BoundTree {
        return {
            mainModule: this.mainModule,
            subModules: this.subModules
        };
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

        this.mainModule = new StatementBinder(parseTree.mainModule, subModuleNames, this.diagnostics).module;
        this.subModules = {};

        parseTree.subModules.forEach(subModule => {
            this.subModules[subModule.subCommand.nameToken.text] =
                new StatementBinder(subModule.statementsList, subModuleNames, this.diagnostics).module;
        });
    }
}
