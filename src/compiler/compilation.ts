import { ModuleEmitter } from "./emitting/module-emitter";
import { BaseInstruction } from "./emitting/instructions";
import { CommandsParser } from "./syntax/command-parser";
import { Diagnostic } from "./utils/diagnostics";
import { ModulesBinder } from "./binding/modules-binder";
import { Scanner } from "./syntax/scanner";
import { Token } from "./syntax/tokens";
import { StatementsParser } from "./syntax/statements-parser";
import { BaseSyntaxNode, ParseTreeSyntax, SyntaxKind, SyntaxNodeVisitor, IdentifierExpressionSyntax } from "./syntax/syntax-nodes";
import { BoundStatementBlock } from "./binding/bound-nodes";
import { CompilerPosition } from "./syntax/ranges";

export interface CompilationKind {
    writesToTextWindow(): boolean;
    drawsShapes(): boolean;
}

export class Compilation {
    private _outputKindDetector?: OutputKindDetector;

    public readonly tokens: ReadonlyArray<Token>;
    public readonly parseTree: ParseTreeSyntax;
    public readonly boundSubModules: { [name: string]: BoundStatementBlock };
    public readonly diagnostics: Diagnostic[] = [];

    public get isReadyToRun(): boolean {
        return !!this.text.trim() && !this.diagnostics.length;
    }

    public get kind(): CompilationKind {
        if (!this._outputKindDetector) {
            this._outputKindDetector = new OutputKindDetector();
            this._outputKindDetector.visit(this.parseTree);
        }

        return this._outputKindDetector;
    }

    public constructor(public readonly text: string) {
        this.diagnostics = [];

        this.tokens = new Scanner(this.text, this.diagnostics).result;

        const commands = new CommandsParser(this.tokens, this.diagnostics).result;
        this.parseTree = new StatementsParser(commands, this.diagnostics).result;
        this.setParentNode(this.parseTree);

        const binder = new ModulesBinder(this.parseTree, this.diagnostics);
        this.boundSubModules = binder.boundModules;
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

class OutputKindDetector extends SyntaxNodeVisitor implements CompilationKind {
    private _writesToTextWindow: boolean = false;
    private _drawsShapes: boolean = false;

    public writesToTextWindow(): boolean {
        return this._writesToTextWindow;
    }

    public drawsShapes(): boolean {
        return this._drawsShapes;
    }

    public visitIdentifierExpression(node: IdentifierExpressionSyntax): void {
        switch (node.identifierToken.token.text) {
            case "TextWindow":
                this._writesToTextWindow = true;
                break;
            case "Shapes":
            case "Controls":
            case "Turtle":
                this._drawsShapes = true;
                break;
        }
    }
}
