// This file is generated through a build task. Do not edit by hand.

import { BaseStatementSyntax } from "./syntax-statements";
import { BaseBoundExpression } from "./bound-expressions";

export enum BoundStatementKind {
    If,
    IfConditionPart,
    ElseIfConditionPart,
    ElseConditionPart,
    While,
    For,
    Label,
    GoTo,
    SubModuleCall,
    LibraryMethodCall,
    VariableAssignment,
    PropertyAssignment,
    ArrayAssignment,
    InvalidExpression
}

export interface BaseBoundStatement {
    readonly kind: BoundStatementKind;
    readonly syntax: BaseStatementSyntax;
}

export interface IfBoundStatement extends BaseBoundStatement {
    readonly ifPart: IfConditionPartBoundStatement;
    readonly elseIfParts: ElseIfConditionPartBoundStatement[];
    readonly elsePart: ElseConditionPartBoundStatement | undefined;
}

export interface IfConditionPartBoundStatement extends BaseBoundStatement {
    readonly condition: BaseBoundExpression;
    readonly statementsList: BaseBoundStatement[];
}

export interface ElseIfConditionPartBoundStatement extends BaseBoundStatement {
    readonly condition: BaseBoundExpression;
    readonly statementsList: BaseBoundStatement[];
}

export interface ElseConditionPartBoundStatement extends BaseBoundStatement {
    readonly statementsList: BaseBoundStatement[];
}

export interface WhileBoundStatement extends BaseBoundStatement {
    readonly condition: BaseBoundExpression;
    readonly statementsList: BaseBoundStatement[];
}

export interface ForBoundStatement extends BaseBoundStatement {
    readonly identifier: string;
    readonly fromExpression: BaseBoundExpression;
    readonly toExpression: BaseBoundExpression;
    readonly stepExpression: BaseBoundExpression | undefined;
    readonly statementsList: BaseBoundStatement[];
}

export interface LabelBoundStatement extends BaseBoundStatement {
    readonly identifier: string;
}

export interface GoToBoundStatement extends BaseBoundStatement {
    readonly identifier: string;
}

export interface SubModuleCallBoundStatement extends BaseBoundStatement {
    readonly name: string;
}

export interface LibraryMethodCallBoundStatement extends BaseBoundStatement {
    readonly library: string;
    readonly method: string;
    readonly argumentsList: BaseBoundExpression[];
}

export interface VariableAssignmentBoundStatement extends BaseBoundStatement {
    readonly identifier: string;
    readonly value: BaseBoundExpression;
}

export interface PropertyAssignmentBoundStatement extends BaseBoundStatement {
    readonly library: string;
    readonly property: string;
    readonly value: BaseBoundExpression;
}

export interface ArrayAssignmentBoundStatement extends BaseBoundStatement {
    readonly identifier: string;
    readonly indices: BaseBoundExpression[];
    readonly value: BaseBoundExpression;
}

export interface InvalidExpressionBoundStatement extends BaseBoundStatement {
    readonly expression: BaseBoundExpression;
}

export class BoundStatementFactory {
    private constructor() {
    }

    public static If(
        syntax: BaseStatementSyntax,
        ifPart: IfConditionPartBoundStatement,
        elseIfParts: ElseIfConditionPartBoundStatement[],
        elsePart: ElseConditionPartBoundStatement | undefined)
        : IfBoundStatement {
        return {
            kind: BoundStatementKind.If,
            syntax: syntax,
            ifPart: ifPart,
            elseIfParts: elseIfParts,
            elsePart: elsePart
        };
    }

    public static IfConditionPart(
        syntax: BaseStatementSyntax,
        condition: BaseBoundExpression,
        statementsList: BaseBoundStatement[])
        : IfConditionPartBoundStatement {
        return {
            kind: BoundStatementKind.IfConditionPart,
            syntax: syntax,
            condition: condition,
            statementsList: statementsList
        };
    }

    public static ElseIfConditionPart(
        syntax: BaseStatementSyntax,
        condition: BaseBoundExpression,
        statementsList: BaseBoundStatement[])
        : ElseIfConditionPartBoundStatement {
        return {
            kind: BoundStatementKind.ElseIfConditionPart,
            syntax: syntax,
            condition: condition,
            statementsList: statementsList
        };
    }

    public static ElseConditionPart(
        syntax: BaseStatementSyntax,
        statementsList: BaseBoundStatement[])
        : ElseConditionPartBoundStatement {
        return {
            kind: BoundStatementKind.ElseConditionPart,
            syntax: syntax,
            statementsList: statementsList
        };
    }

    public static While(
        syntax: BaseStatementSyntax,
        condition: BaseBoundExpression,
        statementsList: BaseBoundStatement[])
        : WhileBoundStatement {
        return {
            kind: BoundStatementKind.While,
            syntax: syntax,
            condition: condition,
            statementsList: statementsList
        };
    }

    public static For(
        syntax: BaseStatementSyntax,
        identifier: string,
        fromExpression: BaseBoundExpression,
        toExpression: BaseBoundExpression,
        stepExpression: BaseBoundExpression | undefined,
        statementsList: BaseBoundStatement[])
        : ForBoundStatement {
        return {
            kind: BoundStatementKind.For,
            syntax: syntax,
            identifier: identifier,
            fromExpression: fromExpression,
            toExpression: toExpression,
            stepExpression: stepExpression,
            statementsList: statementsList
        };
    }

    public static Label(
        syntax: BaseStatementSyntax,
        identifier: string)
        : LabelBoundStatement {
        return {
            kind: BoundStatementKind.Label,
            syntax: syntax,
            identifier: identifier
        };
    }

    public static GoTo(
        syntax: BaseStatementSyntax,
        identifier: string)
        : GoToBoundStatement {
        return {
            kind: BoundStatementKind.GoTo,
            syntax: syntax,
            identifier: identifier
        };
    }

    public static SubModuleCall(
        syntax: BaseStatementSyntax,
        name: string)
        : SubModuleCallBoundStatement {
        return {
            kind: BoundStatementKind.SubModuleCall,
            syntax: syntax,
            name: name
        };
    }

    public static LibraryMethodCall(
        syntax: BaseStatementSyntax,
        library: string,
        method: string,
        argumentsList: BaseBoundExpression[])
        : LibraryMethodCallBoundStatement {
        return {
            kind: BoundStatementKind.LibraryMethodCall,
            syntax: syntax,
            library: library,
            method: method,
            argumentsList: argumentsList
        };
    }

    public static VariableAssignment(
        syntax: BaseStatementSyntax,
        identifier: string,
        value: BaseBoundExpression)
        : VariableAssignmentBoundStatement {
        return {
            kind: BoundStatementKind.VariableAssignment,
            syntax: syntax,
            identifier: identifier,
            value: value
        };
    }

    public static PropertyAssignment(
        syntax: BaseStatementSyntax,
        library: string,
        property: string,
        value: BaseBoundExpression)
        : PropertyAssignmentBoundStatement {
        return {
            kind: BoundStatementKind.PropertyAssignment,
            syntax: syntax,
            library: library,
            property: property,
            value: value
        };
    }

    public static ArrayAssignment(
        syntax: BaseStatementSyntax,
        identifier: string,
        indices: BaseBoundExpression[],
        value: BaseBoundExpression)
        : ArrayAssignmentBoundStatement {
        return {
            kind: BoundStatementKind.ArrayAssignment,
            syntax: syntax,
            identifier: identifier,
            indices: indices,
            value: value
        };
    }

    public static InvalidExpression(
        syntax: BaseStatementSyntax,
        expression: BaseBoundExpression)
        : InvalidExpressionBoundStatement {
        return {
            kind: BoundStatementKind.InvalidExpression,
            syntax: syntax,
            expression: expression
        };
    }
}
