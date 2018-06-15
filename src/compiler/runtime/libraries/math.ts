import { LibraryTypeInstance, LibraryMethodInstance, LibraryPropertyInstance } from "../libraries";
import { BaseValue, ValueKind } from "../values/base-value";
import { NumberValue } from "../values/number-value";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../execution-engine";
import { CompilerRange } from "../../syntax/ranges";
import { Diagnostic, ErrorCode } from "../../utils/diagnostics";

export class MathLibrary implements LibraryTypeInstance {
    private getPi(): BaseValue {
        return new NumberValue(Math.PI);
    }

    private executeCalculation(engine: ExecutionEngine, calculation: (...values: number[]) => number): boolean {
        const args: number[] = new Array(calculation.length);
        for (let i = args.length - 1; i >= 0; i--) {
            const value = engine.popEvaluationStack().tryConvertToNumber();

            if (value.kind === ValueKind.Number) {
                args[i] = (value as NumberValue).value;
            } else {
                engine.pushEvaluationStack(new NumberValue(0));
                return true;
            }
        }

        const result = calculation(...args);
        if (engine.state !== ExecutionState.Terminated) {
            engine.pushEvaluationStack(new NumberValue(result));
        }

        return true;
    }

    private executeRemainder(engine: ExecutionEngine, _: ExecutionMode, range: CompilerRange): boolean {
        return this.executeCalculation(engine, (dividend, divisor) => {
            if (divisor === 0) {
                engine.terminate(new Diagnostic(ErrorCode.CannotDivideByZero, range));
                return 0;
            }

            return dividend % divisor;
        });
    }

    public readonly methods: { readonly [name: string]: LibraryMethodInstance } = {
        Abs: { execute: engine => this.executeCalculation(engine, Math.abs) },
        Remainder: { execute: this.executeRemainder.bind(this) },

        Cos: { execute: engine => this.executeCalculation(engine, Math.cos) },
        Sin: { execute: engine => this.executeCalculation(engine, Math.sin) },
        Tan: { execute: engine => this.executeCalculation(engine, Math.tan) },

        ArcCos: { execute: engine => this.executeCalculation(engine, Math.acos) },
        ArcSin: { execute: engine => this.executeCalculation(engine, Math.asin) },
        ArcTan: { execute: engine => this.executeCalculation(engine, Math.atan) },

        Ceiling: { execute: engine => this.executeCalculation(engine, Math.ceil) },
        Floor: { execute: engine => this.executeCalculation(engine, Math.floor) },
        Round: { execute: engine => this.executeCalculation(engine, Math.round) },

        GetDegrees: { execute: engine => this.executeCalculation(engine, angle => 180 * angle / Math.PI % 360) },
        GetRadians: { execute: engine => this.executeCalculation(engine, angle => angle % 360 * Math.PI / 180) },

        GetRandomNumber: { execute: engine => this.executeCalculation(engine, maxNumber => Math.floor(Math.random() * (Math.max(1, maxNumber) - 1)) + 1) },

        Log: { execute: engine => this.executeCalculation(engine, value => Math.log(value) / Math.LN10) },
        NaturalLog: { execute: engine => this.executeCalculation(engine, Math.log) },

        Max: { execute: engine => this.executeCalculation(engine, (value1, value2) => Math.max(value1, value2)) },
        Min: { execute: engine => this.executeCalculation(engine, (value1, value2) => Math.min(value1, value2)) },

        Power: { execute: engine => this.executeCalculation(engine, (baseNumber, exponent) => Math.pow(baseNumber, exponent)) },
        SquareRoot: { execute: engine => this.executeCalculation(engine, value => value < 0 ? 0 : Math.sqrt(value)) }
    };

    public readonly properties: { readonly [name: string]: LibraryPropertyInstance } = {
        Pi: { getter: this.getPi.bind(this) }
    };
}
