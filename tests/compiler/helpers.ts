import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../src/compiler/execution-engine";
import "jasmine";
import { Compilation } from "../../src/compiler/compilation";
import { Diagnostic, ErrorCode } from "../../src/compiler/utils/diagnostics";
import { NumberValue } from "../../src/compiler/runtime/values/number-value";
import { StringValue } from "../../src/compiler/runtime/values/string-value";
import { CompilerPosition, CompilerRange } from "../../src/compiler/syntax/ranges";
import { TokenKind } from "../../src/compiler/syntax/tokens";

export function getMarkerPosition(text: string, marker: string): CompilerPosition {
    expect(marker.length).toBe(1);

    const tokens = new Compilation(text).tokens.filter(token => {
        return token.kind === TokenKind.UnrecognizedToken && token.text === marker;
    });

    let range: CompilerRange;

    switch (tokens.length) {
        case 0: throw new Error(`Cannot position the marker anywhere in source code`);
        case 1: range = tokens[0].range; break;
        default: throw new Error(`Multiple markers in source code`);
    }

    expect(range.start.line).toBe(range.end.line);
    expect(range.start.column).toBe(range.end.column - 1);

    return range.start;
}

export function verifyRuntimeError(text: string, exception: Diagnostic): void {
    verifyCompilationErrors(text);
    const compilation = new Compilation(text);
    const engine = new ExecutionEngine(compilation);

    while (engine.state !== ExecutionState.Terminated) {
        engine.execute(ExecutionMode.RunToEnd);

        if (engine.state === ExecutionState.BlockedOnOutput) {
            engine.libraries.TextWindow.readValueFromBuffer();
        }
    }

    expect(engine.state).toBe(ExecutionState.Terminated);
    if (engine.exception) {
        verifyErrors(text, [engine.exception], [exception]);
    } else {
        throw new Error("No exception was found");
    }
}

export function verifyRuntimeResult(text: string, input?: (string | number)[], output?: string[]): void {
    input = input || [];
    output = output || [];

    const compilation = new Compilation(text);
    verifyErrors(text, compilation.diagnostics, []);

    let outputIndex = 0, inputIndex = 0;
    const engine = new ExecutionEngine(compilation);

    while (engine.state !== ExecutionState.Terminated) {
        switch (engine.state) {
            case ExecutionState.BlockedOnNumberInput: {
                if (inputIndex >= input.length) {
                    throw new Error("Blocked on number input while none available");
                } else if (typeof input[inputIndex] !== "number") {
                    throw new Error(`Expected input entry '${input[inputIndex]} to be a number`);
                } else {
                    engine.libraries.TextWindow.writeValueToBuffer(new NumberValue(input[inputIndex++] as number), true);
                    break;
                }
            }
            case ExecutionState.BlockedOnStringInput: {
                if (inputIndex >= input.length) {
                    throw new Error("Blocked on string input while none available");
                } else if (typeof input[inputIndex] !== "string") {
                    throw new Error(`Expected input entry '${input[inputIndex]} to be a string`);
                } else {
                    engine.libraries.TextWindow.writeValueToBuffer(new StringValue(input[inputIndex++] as string), true);
                    break;
                }
            }
            case ExecutionState.BlockedOnOutput: {
                if (outputIndex >= output.length) {
                    throw new Error("Blocked on output while none expected");
                } else if (typeof output[outputIndex] !== "string") {
                    throw new Error(`Expected output entry '${output[outputIndex]} to be a string`);
                } else {
                    const value = engine.libraries.TextWindow.readValueFromBuffer();
                    expect(value.appendNewLine).toBe(true);
                    expect((value.value as StringValue).value).toBe(output[outputIndex++]);
                    break;
                }
            }
            case ExecutionState.Paused: {
                throw new Error("Engine is paused, even though no debugging is expected");
            }
            case ExecutionState.Running: {
                break;
            }
            default: {
                throw new Error(`Unexpected execution state: ${engine.state ? ExecutionState[engine.state] : undefined}`);
            }
        }

        engine.execute(ExecutionMode.RunToEnd);
    }

    expect(engine.state).toBe(ExecutionState.Terminated);
    expect(engine.evaluationStack.length).toBe(0);

    expect(inputIndex).toBe(input.length, "Expected number of input entries to match");
    expect(outputIndex).toBe(output.length, "Expected number of output entries to match");

    if (engine.exception) {
        verifyErrors(text, [engine.exception], []);
    }
}

export function verifyCompilationErrors(text: string, ...expected: Diagnostic[]): void {
    const actual = new Compilation(text).diagnostics;
    verifyErrors(text, actual, expected);
}

export function verifyErrors(text: string, actual: ReadonlyArray<Diagnostic>, expected: Diagnostic[]): void {
    const textLines = text.split(/\r?\n/);
    const serializeErrors = (errors: ReadonlyArray<Diagnostic>) => errors.map(error => {
        expect(error.range.start.line).toBe(error.range.end.line);
        return `
        // ${textLines[error.range.start.line]}
        // ${Array(error.range.start.column + 1).join(" ")}${Array(error.range.end.column - error.range.start.column + 1).join("^")}
        // ${error.toString()}
        new Diagnostic(${[
                `ErrorCode.${ErrorCode[error.code]}`,
                `CompilerRange.fromValues(${error.range.start.line}, ${error.range.start.column}, ${error.range.end.line}, ${error.range.end.column})`,
                ...error.args.map(a => `${JSON.stringify(a)}`)
            ].join(", ")})`;
    }).join(",") + "\n";

    expect(serializeErrors(actual)).toBe(serializeErrors(expected));
}
