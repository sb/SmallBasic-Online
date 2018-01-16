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
    UnassignedExpressionStatement,
    InvalidExpressionStatement,
    UnexpectedVoid_ExpectingValue,
    UnsupportedArrayBaseExpression,
    UnsupportedCallBaseExpression,
    UnexpectedArgumentsCount,
    PropertyHasNoSetter,
    UnsupportedDotBaseExpression,
    LibraryMemberNotFound,
    ValueIsNotAssignable,

    // Runtime Errors
    CannotUseAnArrayAsAnIndexToAnotherArray,
    CannotUseOperatorWithAnArray,
    CannotUseOperatorWithAString,
    CannotDivideByZero
}

export class Diagnostic {
    public readonly args: ReadonlyArray<string>;
    public constructor(
        public readonly code: ErrorCode,
        public readonly range: TextRange,
        ...args: string[]) {
        this.args = args;
    }

    public toString(): string {
        const template = (ErrorResources as any)[ErrorCode[this.code]] as string;

        if (!template) {
            throw new Error(`Error code ${ErrorCode[this.code]} has no string resource`);
        }

        return template.replace(/{[0-9]+}/g, match => this.args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
    }
}
