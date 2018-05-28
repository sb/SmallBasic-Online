import { LibraryTypeDefinition, SupportedLibraries } from "../../compiler/runtime/supported-libraries";
import { TokenKind } from "../../compiler/syntax/tokens";
import { CompilerPosition } from "../syntax/ranges";
import { Compilation } from "../compilation";

const libraries: SupportedLibraries = new SupportedLibraries();

export module CompletionService {
    export enum ResultKind {
        Class,
        Method,
        Property
    }

    export interface Result {
        kind: ResultKind;
        title: string;
        description: string;
    }

    export function provideCompletion(line: string, position: CompilerPosition): Result[] {
        const tokens = new Compilation(line).tokens;
        if (tokens.length === 0) {
            return getTypes();
        }

        let i: number;
        for (i = tokens.length - 1; i > 0; i--) {
            if (tokens[i].range.containsPosition(position)) {
                break;
            }
        }

        if (tokens[i].kind === TokenKind.Dot) {
            if (i > 0 && tokens[i - 1].kind === TokenKind.Identifier) {
                const type = libraries[tokens[i - 1].text];
                if (type) {
                    return getMembers(type);
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } else if (tokens[i].kind === TokenKind.Identifier) {
            if (i > 1 && tokens[i - 1].kind === TokenKind.Dot && tokens[i - 2].kind === TokenKind.Identifier) {
                const type = libraries[tokens[i - 2].text];
                if (type) {
                    return getMembers(type, tokens[i].text);
                } else {
                    return [];
                }
            } else {
                return getTypes(tokens[i].text);
            }
        } else {
            return [];
        }
    }

    function getTypes(prefix?: string): Result[] {
        return Object.keys(libraries).filter(name => startsWith(name, prefix)).map(name => {
            const type = libraries[name];
            return {
                title: name,
                kind: ResultKind.Class,
                description: type.description
            };
        });
    }

    function getMembers(type: LibraryTypeDefinition, prefix?: string): Result[] {
        return [
            ...Object.keys(type.methods).filter(name => startsWith(name, prefix)).map(name => {
                const method = type.methods[name];
                return {
                    title: name,
                    kind: ResultKind.Method,
                    description: method.description
                };
            }),
            ...Object.keys(type.properties).filter(name => startsWith(name, prefix)).map(name => {
                const property = type.properties[name];
                return {
                    title: name,
                    kind: ResultKind.Property,
                    description: property.description
                };
            })
        ];
    }

    function startsWith(name: string, prefix?: string): boolean {
        if (!prefix) {
            return true;
        }

        name = name.toLowerCase();
        prefix = prefix.toLocaleLowerCase();

        if (name.length <= prefix.length) {
            return false;
        } else {
            return prefix === name.substr(0, prefix.length);
        }
    }
}
