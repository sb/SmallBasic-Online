// This file is generated through a build task. Do not edit by hand.

import { Token } from "../syntax/tokens";
import { BaseExpressionSyntax } from "./syntax-expressions";
import { TextRange } from "../syntax/text-markers";

export enum CommandSyntaxKind {
    If,
    Else,
    ElseIf,
    EndIf,
    For,
    ForStepClause,
    EndFor,
    While,
    EndWhile,
    Label,
    GoTo,
    Sub,
    EndSub,
    Expression,
    Missing
}

export interface BaseCommandSyntax {
    readonly kind: CommandSyntaxKind;
}

export interface IfCommandSyntax extends BaseCommandSyntax {
    readonly ifToken: Token;
    readonly expression: BaseExpressionSyntax;
    readonly thenToken: Token;
}

export interface ElseCommandSyntax extends BaseCommandSyntax {
    readonly elseToken: Token;
}

export interface ElseIfCommandSyntax extends BaseCommandSyntax {
    readonly elseIfToken: Token;
    readonly expression: BaseExpressionSyntax;
    readonly thenToken: Token;
}

export interface EndIfCommandSyntax extends BaseCommandSyntax {
    readonly endIfToken: Token;
}

export interface ForCommandSyntax extends BaseCommandSyntax {
    readonly forToken: Token;
    readonly identifierToken: Token;
    readonly equalToken: Token;
    readonly fromExpression: BaseExpressionSyntax;
    readonly toToken: Token;
    readonly toExpression: BaseExpressionSyntax;
    readonly stepClause: ForStepClauseCommandSyntax | undefined;
}

export interface ForStepClauseCommandSyntax extends BaseCommandSyntax {
    readonly stepToken: Token;
    readonly expression: BaseExpressionSyntax;
}

export interface EndForCommandSyntax extends BaseCommandSyntax {
    readonly endForToken: Token;
}

export interface WhileCommandSyntax extends BaseCommandSyntax {
    readonly whileToken: Token;
    readonly expression: BaseExpressionSyntax;
}

export interface EndWhileCommandSyntax extends BaseCommandSyntax {
    readonly endWhileToken: Token;
}

export interface LabelCommandSyntax extends BaseCommandSyntax {
    readonly labelToken: Token;
    readonly colonToken: Token;
}

export interface GoToCommandSyntax extends BaseCommandSyntax {
    readonly goToToken: Token;
    readonly labelToken: Token;
}

export interface SubCommandSyntax extends BaseCommandSyntax {
    readonly subToken: Token;
    readonly nameToken: Token;
}

export interface EndSubCommandSyntax extends BaseCommandSyntax {
    readonly endSubToken: Token;
}

export interface ExpressionCommandSyntax extends BaseCommandSyntax {
    readonly expression: BaseExpressionSyntax;
}

export interface MissingCommandSyntax extends BaseCommandSyntax {
    readonly range: TextRange;
    readonly expectedKind: CommandSyntaxKind;
}

export class CommandSyntaxFactory {
    private constructor() {
    }

    public static If(
        ifToken: Token,
        expression: BaseExpressionSyntax,
        thenToken: Token)
        : IfCommandSyntax {
        return {
            kind: CommandSyntaxKind.If,
            ifToken: ifToken,
            expression: expression,
            thenToken: thenToken
        };
    }

    public static Else(
        elseToken: Token)
        : ElseCommandSyntax {
        return {
            kind: CommandSyntaxKind.Else,
            elseToken: elseToken
        };
    }

    public static ElseIf(
        elseIfToken: Token,
        expression: BaseExpressionSyntax,
        thenToken: Token)
        : ElseIfCommandSyntax {
        return {
            kind: CommandSyntaxKind.ElseIf,
            elseIfToken: elseIfToken,
            expression: expression,
            thenToken: thenToken
        };
    }

    public static EndIf(
        endIfToken: Token)
        : EndIfCommandSyntax {
        return {
            kind: CommandSyntaxKind.EndIf,
            endIfToken: endIfToken
        };
    }

    public static For(
        forToken: Token,
        identifierToken: Token,
        equalToken: Token,
        fromExpression: BaseExpressionSyntax,
        toToken: Token,
        toExpression: BaseExpressionSyntax,
        stepClause: ForStepClauseCommandSyntax | undefined)
        : ForCommandSyntax {
        return {
            kind: CommandSyntaxKind.For,
            forToken: forToken,
            identifierToken: identifierToken,
            equalToken: equalToken,
            fromExpression: fromExpression,
            toToken: toToken,
            toExpression: toExpression,
            stepClause: stepClause
        };
    }

    public static ForStepClause(
        stepToken: Token,
        expression: BaseExpressionSyntax)
        : ForStepClauseCommandSyntax {
        return {
            kind: CommandSyntaxKind.ForStepClause,
            stepToken: stepToken,
            expression: expression
        };
    }

    public static EndFor(
        endForToken: Token)
        : EndForCommandSyntax {
        return {
            kind: CommandSyntaxKind.EndFor,
            endForToken: endForToken
        };
    }

    public static While(
        whileToken: Token,
        expression: BaseExpressionSyntax)
        : WhileCommandSyntax {
        return {
            kind: CommandSyntaxKind.While,
            whileToken: whileToken,
            expression: expression
        };
    }

    public static EndWhile(
        endWhileToken: Token)
        : EndWhileCommandSyntax {
        return {
            kind: CommandSyntaxKind.EndWhile,
            endWhileToken: endWhileToken
        };
    }

    public static Label(
        labelToken: Token,
        colonToken: Token)
        : LabelCommandSyntax {
        return {
            kind: CommandSyntaxKind.Label,
            labelToken: labelToken,
            colonToken: colonToken
        };
    }

    public static GoTo(
        goToToken: Token,
        labelToken: Token)
        : GoToCommandSyntax {
        return {
            kind: CommandSyntaxKind.GoTo,
            goToToken: goToToken,
            labelToken: labelToken
        };
    }

    public static Sub(
        subToken: Token,
        nameToken: Token)
        : SubCommandSyntax {
        return {
            kind: CommandSyntaxKind.Sub,
            subToken: subToken,
            nameToken: nameToken
        };
    }

    public static EndSub(
        endSubToken: Token)
        : EndSubCommandSyntax {
        return {
            kind: CommandSyntaxKind.EndSub,
            endSubToken: endSubToken
        };
    }

    public static Expression(
        expression: BaseExpressionSyntax)
        : ExpressionCommandSyntax {
        return {
            kind: CommandSyntaxKind.Expression,
            expression: expression
        };
    }

    public static Missing(
        range: TextRange,
        expectedKind: CommandSyntaxKind)
        : MissingCommandSyntax {
        return {
            kind: CommandSyntaxKind.Missing,
            range: range,
            expectedKind: expectedKind
        };
    }
}
