import { Compilation } from "../../compiler/compilation";
import { CompilerRange, CompilerPosition } from "../syntax/ranges";
import { SupportedLibraries } from "../runtime/supported-libraries";
import { SyntaxKind, ObjectAccessExpressionSyntax, IdentifierExpressionSyntax, SyntaxNodeVisitor } from "../syntax/syntax-nodes";

const libraries = new SupportedLibraries();

export module HoverService {
    export interface Result {
        text: string[];
        range: CompilerRange;
    }

    export function provideHover(text: string, position: CompilerPosition): Result | undefined {
        const compilation = new Compilation(text);

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
            return new HoverVisitor().visit(node);
        }

        return undefined;
    }

    class HoverVisitor extends SyntaxNodeVisitor<Result> {
        public visitObjectAccessExpression(node: ObjectAccessExpressionSyntax): Result | undefined {
            if (node.baseExpression.kind !== SyntaxKind.IdentifierExpression) {
                return undefined;
            }

            const libraryName = (node.baseExpression as IdentifierExpressionSyntax).identifierToken.token.text;
            const library = libraries[libraryName];
            if (!library) {
                return undefined;
            }

            let description: string;
            const memberName = node.identifierToken.token.text;
            if (library.methods[memberName]) {
                description = library.methods[memberName].description;
            } else if (library.properties[memberName]) {
                description = library.properties[memberName].description;
            } else {
                return undefined;
            }

            return {
                range: node.range,
                text: [
                    `${libraryName}.${memberName}`,
                    description
                ]
            };
        }
    }
}
