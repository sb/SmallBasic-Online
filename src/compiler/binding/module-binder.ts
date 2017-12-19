import { StatementBinder } from "./statement-binder";
import { ParseTree } from "../syntax/statements-parser";
import { Diagnostic, ErrorCode } from "../utils/diagnostics";
import { BaseBoundStatement } from "../models/bound-statements";

export interface ModuleDefinition {
    statements: BaseBoundStatement[];
}

export interface BoundTree {
    mainModule: ModuleDefinition;
    subModules: { [name: string]: ModuleDefinition };
}

export type DefinedModulesMap = { [name: string]: boolean };

export class ModuleBinder {
    public readonly boundTree: BoundTree;

    public constructor(parseTree: ParseTree, private diagnostics: Diagnostic[]) {
        const subModuleNames: DefinedModulesMap = {};

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

        this.boundTree = {
            mainModule: new StatementBinder(parseTree.mainModule, subModuleNames, this.diagnostics).module,
            subModules: {}
        };

        parseTree.subModules.forEach(subModule => {
            this.boundTree.subModules[subModule.subCommand.nameToken.text] =
                new StatementBinder(subModule.statementsList, subModuleNames, this.diagnostics).module;
        });
    }
}
