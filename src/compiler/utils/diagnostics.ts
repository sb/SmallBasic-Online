import { TextRange } from "../syntax/text-markers";
import { ErrorResources } from "../strings/errors";

export enum ErrorCode {
    // Scanner Errors
    UnrecognizedCharacter,
    UnterminatedStringLiteral,

    // Line Parser Errors
    UnrecognizedCommand,
    UnexpectedToken_ExpectingExpression,
    UnexpectedToken_ExpectingToken,
    UnexpectedToken_ExpectingEOL,
    UnexpectedEOL_ExpectingExpression,
    UnexpectedEOL_ExpectingToken,

    // Tree Parser Errors
    UnexpectedCommand_ExpectingCommand,
    UnexpectedEOF_ExpectingCommand,
    CannotDefineASubInsideAnotherSub,
    CannotHaveCommandWithoutPreviousCommand,
    ValueIsNotANumber,

    // Binder Errors
    TwoSubModulesWithTheSameName,
    LabelDoesNotExist,
    InvalidExpressionStatement,
    UnexpectedVoid_ExpectingValue,
    UnsupportedArrayBaseExpression,
    UnsupportedCallBaseExpression,
    UnexpectedArgumentsCount,
    PropertyHasNoSetter,
    UnsupportedDotBaseExpression,
    LibraryMemberNotFound,
    ValueIsNotAssignable
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
        const template = errorCodeToString(this.code);
        return template.replace(/{[0-9]+}/g, match => this.args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
    }
}

function errorCodeToString(code: ErrorCode): string {
    switch (code) {
        // Scanner Errors
        case ErrorCode.UnrecognizedCharacter: return ErrorResources.toString(ErrorResources.Keys.UnrecognizedCharacter);
        case ErrorCode.UnterminatedStringLiteral: return ErrorResources.toString(ErrorResources.Keys.UnterminatedStringLiteral);

        // Line Parser Errors
        case ErrorCode.UnrecognizedCommand: return ErrorResources.toString(ErrorResources.Keys.UnrecognizedCommand);
        case ErrorCode.UnexpectedToken_ExpectingExpression: return ErrorResources.toString(ErrorResources.Keys.UnexpectedToken_ExpectingExpression);
        case ErrorCode.UnexpectedToken_ExpectingToken: return ErrorResources.toString(ErrorResources.Keys.UnexpectedToken_ExpectingToken);
        case ErrorCode.UnexpectedToken_ExpectingEOL: return ErrorResources.toString(ErrorResources.Keys.UnexpectedToken_ExpectingEOL);
        case ErrorCode.UnexpectedEOL_ExpectingExpression: return ErrorResources.toString(ErrorResources.Keys.UnexpectedEOL_ExpectingExpression);
        case ErrorCode.UnexpectedEOL_ExpectingToken: return ErrorResources.toString(ErrorResources.Keys.UnexpectedEOL_ExpectingToken);

        // Tree Parser Errors
        case ErrorCode.UnexpectedCommand_ExpectingCommand: return ErrorResources.toString(ErrorResources.Keys.UnexpectedCommand_ExpectingCommand);
        case ErrorCode.UnexpectedEOF_ExpectingCommand: return ErrorResources.toString(ErrorResources.Keys.UnexpectedEOF_ExpectingCommand);
        case ErrorCode.CannotDefineASubInsideAnotherSub: return ErrorResources.toString(ErrorResources.Keys.CannotDefineASubInsideAnotherSub);
        case ErrorCode.CannotHaveCommandWithoutPreviousCommand: return ErrorResources.toString(ErrorResources.Keys.CannotHaveCommandWithoutPreviousCommand);
        case ErrorCode.ValueIsNotANumber: return ErrorResources.toString(ErrorResources.Keys.ValueIsNotANumber);

        // Binder Errors
        case ErrorCode.TwoSubModulesWithTheSameName: return ErrorResources.toString(ErrorResources.Keys.TwoSubModulesWithTheSameName);
        case ErrorCode.LabelDoesNotExist: return ErrorResources.toString(ErrorResources.Keys.LabelDoesNotExist);
        case ErrorCode.InvalidExpressionStatement: return ErrorResources.toString(ErrorResources.Keys.InvalidExpressionStatement);
        case ErrorCode.UnexpectedVoid_ExpectingValue: return ErrorResources.toString(ErrorResources.Keys.UnexpectedVoid_ExpectingValue);
        case ErrorCode.UnsupportedArrayBaseExpression: return ErrorResources.toString(ErrorResources.Keys.UnsupportedArrayBaseExpression);
        case ErrorCode.UnsupportedCallBaseExpression: return ErrorResources.toString(ErrorResources.Keys.UnsupportedCallBaseExpression);
        case ErrorCode.UnexpectedArgumentsCount: return ErrorResources.toString(ErrorResources.Keys.UnexpectedArgumentsCount);
        case ErrorCode.PropertyHasNoSetter: return ErrorResources.toString(ErrorResources.Keys.PropertyHasNoSetter);
        case ErrorCode.UnsupportedDotBaseExpression: return ErrorResources.toString(ErrorResources.Keys.UnsupportedDotBaseExpression);
        case ErrorCode.LibraryMemberNotFound: return ErrorResources.toString(ErrorResources.Keys.LibraryMemberNotFound);
        case ErrorCode.ValueIsNotAssignable: return ErrorResources.toString(ErrorResources.Keys.ValueIsNotAssignable);

        default: throw `Unexpected error code: ${code}`;
    }
}
