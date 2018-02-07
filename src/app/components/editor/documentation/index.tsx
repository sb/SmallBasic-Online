import { SupportedLibraries } from "../../../../compiler/runtime/supported-libraries";
import * as React from "react";
import { EditorResources } from "../../../strings/editor";

import "./style.css";

const DocumentationIcon = require("./header.png");

interface DocumentationProps {
}

interface DocumentationState {
    library?: string;
    member?: string;
}

export class DocumentationComponent extends React.Component<DocumentationProps, DocumentationState> {
    public constructor(props: DocumentationProps) {
        super(props);
        this.state = {
            library: undefined,
            member: undefined
        };
    }

    private libraryClicked(name: string): void {
        if (this.state.library === name) {
            this.setState({
                library: undefined,
                member: undefined
            });
        } else {
            this.setState({
                library: name,
                member: undefined
            });
        }
    }

    private memberClicked(name: string): void {
        if (this.state.member === name) {
            this.setState({
                library: this.state.library,
                member: undefined
            });
        } else {
            this.setState({
                library: this.state.library,
                member: name
            });
        }
    }

    public render(): JSX.Element {
        return (
            <div className="documentation sidebar-component">
                <div className="sidebar-component-icon" style={{ backgroundImage: `url("${DocumentationIcon}")` }}></div>
                <div className="sidebar-component-label">{EditorResources.Documentation_Header}</div>
                <ul>
                    {Object.keys(SupportedLibraries).map(libraryName => {
                        const library = SupportedLibraries[libraryName];
                        return (
                            <li className="library-class" key={libraryName}>
                                <p className="library-class-name" onClick={(() => this.libraryClicked(libraryName)).bind(this)}>{libraryName}</p>
                                <div className="library-members" style={{ display: this.state.library === libraryName ? "inherit" : "none" }}>
                                    <p className="description">{library.description}</p>
                                    <ul>
                                        {Object.keys(library.properties).map(propertyName => {
                                            const property = library.properties[propertyName];
                                            return (
                                                <li className="library-member" key={propertyName}>
                                                    <p className="library-member-name" onClick={(() => this.memberClicked(propertyName)).bind(this)}>
                                                        {libraryName}.{propertyName}
                                                    </p>
                                                    <div style={{ display: this.state.member === propertyName ? "inherit" : "none" }}>
                                                        <p className="description">{property.description}</p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                        {Object.keys(library.methods).map(methodName => {
                                            const method = library.methods[methodName];
                                            return (
                                                <li className="library-member" key={methodName}>
                                                    <p className="library-member-name" onClick={(() => this.memberClicked(methodName)).bind(this)}>
                                                        {libraryName}.{methodName}({method.parameters.map(parameter => parameter.name).join(", ")})
                                                    </p>
                                                    <div style={{ display: this.state.member === methodName ? "inherit" : "none" }}>
                                                        <p className="description">{method.description}</p>
                                                        <ul>
                                                            {method.parameters.map(parameter =>
                                                                <li className="members-details" key={parameter.name}>
                                                                    <p className="description"><b>{parameter.name}</b>: {parameter.description}</p>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
