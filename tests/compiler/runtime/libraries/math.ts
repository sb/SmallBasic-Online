import "jasmine";
import { Compilation } from "../../../../src/compiler/compilation";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../../../src/compiler/execution-engine";
import { NumberValue } from "../../../../src/compiler/runtime/values/number-value";
import { ValueKind } from "../../../../src/compiler/runtime/values/base-value";
import { verifyRuntimeResult, verifyRuntimeError } from "../../helpers";
import { Diagnostic, ErrorCode } from "../../../../src/compiler/utils/diagnostics";
import { CompilerRange } from "../../../../src/compiler/syntax/ranges";

describe("Compiler.Runtime.Libraries.Math", () => {
    it("can retreive Pi", () => {
        const compilation = new Compilation(`
x = Math.Pi`);

        const engine = new ExecutionEngine(compilation);
        engine.execute(ExecutionMode.RunToEnd);
        expect(engine.state).toBe(ExecutionState.Terminated);
        expect(engine.exception).toBeUndefined();

        const memory = engine.memory.values;
        expect(Object.keys(memory).length).toBe(1);
        expect(memory.x.kind).toBe(ValueKind.Number);

        const x = memory.x as NumberValue;
        expect(x.value).toBe(Math.PI);
    });

    it("can calculate abs() of numbers", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Abs(5))
TextWindow.WriteLine(Math.Abs(-2))`,
            [],
            [
                "5",
                "2"
            ]);
    });

    it("can calculate remainder of division", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Remainder(5, 2))
TextWindow.WriteLine(Math.Remainder(9, 9))`,
            [],
            [
                "1",
                "0"
            ]);
    });

    it("terminates on getting remainder with zero division", () => {
        verifyRuntimeError(`
TextWindow.WriteLine(Math.Remainder(9, 0))`,
            // TextWindow.WriteLine(Math.Remainder(9, 0))
            //                      ^^^^^^^^^^^^^^^^^^^^
            // You cannot divide by zero. Please consider checking the divisor before dividing.
            new Diagnostic(ErrorCode.CannotDivideByZero, CompilerRange.fromValues(1, 21, 1, 41)));
    });

    it("can calculate cosine", () => {
        verifyRuntimeResult(`
x = Math.Cos(Math.GetRadians(0))
TextWindow.WriteLine(0.99999 <= x And x <= 1.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can calculate sine", () => {
        verifyRuntimeResult(`
x = Math.Sin(Math.GetRadians(90))
TextWindow.WriteLine(0.99999 <= x And x <= 1.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can calculate tangent", () => {
        verifyRuntimeResult(`
x = Math.Tan(Math.GetRadians(45))
TextWindow.WriteLine(0.99999 <= x And x <= 1.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can calculate arc-cosine", () => {
        verifyRuntimeResult(`
x = Math.GetDegrees(Math.ArcCos(1 / 2))
TextWindow.WriteLine(59.99999 <= x And x <= 60.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can calculate arc-sine", () => {
        verifyRuntimeResult(`
x = Math.GetDegrees(Math.ArcSin(1 / 2))
TextWindow.WriteLine(29.99999 <= x And x <= 30.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can calculate arc-tan", () => {
        verifyRuntimeResult(`
x = Math.GetDegrees(Math.ArcTan(1))
TextWindow.WriteLine(44.99999 <= x And x <= 45.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can calculate ceiling", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Ceiling(1.5))
TextWindow.WriteLine(Math.Ceiling(4))`,
            [],
            [
                "2",
                "4"
            ]);
    });

    it("can calculate floor", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Floor(1.5))
TextWindow.WriteLine(Math.Floor(4))`,
            [],
            [
                "1",
                "4"
            ]);
    });

    it("can calculate round", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Round(1.3))
TextWindow.WriteLine(Math.Round(1.8))
TextWindow.WriteLine(Math.Round(4))`,
            [],
            [
                "1",
                "2",
                "4"
            ]);
    });

    it("can get degrees", () => {
        verifyRuntimeResult(`
x = Math.GetDegrees(1)
TextWindow.WriteLine(57.2957 <= x And x <= 57.2959)`,
            [],
            [
                "True"
            ]);
    });

    it("can get radians", () => {
        verifyRuntimeResult(`
x = Math.GetRadians(90)
TextWindow.WriteLine(1.5707 <= x And x <= 1.5709)`,
            [],
            [
                "True"
            ]);
    });
    
    it("can get random numbers", () => {
        verifyRuntimeResult(`
success = "yes"
For i = 1 To 100
    random = Math.GetRandomNumber(5)
    If x < 1 Or x > 5 Then
        success = "no"
    EndIf
EndFor
TextWindow.WriteLine(success)`,
            [],
            [
                "yes"
            ]);
    });

    it("can get log", () => {
        verifyRuntimeResult(`
x = Math.Log(1000)
TextWindow.WriteLine(2.99999 <= x And x <= 3.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can get natural log", () => {
        verifyRuntimeResult(`
x = Math.NaturalLog(8) / Math.NaturalLog(2)
TextWindow.WriteLine(2.99999 <= x And x <= 3.00001)`,
            [],
            [
                "True"
            ]);
    });

    it("can get max", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Max(1, 2))
TextWindow.WriteLine(Math.Max(3, 3))
TextWindow.WriteLine(Math.Max(5, 4))`,
            [],
            [
                "2",
                "3",
                "5"
            ]);
    });

    it("can get min", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Min(1, 2))
TextWindow.WriteLine(Math.Min(3, 3))
TextWindow.WriteLine(Math.Min(5, 4))`,
            [],
            [
                "1",
                "3",
                "4"
            ]);
    });

    it("can get power", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.Power(1, 2))
TextWindow.WriteLine(Math.Power(0, 4))
TextWindow.WriteLine(Math.Power(2, 5))`,
            [],
            [
                "1",
                "0",
                "32"
            ]);
    });

    it("can get square-root", () => {
        verifyRuntimeResult(`
TextWindow.WriteLine(Math.SquareRoot(-5))
TextWindow.WriteLine(Math.SquareRoot(0))
TextWindow.WriteLine(Math.SquareRoot(16))`,
            [],
            [
                "0",
                "0",
                "4"
            ]);
    });
});
