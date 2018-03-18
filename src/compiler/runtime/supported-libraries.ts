import { ExecutionEngine, ExecutionMode } from "./../execution-engine";
import { TextWindowLibrary } from "./libraries/text-window";
import { ProgramLibrary } from "./libraries/program";
import { ClockLibrary } from "./libraries/clock";
import { ArrayLibrary } from "./libraries/array";
import { StackLibrary } from "./libraries/stack";
import { TextRange } from "../syntax/nodes/syntax-nodes";
import { BaseValue } from "./values/base-value";

export interface LibraryMethodDefinition {
    readonly description: string;
    readonly parameters: { [name: string]: string };
    readonly returnsValue: boolean;
    readonly execute: (engine: ExecutionEngine, mode: ExecutionMode, range: TextRange) => boolean;
}

export interface LibraryPropertyDefinition {
    readonly description: string;

    readonly getter?: () => BaseValue;
    readonly setter?: (value: BaseValue) => void;
}

export interface LibraryTypeDefinition {
    readonly description: string;

    readonly methods: { readonly [name: string]: LibraryMethodDefinition };
    readonly properties: { readonly [name: string]: LibraryPropertyDefinition };
}

export class SupportedLibraries {
    readonly [libraryName: string]: LibraryTypeDefinition;

    public readonly Array: ArrayLibrary = new ArrayLibrary();
    public readonly Clock: ClockLibrary = new ClockLibrary();
    public readonly Program: ProgramLibrary = new ProgramLibrary();
    public readonly Stack: StackLibrary = new StackLibrary();
    public readonly TextWindow: TextWindowLibrary = new TextWindowLibrary();
}
