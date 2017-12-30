import { InstructionKind, BaseInstruction } from "../../src/compiler/models/instructions";
import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../src/compiler/execution-engine";
import { NumberValue } from "../../src/compiler/runtime/values/number-value";
import { StringValue } from "../../src/compiler/runtime/values/string-value";
import "jasmine";
import { Compilation } from "../../src/compiler/compilation";
import { Diagnostic, ErrorCode } from "../../src/compiler/utils/diagnostics";

export function serializeInstructions(text: string): string {
    verifyCompilationErrors(text);

    const compilation = new Compilation(text);
    let modules: { [key: string]: ReadonlyArray<BaseInstruction> } = {
        "Main": compilation.mainModule,
        ...compilation.subModules
    };

    return Object.keys(modules).map(subModule => `
[${subModule}]

${modules[subModule].map((instruction, i) => `${i}: ${InstructionKind[instruction.kind]} - ${JSON.stringify(instruction)}`).join("\n")}`).join("\n");
}

export function verifyRuntimeError(text: string, exception: Diagnostic): void {
    verifyCompilationErrors(text);
    const compilation = new Compilation(text);
    const engine = new ExecutionEngine(compilation);

    while (engine.state !== ExecutionState.Terminated) {
        engine.execute(ExecutionMode.RunToEnd);

        if (engine.state === ExecutionState.BlockedOnOutput) {
            engine.buffer.readValue();
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

    verifyCompilationErrors(text);
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
                    engine.buffer.writeValue(new NumberValue(input[inputIndex++] as number));
                    break;
                }
            }
            case ExecutionState.BlockedOnStringInput: {
                if (inputIndex >= input.length) {
                    throw new Error("Blocked on string input while none available");
                } else if (typeof input[inputIndex] !== "string") {
                    throw new Error(`Expected input entry '${input[inputIndex]} to be a string`);
                } else {
                    engine.buffer.writeValue(new StringValue(input[inputIndex++] as string));
                    break;
                }
            }
            case ExecutionState.BlockedOnOutput: {
                if (outputIndex >= output.length) {
                    throw new Error("Blocked on output while none expected");
                } else if (typeof output[outputIndex] !== "string") {
                    throw new Error(`Expected output entry '${output[outputIndex]} to be a string`);
                } else {
                    expect((engine.buffer.readValue() as StringValue).value).toBe(output[outputIndex++]);
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
        return `
        // ${textLines[error.range.line]}
        // ${Array(error.range.start + 1).join(" ")}${Array(error.range.end - error.range.start + 1).join("^")}
        // ${error.toString()}
        new Diagnostic(${[
                `ErrorCode.${ErrorCode[error.code]}`,
                `{ line: ${error.range.line}, start: ${error.range.start}, end: ${error.range.end} }`,
                ...error.args.map(a => `${JSON.stringify(a)}`)
            ].join(", ")})`;
    }).join(",") + "\n";

    expect(serializeErrors(actual)).toBe(serializeErrors(expected));
}
