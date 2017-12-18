// This file is generated through a build task. Do not edit by hand.

export module TokenKindResources {
    export enum Keys {
        Identifier,
        StringLiteral,
        NumberLiteral,
        Comment
    }

    export function toString(key: Keys): string {
        switch (key) {
            case Keys.Identifier:
                return "identifier";
            case Keys.StringLiteral:
                return "string";
            case Keys.NumberLiteral:
                return "number";
            case Keys.Comment:
                return "comment";
            default:
                throw "Key not found: " + key;
        }
    }
}
