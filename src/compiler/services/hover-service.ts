import { Compilation } from "../../compiler/compilation";
import { CompilerRange, CompilerPosition } from "../syntax/ranges";
import { RuntimeLibraries } from "../runtime/libraries";
import { SyntaxKind, ObjectAccessExpressionSyntax, IdentifierExpressionSyntax, SyntaxNodeVisitor } from "../syntax/syntax-nodes";

export module HoverService {
    export interface Result {
        text: string[];
        range: CompilerRange;
    }

    export function provideHover(compilation: Compilation, position: CompilerPosition): Result | undefined {
        for (let i = 0; i < compilation.diagnostics.length; i++) {
            const diagnostic = compilation.diagnostics[i];

            if (diagnostic.range.containsPosition(position)) {
                return {
                    range: diagnostic.range,
                    text: [diagnostic.toString()]
                };
            }
        }

        const node = compilation.getSyntaxNode(position, SyntaxKind.ObjectAccessExpression);
        if (node) {
            const visitor = new HoverVisitor();
            visitor.visit(node);
            return visitor.result;
        }

        return undefined;
    }

    class HoverVisitor extends SyntaxNodeVisitor {
        private _firstResult: Result | undefined;

        public get result(): Result | undefined {
            return this._firstResult;
        }

        private setResult(result: Result): void {
            if (!this._firstResult) {
                this._firstResult = result;
            }
        }

        public visitObjectAccessExpression(node: ObjectAccessExpressionSyntax): void {
            if (node.baseExpression.kind !== SyntaxKind.IdentifierExpression) {
                return;
            }

            const libraryName = (node.baseExpression as IdentifierExpressionSyntax).identifierToken.token.text;
            const library = RuntimeLibraries.Metadata[libraryName];
            if (!library) {
                return;
            }

            let description: string;
            const memberName = node.identifierToken.token.text;
            if (library.methods[memberName]) {
                description = library.methods[memberName].description;
            } else if (library.properties[memberName]) {
                description = library.properties[memberName].description;
            } else {
                return;
            }

            this.setResult({
                range: node.range,
                text: [
                    `${libraryName}.${memberName}`,
                    description
                ]
            });
        }
    }
}
