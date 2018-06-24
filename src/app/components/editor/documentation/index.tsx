import { RuntimeLibraries } from "../../../../compiler/runtime/libraries";
import * as React from "react";
import { EditorResources } from "../../../../strings/editor";

import "./style.css";
import { CompilerUtils } from "../../../../compiler/utils/compiler-utils";

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
                    {CompilerUtils.values(RuntimeLibraries.Metadata).map(library => {
                        return (
                            <li className="library-class" key={library.typeName}>
                                <p className="library-class-name" onClick={(() => this.libraryClicked(library.typeName)).bind(this)}>{library.typeName}</p>
                                <div className="library-members" style={{ display: this.state.library === library.typeName ? "inherit" : "none" }}>
                                    <p className="description">{library.description}</p>
                                    <ul>
                                        {CompilerUtils.values(library.properties).map(property => {
                                            return (
                                                <li className="library-member" key={property.propertyName}>
                                                    <p className="library-member-name" onClick={(() => this.memberClicked(property.propertyName)).bind(this)}>
                                                        {library.typeName}.{property.propertyName}
                                                    </p>
                                                    <div style={{ display: this.state.member === property.propertyName ? "inherit" : "none" }}>
                                                        <p className="description">{property.description}</p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                        {CompilerUtils.values(library.methods).map(method => {
                                            return (
                                                <li className="library-member" key={method.methodName}>
                                                    <p className="library-member-name" onClick={(() => this.memberClicked(method.methodName)).bind(this)}>
                                                        {method.typeName}.{method.methodName}({method.parameters.join(", ")})
                                                    </p>
                                                    <div style={{ display: this.state.member === method.methodName ? "inherit" : "none" }}>
                                                        <p className="description">{method.description}</p>
                                                        <ul>
                                                            {method.parameters.map(parameter =>
                                                                <li className="members-details" key={parameter}>
                                                                    <p className="description"><b>{parameter}</b>: {method.parameterDescription(parameter)}</p>
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
