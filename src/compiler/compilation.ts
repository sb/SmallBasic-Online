import { ModuleEmitter } from "./runtime/module-emitter";
import { BaseInstruction } from "./runtime/instructions";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./diagnostics";
import { ModulesBinder } from "./binding/modules-binder";
import { Scanner } from "./syntax/scanner";
import { Token } from "./syntax/tokens";
import { StatementsParser } from "./syntax/statements-parser";
import { BaseSyntaxNode, ParseTreeSyntax, BaseStatementSyntax } from "./syntax/syntax-nodes";
import { BaseBoundStatement, BaseBoundNode } from "./binding/bound-nodes";
import { CompilerPosition } from "./syntax/ranges";

export class Compilation {
    public readonly tokens: ReadonlyArray<Token>;
    public readonly parseTree: ParseTreeSyntax;
    public readonly boundSubModules: { [name: string]: ReadonlyArray<BaseBoundStatement<BaseStatementSyntax>> };
    public readonly diagnostics: Diagnostic[] = [];

    public get isReadyToRun(): boolean {
        return !!this.text.trim() && !this.diagnostics.length;
    }

    public constructor(public readonly text: string) {
        this.diagnostics = [];

        this.tokens = new Scanner(this.text, this.diagnostics).result;
        const commands = new CommandsParser(this.tokens, this.diagnostics).result;
        this.parseTree = new StatementsParser(commands, this.diagnostics).result;
        this.boundSubModules = new ModulesBinder(this.parseTree, this.diagnostics).boundModules;
    }

    public emit(): { readonly [name: string]: ReadonlyArray<BaseInstruction> } {
        if (!this.isReadyToRun) {
            throw new Error(`Cannot emit an empty or errornous compilation`);
        }

        const result: { [name: string]: ReadonlyArray<BaseInstruction> } = {};
        for (const name in this.boundSubModules) {
            result[name] = new ModuleEmitter(this.boundSubModules[name]).instructions;
        }

        return result;
    }

    public getSyntaxNode(position: CompilerPosition): BaseSyntaxNode | undefined {
        return this.getSyntaxNodeAux(this.parseTree, position);
    }

    public getBoundNode(position: CompilerPosition): BaseBoundNode<BaseSyntaxNode> | undefined {
        for (const subModuleName in this.boundSubModules) {
            const subModule = this.boundSubModules[subModuleName];
            for (let i = 0; i < subModule.length; i++) {
                const statement = subModule[i];
                const result = this.getBoundNodeAux(statement, position);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    }

    private getBoundNodeAux(node: BaseBoundNode<BaseSyntaxNode>, position: CompilerPosition): BaseBoundNode<BaseSyntaxNode> | undefined {
        if (node.syntax.range.containsPosition(position)) {
            let children = node.children();
            for (let i = 0; i < children.length; i++) {
                const result = this.getBoundNodeAux(children[i], position);
                if (result) {
                    return children[i];
                }
            }
            return node;
        } else {
            return undefined;
        }
    }

    private getSyntaxNodeAux(node: BaseSyntaxNode, position: CompilerPosition): BaseSyntaxNode | undefined {
        if (node.range.containsPosition(position)) {
            let children = node.children();
            for (let i = 0; i < children.length; i++) {
                const result = this.getSyntaxNodeAux(children[i], position);
                if (result) {
                    return children[i];
                }
            }
            return node;
        } else {
            return undefined;
        }
    }
}
