import { Compilation } from "../../compiler/compilation";
import { CompilerRange, CompilerPosition } from "../syntax/ranges";
import { BoundKind, LibraryPropertyBoundExpression, LibraryMethodCallBoundExpression, LibraryMethodCallBoundStatement } from "../binding/bound-nodes";
import { SupportedLibraries } from "../runtime/supported-libraries";

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

        const boundNode = compilation.getBoundNode(position);
        if (boundNode) {
            switch (boundNode.kind) {
                case BoundKind.LibraryMethodCallStatement:
                    const boundMethodCallStatement = boundNode as LibraryMethodCallBoundStatement;
                    return {
                        range: boundNode.syntax.range,
                        text: [
                            `${boundMethodCallStatement.libraryName}.${boundMethodCallStatement.methodName}`,
                            libraries[boundMethodCallStatement.libraryName].methods[boundMethodCallStatement.methodName].description
                        ]
                    };
                case BoundKind.LibraryMethodCallExpression:
                    const boundMethodCall = boundNode as LibraryMethodCallBoundExpression;
                    return {
                        range: boundNode.syntax.range,
                        text: [
                            `${boundMethodCall.libraryName}.${boundMethodCall.methodName}`,
                            libraries[boundMethodCall.libraryName].methods[boundMethodCall.methodName].description
                        ]
                    };
                case BoundKind.LibraryPropertyExpression:
                    const boundLibraryProperty = boundNode as LibraryPropertyBoundExpression;
                    return {
                        range: boundNode.syntax.range,
                        text: [
                            `${boundLibraryProperty.libraryName}.${boundLibraryProperty.propertyName}`,
                            libraries[boundLibraryProperty.libraryName].properties[boundLibraryProperty.propertyName].description
                        ]
                    };
            }
        }
        return undefined;
    }
}
