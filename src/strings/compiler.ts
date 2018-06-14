// This file is generated through a build task. Do not edit by hand.

export module CompilerResources {
    export const SyntaxNodes_Identifier = "identifier";
    export const SyntaxNodes_StringLiteral = "string";
    export const SyntaxNodes_NumberLiteral = "number";
    export const SyntaxNodes_Comment = "comment";
    export const SyntaxNodes_Label = "label";
    export const SyntaxNodes_Expression = "expression";
    export const ProgramKind_TextWindow = "Text Window";
    export const ProgramKind_Turtle = "Turtle";

    export function get(key: string): string {
        return (<any>CompilerResources)[key];
    }
}
