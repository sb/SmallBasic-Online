// This file is generated through a build task. Do not edit by hand.

export module DiagnosticsResources {
    export const UnrecognizedCharacter = "I don't understand this character '{0}'.";
    export const UnterminatedStringLiteral = "This string is missing its right double quotes.";
    export const UnrecognizedCommand = "'{0}' is not a valid command.";
    export const UnexpectedToken_ExpectingExpression = "Unexpected '{0}' here. I was expecting an expression instead.";
    export const UnexpectedToken_ExpectingToken = "Unexpected '{0}' here. I was expecting a token of type '{1}' instead.";
    export const UnexpectedToken_ExpectingEOL = "Unexpected '{0}' here. I was expecting a new line after the previous command.";
    export const UnexpectedEOL_ExpectingExpression = "Unexpected end of line here. I was expecting an expression instead.";
    export const UnexpectedEOL_ExpectingToken = "Unexpected end of line here. I was expecting a token of type '{0}' instead.";
    export const UnexpectedCommand_ExpectingCommand = "Unexpected command of type '{0}'. I was expecting a command of type '{1}'.";
    export const UnexpectedEOF_ExpectingCommand = "Unexpected end of file. I was expecting a command of type '{0}'.";
    export const CannotDefineASubInsideAnotherSub = "You cannot define a sub-module inside another sub-module.";
    export const CannotHaveCommandWithoutPreviousCommand = "You cannot write a command of type '{0}' without an earlier command of type '{1}'.";
    export const TwoSubModulesWithTheSameName = "Another sub-module with the same name '{0}' is already defined.";
    export const LabelDoesNotExist = "No label with the name '{0}' exists in the same module.";
    export const UnassignedExpressionStatement = "This value is not assigned to anything. Did you mean to assign it to a variable?";
    export const InvalidExpressionStatement = "This expression is not a valid statement.";
    export const UnexpectedVoid_ExpectingValue = "This expression must return a value to be used here.";
    export const UnsupportedArrayBaseExpression = "This expression is not a valid array.";
    export const UnsupportedCallBaseExpression = "This expression is not a valid submodule or method to be called.";
    export const UnexpectedArgumentsCount = "I was expecting {0} arguments, but found {1} instead.";
    export const PropertyHasNoSetter = "This property cannot be set. You can only get its value.";
    export const UnsupportedDotBaseExpression = "You can only use dot access with a library. Did you mean to use an existing library instead?";
    export const LibraryMemberNotFound = "The library '{0}' has no member named '{1}'.";
    export const ValueIsNotANumber = "The value '{0}' is not a valid number.";
    export const ValueIsNotAssignable = "You cannot assign to this expression. Did you mean to use a variable instead?";
    export const ProgramKindChanged = "You already used libraries of type '{0}', so you cannot use a library of type '{1}' in the same program.";
    export const CannotUseAnArrayAsAnIndexToAnotherArray = "You cannot use an array as an index to access another array. Did you mean to use a string or a number instead?";
    export const CannotUseOperatorWithAnArray = "You cannot use the operator '{0}' with an array value";
    export const CannotUseOperatorWithAString = "You cannot use the operator '{0}' with a string value";
    export const CannotDivideByZero = "You cannot divide by zero. Please consider checking the divisor before dividing.";
    export const PoppingAnEmptyStack = "This stack has no elements to be popped";

    export function get(key: string): string {
        return (<any>DiagnosticsResources)[key];
    }
}
