import { ExecutionEngine, ExecutionMode, ExecutionState } from "../../src/compiler/execution-engine";
import "jasmine";
import { Compilation } from "../../src/compiler/compilation";
import { Diagnostic, ErrorCode } from "../../src/compiler/utils/diagnostics";
import { NumberValue } from "../../src/compiler/runtime/values/number-value";
import { StringValue } from "../../src/compiler/runtime/values/string-value";
import { CompilerPosition, CompilerRange } from "../../src/compiler/syntax/ranges";
import { TokenKind } from "../../src/compiler/syntax/tokens";
import { ITextWindowLibraryPlugin, TextWindowColor } from "../../src/compiler/runtime/libraries/text-window";
import { BaseValue } from "../../src/compiler/runtime/values/base-value";

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
    }

    expect(engine.state).toBe(ExecutionState.Terminated);
    if (engine.exception) {
        verifyErrors(text, [engine.exception], [exception]);
    } else {
        throw new Error("No exception was found");
    }
}

export function verifyRuntimeResult(text: string, input?: (string | number)[], output?: string[]): void {
    const compilation = new Compilation(text);
    verifyErrors(text, compilation.diagnostics, []);

    const buffer = new TextWindowTestBuffer(input || [], output || []);
    const engine = new ExecutionEngine(compilation);
    engine.libraries.TextWindow.plugin = buffer;

    while (engine.state !== ExecutionState.Terminated) {
        engine.execute(ExecutionMode.RunToEnd);
    }

    expect(engine.evaluationStack.length).toBe(0);
    buffer.assertBufferIsEmpty();

    if (engine.exception) {
        verifyErrors(text, [engine.exception], []);
    }
}

export function verifyCompilationErrors(text: string, ...expected: Diagnostic[]): Compilation {
    const compilation = new Compilation(text);
    const actual = compilation.diagnostics;

    verifyErrors(text, actual, expected);
    return compilation;
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

export class TextWindowTestBuffer implements ITextWindowLibraryPlugin {
    private currentPartialLine: string = "";

    public inputIndex: number = 0;
    public outputIndex: number = 0;

    private foreground: TextWindowColor = TextWindowColor.White;
    private background: TextWindowColor = TextWindowColor.Black;

    public constructor(
        private readonly input: (string | number)[],
        private readonly output: string[]) {
    }

    public inputIsNeeded(): void {
        // Nothing for now
    }

    public checkInputBuffer(): BaseValue | undefined {
        if (this.inputIndex < this.input.length) {
            const value = this.input[this.inputIndex++];
            switch (typeof value) {
                case "string": return new StringValue(value as string);
                case "number": return new NumberValue(value as number);
                default: throw new Error("impossible to reach here");
            }
        }

        return undefined;
    }

    public writeText(value: string, appendNewLine: boolean): void {
        if (this.outputIndex < this.output.length) {
            this.currentPartialLine += value;
            if (appendNewLine) {
                const line = this.output[this.outputIndex++];
                expect(this.currentPartialLine).toBe(line);
                this.currentPartialLine = "";
            }
        } else {
            throw new Error("not expecting any more output");
        }
    }

    public getForegroundColor(): TextWindowColor {
        return this.foreground;
    }

    public setForegroundColor(color: TextWindowColor): void {
        this.foreground = color;
    }

    public getBackgroundColor(): TextWindowColor {
        return this.background;
    }

    public setBackgroundColor(color: TextWindowColor): void {
        this.background = color;
    }

    public assertBufferIsEmpty(): void {
        expect(this.inputIndex).toBe(this.input.length);

        if (this.outputIndex !== this.output.length) {
            expect(this.outputIndex).toBe(this.output.length - 1);
            expect(this.currentPartialLine).toBe(this.output[this.outputIndex]);
        }
    }
}
