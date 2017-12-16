// This file is generated through a build task. Do not edit by hand.

import {ErrorCode} from "./diagnostics";

export enum StringKey {
    Error_UnrecognizedCharacter,
    Error_UnterminatedStringLiteral,
    Error_UnrecognizedCommand,
    Error_UnexpectedToken_ExpectingExpression,
    Error_UnexpectedToken_ExpectingToken,
    Error_UnexpectedToken_ExpectingEOL,
    Error_UnexpectedEOL_ExpectingExpression,
    Error_UnexpectedEOL_ExpectingToken,
    Error_UnexpectedCommand_ExpectingCommand,
    Error_UnexpectedEOF_ExpectingCommand,
    Error_CannotDefineASubInsideAnotherSub,
    Error_CannotHaveCommandWithoutPreviousCommand,
    Error_TwoSubModulesWithTheSameName,
    Error_LabelDoesNotExist,
    Error_InvalidExpressionStatement,
    Error_UnexpectedVoid_ExpectingValue,
    Error_UnsupportedArrayBaseExpression,
    Error_UnsupportedCallBaseExpression,
    Error_UnexpectedArgumentsCount,
    Error_PropertyHasNoSetter,
    Error_UnsupportedDotBaseExpression,
    Error_LibraryMemberNotFound,
    Error_ValueIsNotANumber,
    Error_ValueIsNotAssignable,
    TokenKind_Identifier,
    TokenKind_StringLiteral,
    TokenKind_NumberLiteral,
    TokenKind_Comment,
    SyntaxKind_IfCommandSyntax,
    SyntaxKind_ElseCommandSyntax,
    SyntaxKind_ElseIfCommandSyntax,
    SyntaxKind_EndIfCommandSyntax,
    SyntaxKind_ForCommandSyntax,
    SyntaxKind_EndForCommandSyntax,
    SyntaxKind_WhileCommandSyntax,
    SyntaxKind_EndWhileCommandSyntax,
    SyntaxKind_LabelCommandSyntax,
    SyntaxKind_GoToCommandSyntax,
    SyntaxKind_SubCommandSyntax,
    SyntaxKind_EndSubCommandSyntax,
    SyntaxKind_ExpressionCommandSyntax
}

export function KeyToString(key: StringKey): string {
    return dictionary(StringKey[key]);
}

export function ErrorToString(code: ErrorCode): string {
    return dictionary(ErrorCode[code]);
}

function dictionary(key: string): string {
    switch (key) {
        case "Error_UnrecognizedCharacter":
            return "I don't understand this character '{0}'.";
        case "Error_UnterminatedStringLiteral":
            return "This string is missing its right double quotes.";
        case "Error_UnrecognizedCommand":
            return "'{0}' is not a valid command.";
        case "Error_UnexpectedToken_ExpectingExpression":
            return "Unexpected '{0}' here. I was expecting an expression instead.";
        case "Error_UnexpectedToken_ExpectingToken":
            return "Unexpected '{0}' here. I was expecting a token of type '{1}' instead.";
        case "Error_UnexpectedToken_ExpectingEOL":
            return "Unexpected '{0}' here. I was expecting a new line after the previous command.";
        case "Error_UnexpectedEOL_ExpectingExpression":
            return "Unexpected end of line here. I was expecting an expression instead.";
        case "Error_UnexpectedEOL_ExpectingToken":
            return "Unexpected end of line here. I was expecting a token of type '{0}' instead.";
        case "Error_UnexpectedCommand_ExpectingCommand":
            return "Unexpected command of type '{0}'. I was expecting a command of type '{1}'.";
        case "Error_UnexpectedEOF_ExpectingCommand":
            return "Unexpected end of file. I was expecting a command of type '{0}'.";
        case "Error_CannotDefineASubInsideAnotherSub":
            return "You cannot define a sub-module inside another sub-module.";
        case "Error_CannotHaveCommandWithoutPreviousCommand":
            return "You cannot write '{0}' without an earlier '{1}'.";
        case "Error_TwoSubModulesWithTheSameName":
            return "Another sub-module with the same name '{0}' is already defined.";
        case "Error_LabelDoesNotExist":
            return "No label with the name '{0}' exists in the same module.";
        case "Error_InvalidExpressionStatement":
            return "This value is not assigned to anything. Did you mean to assign it to a variable?";
        case "Error_UnexpectedVoid_ExpectingValue":
            return "This expression must return a value to be used here.";
        case "Error_UnsupportedArrayBaseExpression":
            return "This expression is not a valid array.";
        case "Error_UnsupportedCallBaseExpression":
            return "This expression is not a valid submodule or method to be called.";
        case "Error_UnexpectedArgumentsCount":
            return "I was expecting {0} arguments, but found {1} instead.";
        case "Error_PropertyHasNoSetter":
            return "This property cannot be set. You can only get its value.";
        case "Error_UnsupportedDotBaseExpression":
            return "You can only use dot access with a library. Did you mean to use an existing library instead?";
        case "Error_LibraryMemberNotFound":
            return "The library '{0}' has no member named '{1}'.";
        case "Error_ValueIsNotANumber":
            return "The value '{0}' is not a valid number.";
        case "Error_ValueIsNotAssignable":
            return "You cannot assign to this expression. Did you mean to use a variable instead?";
        case "TokenKind_Identifier":
            return "identifier";
        case "TokenKind_StringLiteral":
            return "string";
        case "TokenKind_NumberLiteral":
            return "number";
        case "TokenKind_Comment":
            return "comment";
        case "SyntaxKind_IfCommandSyntax":
            return "If command";
        case "SyntaxKind_ElseCommandSyntax":
            return "Else command";
        case "SyntaxKind_ElseIfCommandSyntax":
            return "ElseIf command";
        case "SyntaxKind_EndIfCommandSyntax":
            return "EndIf command";
        case "SyntaxKind_ForCommandSyntax":
            return "For command";
        case "SyntaxKind_EndForCommandSyntax":
            return "EndFor command";
        case "SyntaxKind_WhileCommandSyntax":
            return "While command";
        case "SyntaxKind_EndWhileCommandSyntax":
            return "EndWhile command";
        case "SyntaxKind_LabelCommandSyntax":
            return "label command";
        case "SyntaxKind_GoToCommandSyntax":
            return "GoTo command";
        case "SyntaxKind_SubCommandSyntax":
            return "Sub command";
        case "SyntaxKind_EndSubCommandSyntax":
            return "EndSub command";
        case "SyntaxKind_ExpressionCommandSyntax":
            return "expression command";
        default:
            throw "Key not found" + key;
    }
}
