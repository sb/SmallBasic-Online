// This file is generated through a build task. Do not edit by hand.

export module SyntaxKindResources {
    export enum Keys {
        IfCommandSyntax,
        ElseCommandSyntax,
        ElseIfCommandSyntax,
        EndIfCommandSyntax,
        ForCommandSyntax,
        EndForCommandSyntax,
        WhileCommandSyntax,
        EndWhileCommandSyntax,
        LabelCommandSyntax,
        GoToCommandSyntax,
        SubCommandSyntax,
        EndSubCommandSyntax,
        ExpressionCommandSyntax
    }

    export function toString(key: Keys): string {
        switch (key) {
            case Keys.IfCommandSyntax:
                return "If command";
            case Keys.ElseCommandSyntax:
                return "Else command";
            case Keys.ElseIfCommandSyntax:
                return "ElseIf command";
            case Keys.EndIfCommandSyntax:
                return "EndIf command";
            case Keys.ForCommandSyntax:
                return "For command";
            case Keys.EndForCommandSyntax:
                return "EndFor command";
            case Keys.WhileCommandSyntax:
                return "While command";
            case Keys.EndWhileCommandSyntax:
                return "EndWhile command";
            case Keys.LabelCommandSyntax:
                return "label command";
            case Keys.GoToCommandSyntax:
                return "GoTo command";
            case Keys.SubCommandSyntax:
                return "Sub command";
            case Keys.EndSubCommandSyntax:
                return "EndSub command";
            case Keys.ExpressionCommandSyntax:
                return "expression command";
            default:
                throw "Key not found: " + key;
        }
    }
}
