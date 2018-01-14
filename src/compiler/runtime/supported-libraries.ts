import { ExecutionEngine, ExecutionMode } from "./../execution-engine";
import { TextWindowLibrary } from "./libraries/text-window";
import { ProgramLibrary } from "./libraries/program";
import { ClockLibrary } from "./libraries/clock";

type LibraryExecuteSignature = (engine: ExecutionEngine, mode: ExecutionMode) => void;

// TODO: add the rest of the libraries

export interface LibraryMethodDefinition {
    readonly argumentsCount: number;
    readonly returnsValue: boolean;
    readonly execute: LibraryExecuteSignature;
}

export interface LibraryPropertyDefinition {
    readonly getter?: LibraryExecuteSignature;
    readonly setter?: LibraryExecuteSignature;
}

export interface LibraryTypeDefinition {
    methods: { readonly [name: string]: LibraryMethodDefinition };
    properties: { readonly [name: string]: LibraryPropertyDefinition };
}

export const SupportedLibraries: { readonly [name: string]: LibraryTypeDefinition } = {
    "TextWindow": TextWindowLibrary,
    "Program": ProgramLibrary,
    "Clock": ClockLibrary
};
