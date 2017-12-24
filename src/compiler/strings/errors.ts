// This file is generated through a build task. Do not edit by hand.

export module ErrorResources {
    export enum Keys {
        UnrecognizedCharacter,
        UnterminatedStringLiteral,
        UnrecognizedCommand,
        UnexpectedToken_ExpectingExpression,
        UnexpectedToken_ExpectingToken,
        UnexpectedToken_ExpectingEOL,
        UnexpectedEOL_ExpectingExpression,
        UnexpectedEOL_ExpectingToken,
        UnexpectedCommand_ExpectingCommand,
        UnexpectedEOF_ExpectingCommand,
        CannotDefineASubInsideAnotherSub,
        CannotHaveCommandWithoutPreviousCommand,
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
        ValueIsNotANumber,
        ValueIsNotAssignable,
        CannotUseAnArrayAsAnIndexToAnotherArray,
        CannotUseOperatorWithAnArray,
        CannotUseOperatorWithAString,
        CannotDivideByZero
    }

    export function toString(key: Keys): string {
        switch (key) {
            case Keys.UnrecognizedCharacter:
                return "I don't understand this character '{0}'.";
            case Keys.UnterminatedStringLiteral:
                return "This string is missing its right double quotes.";
            case Keys.UnrecognizedCommand:
                return "'{0}' is not a valid command.";
            case Keys.UnexpectedToken_ExpectingExpression:
                return "Unexpected '{0}' here. I was expecting an expression instead.";
            case Keys.UnexpectedToken_ExpectingToken:
                return "Unexpected '{0}' here. I was expecting a token of type '{1}' instead.";
            case Keys.UnexpectedToken_ExpectingEOL:
                return "Unexpected '{0}' here. I was expecting a new line after the previous command.";
            case Keys.UnexpectedEOL_ExpectingExpression:
                return "Unexpected end of line here. I was expecting an expression instead.";
            case Keys.UnexpectedEOL_ExpectingToken:
                return "Unexpected end of line here. I was expecting a token of type '{0}' instead.";
            case Keys.UnexpectedCommand_ExpectingCommand:
                return "Unexpected command of type '{0}'. I was expecting a command of type '{1}'.";
            case Keys.UnexpectedEOF_ExpectingCommand:
                return "Unexpected end of file. I was expecting a command of type '{0}'.";
            case Keys.CannotDefineASubInsideAnotherSub:
                return "You cannot define a sub-module inside another sub-module.";
            case Keys.CannotHaveCommandWithoutPreviousCommand:
                return "You cannot write '{0}' without an earlier '{1}'.";
            case Keys.TwoSubModulesWithTheSameName:
                return "Another sub-module with the same name '{0}' is already defined.";
            case Keys.LabelDoesNotExist:
                return "No label with the name '{0}' exists in the same module.";
            case Keys.UnassignedExpressionStatement:
                return "This value is not assigned to anything. Did you mean to assign it to a variable?";
            case Keys.InvalidExpressionStatement:
                return "This expression is not a valid statement.";
            case Keys.UnexpectedVoid_ExpectingValue:
                return "This expression must return a value to be used here.";
            case Keys.UnsupportedArrayBaseExpression:
                return "This expression is not a valid array.";
            case Keys.UnsupportedCallBaseExpression:
                return "This expression is not a valid submodule or method to be called.";
            case Keys.UnexpectedArgumentsCount:
                return "I was expecting {0} arguments, but found {1} instead.";
            case Keys.PropertyHasNoSetter:
                return "This property cannot be set. You can only get its value.";
            case Keys.UnsupportedDotBaseExpression:
                return "You can only use dot access with a library. Did you mean to use an existing library instead?";
            case Keys.LibraryMemberNotFound:
                return "The library '{0}' has no member named '{1}'.";
            case Keys.ValueIsNotANumber:
                return "The value '{0}' is not a valid number.";
            case Keys.ValueIsNotAssignable:
                return "You cannot assign to this expression. Did you mean to use a variable instead?";
            case Keys.CannotUseAnArrayAsAnIndexToAnotherArray:
                return "You cannot use an array as an index to access another array. Did you mean to use a string or a number instead?";
            case Keys.CannotUseOperatorWithAnArray:
                return "You cannot use the operator '{0}' with an array value";
            case Keys.CannotUseOperatorWithAString:
                return "You cannot use the operator '{0}' with a string value";
            case Keys.CannotDivideByZero:
                return "You cannot divide by zero. Please consider checking the divisor before dividing.";
            default:
                throw "Key not found: " + key;
        }
    }
}
