import { ExecutionEngine, ExecutionMode } from "./execution-engine";
import { TextWindowLibrary } from "./libraries/text-window";
import { ProgramLibrary } from "./libraries/program";
import { ClockLibrary } from "./libraries/clock";

type LibraryExecuteSignature = (engine: ExecutionEngine, mode: ExecutionMode) => void;

export interface LibraryMethodDefinition {
    argumentsCount: number;
    returnsValue: boolean;
    execute: LibraryExecuteSignature;
}

export interface LibraryPropertyDefinition {
    getter?: LibraryExecuteSignature;
    setter?: LibraryExecuteSignature;
}

export interface LibraryTypeDefinition {
    methods: { [name: string]: LibraryMethodDefinition };
    properties: { [name: string]: LibraryPropertyDefinition };
}

export const SupportedLibraries: { [name: string]: LibraryTypeDefinition } = {
    "TextWindow": TextWindowLibrary,
    "Program": ProgramLibrary,
    "Clock": ClockLibrary
};
