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

    export function provideCompletion(compilation: Compilation, position: CompilerPosition): Result[] {
        const objectAccessExpression = compilation.getSyntaxNode(position, SyntaxKind.ObjectAccessExpression);
        if (objectAccessExpression) {
            const visitor = new CompletionVisitor();
            visitor.visit(objectAccessExpression);
            return visitor.results;
        }

        const identifierExpression = compilation.getSyntaxNode(position, SyntaxKind.IdentifierExpression);
        if (identifierExpression) {
            const visitor = new CompletionVisitor();
            visitor.visit(identifierExpression);
            return visitor.results;
        }

        return [];
    }

    class CompletionVisitor extends SyntaxNodeVisitor {
        private _allResults: Result[] = [];

        public get results(): Result[] {
            return this._allResults;
        }

        private addResult(result: Result): void {
            this._allResults.push(result);
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

            let memberName = node.identifierToken.token.text;
            if (memberName === CommandsParser.MissingTokenText) {
                memberName = "";
            }

            CompilerUtils.values(library.methods).forEach(method => {
                if (CompilerUtils.stringStartsWith(method.methodName, memberName)) {
                    this.addResult({
                        title: method.methodName,
                        description: method.description,
                        kind: ResultKind.Method
                    });
                }
            });

            CompilerUtils.values(library.properties).forEach(property => {
                if (CompilerUtils.stringStartsWith(property.propertyName, memberName)) {
                    this.addResult({
                        title: property.propertyName,
                        description: property.description,
                        kind: ResultKind.Property
                    });
                }
            });
        }

        public visitIdentifierExpression(node: IdentifierExpressionSyntax): void {
            const libraryName = node.identifierToken.token.text;

            CompilerUtils.values(RuntimeLibraries.Metadata).forEach(library => {
                if (CompilerUtils.stringStartsWith(library.typeName, libraryName)) {
                    this.addResult({
                        title: library.typeName,
                        description: library.description,
                        kind: ResultKind.Class
                    });
                }
            });
        }
    }
}
