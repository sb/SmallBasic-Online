import { LibraryTypeDefinition, SupportedLibraries } from "../../compiler/runtime/supported-libraries";
import { Scanner } from "../../compiler/syntax/scanner";
import { TokenKind } from "../../compiler/syntax/nodes/tokens";

const libraries: SupportedLibraries = new SupportedLibraries();

export class CompletionService implements monaco.languages.CompletionItemProvider {
    public readonly triggerCharacters: string[] = [
        "."
    ];

    public provideCompletionItems(model: monaco.editor.IReadOnlyModel, position: monaco.Position): monaco.languages.CompletionItem[] {
        const scanner = new Scanner(model.getLineContent(position.lineNumber), []);
        if (scanner.tokens.length === 0) {
            return this.getTypes();
        }

        let i: number;
        for (i = scanner.tokens.length - 1; i > 0; i--) {
            if (scanner.tokens[i].range.start <= position.column) {
                break;
            }
        }

        if (scanner.tokens[i].kind === TokenKind.Dot) {
            if (i > 0 && scanner.tokens[i - 1].kind === TokenKind.Identifier) {
                const type = libraries[scanner.tokens[i - 1].text];
                if (type) {
                    return this.getMembers(type);
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } else if (scanner.tokens[i].kind === TokenKind.Identifier) {
            if (i > 1 && scanner.tokens[i - 1].kind === TokenKind.Dot && scanner.tokens[i - 2].kind === TokenKind.Identifier) {
                const type = libraries[scanner.tokens[i - 2].text];
                if (type) {
                    return this.getMembers(type, scanner.tokens[i].text);
                } else {
                    return [];
                }
            } else {
                return this.getTypes(scanner.tokens[i].text);
            }
        } else {
            return [];
        }
    }

    private getTypes(prefix?: string): monaco.languages.CompletionItem[] {
        return Object.keys(libraries).filter(name => this.startsWith(name, prefix)).map(name => {
            const type = libraries[name];
            return {
                label: name,
                kind: monaco.languages.CompletionItemKind.Class,
                detail: type.description,
                insertText: name
            };
        });
    }

    private getMembers(type: LibraryTypeDefinition, prefix?: string): monaco.languages.CompletionItem[] {
        return [
            ...Object.keys(type.methods).filter(name => this.startsWith(name, prefix)).map(name => {
                const method = type.methods[name];
                return {
                    label: name,
                    kind: monaco.languages.CompletionItemKind.Method,
                    detail: method.description,
                    insertText: name
                };
            }),
            ...Object.keys(type.properties).filter(name => this.startsWith(name, prefix)).map(name => {
                const property = type.properties[name];
                return {
                    label: name,
                    kind: monaco.languages.CompletionItemKind.Property,
                    detail: property.description,
                    insertText: name
                };
            })
        ];
    }

    private startsWith(name: string, prefix?: string): boolean {
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
