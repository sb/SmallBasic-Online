import { LibraryTypeDefinition, SupportedLibraries } from "../../compiler/runtime/supported-libraries";
import { Scanner } from "../../compiler/syntax/scanner";
import { TokenKind } from "../../compiler/syntax/nodes/tokens";
import { TextRange } from "../syntax/nodes/syntax-nodes";

const libraries: SupportedLibraries = new SupportedLibraries();

export enum CompilerCompletionItemKind {
    Class,
    Method,
    Property
}

export interface CompilerCompletionItem {
    kind: CompilerCompletionItemKind;
    title: string;
    description: string;
}

export function provideCompletion(line: string, position: TextRange): CompilerCompletionItem[] {
    const scanner = new Scanner(line);
    if (scanner.result.length === 0) {
        return getTypes();
    }

    let i: number;
    for (i = scanner.result.length - 1; i > 0; i--) {
        if (scanner.result[i].range.start <= position.start) {
            break;
        }
    }

    if (scanner.result[i].kind === TokenKind.Dot) {
        if (i > 0 && scanner.result[i - 1].kind === TokenKind.Identifier) {
            const type = libraries[scanner.result[i - 1].text];
            if (type) {
                return getMembers(type);
            } else {
                return [];
            }
        } else {
            return [];
        }
    } else if (scanner.result[i].kind === TokenKind.Identifier) {
        if (i > 1 && scanner.result[i - 1].kind === TokenKind.Dot && scanner.result[i - 2].kind === TokenKind.Identifier) {
            const type = libraries[scanner.result[i - 2].text];
            if (type) {
                return getMembers(type, scanner.result[i].text);
            } else {
                return [];
            }
        } else {
            return getTypes(scanner.result[i].text);
        }
    } else {
        return [];
    }
}

function getTypes(prefix?: string): CompilerCompletionItem[] {
    return Object.keys(libraries).filter(name => startsWith(name, prefix)).map(name => {
        const type = libraries[name];
        return {
            title: name,
            kind: CompilerCompletionItemKind.Class,
            description: type.description
        };
    });
}

function getMembers(type: LibraryTypeDefinition, prefix?: string): CompilerCompletionItem[] {
    return [
        ...Object.keys(type.methods).filter(name => startsWith(name, prefix)).map(name => {
            const method = type.methods[name];
            return {
                title: name,
                kind: CompilerCompletionItemKind.Method,
                description: method.description
            };
        }),
        ...Object.keys(type.properties).filter(name => startsWith(name, prefix)).map(name => {
            const property = type.properties[name];
            return {
                title: name,
                kind: CompilerCompletionItemKind.Property,
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
