import { ModuleEmitter } from "./runtime/module-emitter";
import { BaseInstruction } from "./runtime/instructions";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./diagnostics";
import { ModulesBinder } from "./binding/modules-binder";
import { Scanner } from "./syntax/scanner";
import { Token } from "./syntax/tokens";
import { StatementsParser } from "./syntax/statements-parser";
import { BaseSyntaxNode, ParseTreeSyntax, BaseStatementSyntax, SyntaxKind } from "./syntax/syntax-nodes";
import { BaseBoundStatement } from "./binding/bound-nodes";
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
        this.setParentNode(this.parseTree);

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

    public getSyntaxNode(position: CompilerPosition, kind: SyntaxKind): BaseSyntaxNode | undefined {
        function getSyntaxNodeAux(node: BaseSyntaxNode, position: CompilerPosition): BaseSyntaxNode | undefined {
            if (node.range.containsPosition(position)) {
                let children = node.children();
                for (let i = 0; i < children.length; i++) {
                    const result = getSyntaxNodeAux(children[i], position);
                    if (result) {
                        return result;
                    }
                }
                if (node.kind === kind) {
                    return node;
                }
            }
            return undefined;
        }

        return getSyntaxNodeAux(this.parseTree, position);
    }

    private setParentNode(node: BaseSyntaxNode): void {
        node.children().forEach(child => {
            child.parentOpt = node;
            this.setParentNode(child);
        });
    }
}
