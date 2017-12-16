# SuperBasic
An open-source IDE/runtime for the Small Basic programming language.

## Language Grammar

### Non-terminals

```
PROGRAM =                           CODE_LINE*
CODE_LINE =                         BASE_STMT? COMMENT?

BASE_STMT =                         IF_STMT | ELSE_STMT | ELSE_IF_STMT | END_IF_STMT
                                    | FOR_STMT | END_FOR_STMT
                                    | WHILE_STMT | END_WHILE_STMT
                                    | LABEL_STMT | GO_TO_STMT
                                    | SUB_STMT | END_SUB_STMT
                                    | CALL_EXPR | EQUAL_EXPR

IF_STMT =                           IF_KEYWORD BASE_EXPR THEN_KEYWORD
ELSE_STMT =                         ELSE_KEYWORD
ELSE_IF_STMT =                      ELSE_IF_KEYWORD BASE_EXPR THEN_KEYWORD
END_IF_STMT =                       END_IF_KEYWORD
FOR_STMT =                          FOR_KEYWORD ID EQUAL BASE_EXPR TO_KEYWORD BASE_EXPR (STEP_KEYWORD BASE_EXPR)?
END_FOR_STMT =                      END_FOR_KEYWORD
WHILE_STMT =                        WHILE_KEYWORD BASE_EXPR
END_WHILE_STMT =                    END_WHILE_KEYWORD
LABEL_STMT =                        ID COLON
GO_TO_STMT =                        GO_TO_KEYWORD ID
SUB_STMT =                          SUB_KEYWORD ID
END_SUB_STMT =                      END_SUB_KEYWORD
```

### Expressions

```
BASE_EXPR =                         UNARY_MINUS_EXPR 
                                    | OR_EXPR
UNARY_MINUS_EXPR =                  MINUS BASE_EXPR
OR_EXPR =                           AND_EXPR (OR AND_EXPR)*
AND_EXPR =                          NOT_EQUAL_EXPR (AND NOT_EQUAL_EXPR)*
NOT_EQUAL_EXPR =                    EQUAL_EXPR (NOT_EQUAL EQUAL_EXPR)*
EQUAL_EXPR =                        LESS_THAN_EXPR (EQUAL LESS_THAN_EXPR)*
LESS_THAN_EXPR =                    GREATER_THAN_EXPR (LESS_THAN GREATER_THAN_EXPR)*
GREATER_THAN_EXPR =                 LESS_THAN_OR_EQUAL_EXPR (GREATER_THAN LESS_THAN_OR_EQUAL_EXPR)*
LESS_THAN_OR_EQUAL_EXPR =           GREATER_THAN_OR_EQUAL_EXPR (LESS_THAN_OR_EQUAL GREATER_THAN_OR_EQUAL_EXPR)*
GREATER_THAN_OR_EQUAL_EXPR =        ADDITION_EXPR (GREATER_THAN_OR_EQUAL ADDITION_EXPR)*
ADDITION_EXPR =                     SUBTRACTION_expr (PLUS SUBTRACTION_expr)*
SUBTRACTION_expr =                  MULTIPLICATION_EXPR (MINUS MULTIPLICATION_EXPR)*
MULTIPLICATION_EXPR =               DIVISION_EXPR (MULTIPLY DIVISION_EXPR)*
DIVISION_EXPR =                     CORE_EXPR (DIVIDE CORE_EXPR)*

CORE_EXPR =                         TERMINAL_EXPR (EXPR_POSTFIX)*
EXPR_POSTFIX =                      DOT_ACCESS_EXPR
                                    | ARRAY_ACCESS_EXPR
                                    | CALL_EXPR
DOT_ACCESS_EXPR =                   DOT ID
ARRAY_ACCESS_EXPR =                 LEFT_SQUARE_BRACKET BASE_EXPR RIGHT_SQUARE_BRACKET
CALL_EXPR =                         LEFT_PAREN (BASE_EXPR (COMMA BASE_EXPR)*)? RIGHT_PAREN
TERMINAL_EXPR =                     ID
                                    | NUMBER_LITERAL
                                    | STRING_LITERAL
                                    | LEFT_PAREN BASE_EXPR RIGHT_PAREN
```

### Terminals

```
IF_KEYWORD =                        If
THEN_KEYWORD =                      Then
ELSE_KEYWORD =                      Else
ELSE_IF_KEYWORD =                   ElseIf
END_IF_KEYWORD =                    EndIf
FOR_KEYWORD =                       For
TO_KEYWORD =                        To
STEP_KEYWORD =                      Step
END_FOR_KEYWORD =                   EndFor
GO_TO_KEYWORD =                     GoTo
WHILE_KEYWORD =                     While
END_WHILE_KEYWORD =                 EndWhile
SUB_KEYWORD =                       Sub
END_SUB_KEYWORD =                   EndSub

OR =                                Or
AND =                               And

LEFT_PAREN =                        (
RIGHT_PAREN =                       )
LEFT_SQUARE_BRACKET =               [
RIGHT_SQUARE_BRACKET =              ]
DOT =                               .
COMMA =                             ,
EQUAL =                             =
COLON =                             :
PLUS =                              +
MINUS =                             -
MULTIPLY =                          *
DIVIDE =                            /
LESS_THAN =                         <
NOT_EQUAL =                         <>
LESS_THAN_OR_EQUAL =                <=
GREATER_THAN =                      >
GREATER_THAN_OR_EQUAL =             >=

NUMBER_LITERAL =                    [0-9]+(\.[0-9]+)?
STRING_LITERAL =                    \"[^\"]*\"
ID =                                [_a-zA-Z][_a-zA-Z0-9]*

COMMENT =                           '[^\n]*
```
