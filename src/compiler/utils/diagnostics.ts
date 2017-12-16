import { TextRange } from "../syntax/text-markers";
import { ErrorToString } from "./strings";

export enum ErrorCode {
    // Scanner Errors
    Error_UnrecognizedCharacter,
    Error_UnterminatedStringLiteral,

    // Line Parser Errors
    Error_UnrecognizedCommand,
    Error_UnexpectedToken_ExpectingExpression,
    Error_UnexpectedToken_ExpectingToken,
    Error_UnexpectedToken_ExpectingEOL,
    Error_UnexpectedEOL_ExpectingExpression,
    Error_UnexpectedEOL_ExpectingToken,

    // Tree Parser Errors
    Error_UnexpectedCommand_ExpectingCommand,
    Error_UnexpectedEOF_ExpectingCommand,
    Error_CannotDefineASubInsideAnotherSub,
    Error_CannotHaveCommandWithoutPreviousCommand,
    Error_ValueIsNotANumber,

    // Binder Errors
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
    Error_ValueIsNotAssignable
}

export class Diagnostic {
    public readonly args: string[];
    public constructor(
        public readonly code: ErrorCode,
        public readonly range: TextRange,
        ...args: string[]) {
        this.args = args;
    }

    public toString(): string {
        const template = ErrorToString(this.code);
        return template.replace(/{[0-9]+}/g, match => this.args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
    }
}
