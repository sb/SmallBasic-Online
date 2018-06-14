import { RuntimeLibraries } from "../runtime/libraries";
import { CompilerPosition } from "../syntax/ranges";
import { Compilation } from "../compilation";
import { CompilerUtils } from "../utils/compiler-utils";
import { SyntaxNodeVisitor, ObjectAccessExpressionSyntax, SyntaxKind, IdentifierExpressionSyntax } from "../syntax/syntax-nodes";
import { CommandsParser } from "../syntax/command-parser";

export module CompletionService {
    export enum ResultKind {
        Class,
        Method,
        Property
    }

    export interface Result {
        kind: ResultKind;
        title: string;
        description: string;
    }

    export function provideCompletion(text: string, position: CompilerPosition): Result[] {
        const compilation = new Compilation(text);

        const objectAccessExpression = compilation.getSyntaxNode(position, SyntaxKind.ObjectAccessExpression);
        if (objectAccessExpression) {
            const result = new CompletionVisitor().visit(objectAccessExpression);
            if (result) {
                return result;
            }
        }

        const identifierExpression = compilation.getSyntaxNode(position, SyntaxKind.IdentifierExpression);
        if (identifierExpression) {
            const result = new CompletionVisitor().visit(identifierExpression);
            if (result) {
                return result;
            }
        }

        return [];
    }

    class CompletionVisitor extends SyntaxNodeVisitor<Result[]> {
        public visitObjectAccessExpression(node: ObjectAccessExpressionSyntax): Result[] | undefined {
            if (node.baseExpression.kind !== SyntaxKind.IdentifierExpression) {
                return undefined;
            }

            const libraryName = (node.baseExpression as IdentifierExpressionSyntax).identifierToken.token.text;
            const library = RuntimeLibraries.Metadata[libraryName];
            if (!library) {
                return undefined;
            }

            const results: Result[] = [];
            let memberName = node.identifierToken.token.text;
            if (memberName === CommandsParser.MissingTokenText) {
                memberName = "";
            }

            CompilerUtils.values(library.methods).forEach(method => {
                if (CompilerUtils.stringStartsWith(method.methodName, memberName)) {
                    results.push({
                        title: method.methodName,
                        description: method.description,
                        kind: ResultKind.Method
                    });
                }
            });

            CompilerUtils.values(library.properties).forEach(property => {
                if (CompilerUtils.stringStartsWith(property.propertyName, memberName)) {
                    results.push({
                        title: property.propertyName,
                        description: property.description,
                        kind: ResultKind.Property
                    });
                }
            });

            return results;
        }

        public visitIdentifierExpression(node: IdentifierExpressionSyntax): Result[] | undefined {
            const libraryName = node.identifierToken.token.text;
            return CompilerUtils.values(RuntimeLibraries.Metadata).filter(library => {
                return CompilerUtils.stringStartsWith(library.typeName, libraryName);
            }).map(library => {
                return {
                    title: library.typeName,
                    description: library.description,
                    kind: ResultKind.Class
                };
            });
        }
    }
}
