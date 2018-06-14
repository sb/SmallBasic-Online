import { ExecutionEngine, ExecutionMode } from "../execution-engine";
import { TextWindowLibrary } from "./libraries/text-window";
import { ProgramLibrary } from "./libraries/program";
import { ClockLibrary } from "./libraries/clock";
import { ArrayLibrary } from "./libraries/array";
import { StackLibrary } from "./libraries/stack";
import { BaseValue } from "./values/base-value";
import { CompilerRange } from "../syntax/ranges";
import { LibrariesMetadata } from "./libraries-metadata";

export interface LibraryTypeInstance {
    readonly methods: { readonly [name: string]: LibraryMethodInstance };
    readonly properties: { readonly [name: string]: LibraryPropertyInstance };
}

export interface LibraryMethodInstance {
    readonly execute:(engine: ExecutionEngine, mode: ExecutionMode, range: CompilerRange) => boolean ;
}

export interface LibraryPropertyInstance {
    readonly getter?: () => BaseValue;
    readonly setter?: (value: BaseValue) => void;
}

export class RuntimeLibraries {
    readonly [libraryName: string]: LibraryTypeInstance;

    public static readonly Metadata: LibrariesMetadata = new LibrariesMetadata();

    public readonly Array: ArrayLibrary = new ArrayLibrary();
    public readonly Clock: ClockLibrary = new ClockLibrary();
    public readonly Program: ProgramLibrary = new ProgramLibrary();
    public readonly Stack: StackLibrary = new StackLibrary();
    public readonly TextWindow: TextWindowLibrary = new TextWindowLibrary();
}
