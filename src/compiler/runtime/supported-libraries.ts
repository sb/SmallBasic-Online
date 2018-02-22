import { ExecutionEngine, ExecutionMode } from "./../execution-engine";
import { TextWindowLibrary } from "./libraries/text-window";
import { ProgramLibrary } from "./libraries/program";
import { ClockLibrary } from "./libraries/clock";
import { BaseInstruction } from "../models/instructions";
import { ArrayLibrary } from "./libraries/array";

type LibraryExecuteSignature = (engine: ExecutionEngine, mode: ExecutionMode, instruction: BaseInstruction) => void;

export interface LibraryMethodDefinition {
    readonly description: string;
    readonly parameters: { [name: string]: string };
    readonly returnsValue: boolean;
    readonly execute: LibraryExecuteSignature;
}

export interface LibraryPropertyDefinition {
    readonly description: string;

    readonly getter?: LibraryExecuteSignature;
    readonly setter?: LibraryExecuteSignature;
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
    public readonly TextWindow: TextWindowLibrary = new TextWindowLibrary();
}
