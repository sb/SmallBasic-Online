import { SupportedLibraries } from "../../compiler/runtime/supported-libraries";
import { CompilerPosition } from "../syntax/ranges";
import { Compilation } from "../compilation";
import { CompilerUtils } from "../compiler-utils";
import { SyntaxNodeVisitor, ObjectAccessExpressionSyntax, SyntaxKind, IdentifierExpressionSyntax } from "../syntax/syntax-nodes";
import { CommandsParser } from "../syntax/command-parser";

const libraries: SupportedLibraries = new SupportedLibraries();

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
            const library = libraries[libraryName];
            if (!library) {
                return undefined;
            }

            const results: Result[] = [];
            let memberName = node.identifierToken.token.text;
            if (memberName === CommandsParser.MissingTokenText) {
                memberName = "";
            }

            Object.keys(library.methods).forEach(method => {
                if (CompilerUtils.stringStartsWith(method, memberName)) {
                    results.push({
                        title: method,
                        description: library.methods[method].description,
                        kind: ResultKind.Method
                    });
                }
            });

            Object.keys(library.properties).forEach(property => {
                if (CompilerUtils.stringStartsWith(property, memberName)) {
                    results.push({
                        title: property,
                        description: library.properties[property].description,
                        kind: ResultKind.Property
                    });
                }
            });

            return results;
        }

        public visitIdentifierExpression(node: IdentifierExpressionSyntax): Result[] | undefined {
            const libraryName = node.identifierToken.token.text;
            return Object.keys(libraries).filter(name => {
                return CompilerUtils.stringStartsWith(name, libraryName);
            }).map(name => {
                return {
                    title: name,
                    description: libraries[name].description,
                    kind: ResultKind.Class
                };
            });
        }
    }
}
