import "./syntax/scanner";
import "./syntax/command-parser";
import "./syntax/statements-parser";

import "./binding/module-binder";
import "./binding/statement-binder";
import "./binding/expression-binder";

import "./runtime/expressions/addition";
import "./runtime/expressions/array-access";
import "./runtime/expressions/division";
import "./runtime/expressions/equality";
import "./runtime/expressions/greater-than-or-equal";
import "./runtime/expressions/greater-than";
import "./runtime/expressions/less-than-or-equal";
import "./runtime/expressions/less-than";
import "./runtime/expressions/logical-operators";
import "./runtime/expressions/multiplication";
import "./runtime/expressions/negation";
import "./runtime/expressions/subtraction";
import "./runtime/expressions/to-boolean";

import "./runtime/libraries/array";
import "./runtime/libraries/clock";
import "./runtime/libraries/program";
import "./runtime/libraries/text-window";

import "./runtime/statements/for-loop";
import "./runtime/statements/if-statements";
import "./runtime/statements/labels";
import "./runtime/statements/while-loop";

import "./runtime/stepping-through";
import "./runtime/submodules";
