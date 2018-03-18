import * as React from "react";
import { ExecutionEngine } from "../../../../compiler/execution-engine";
import { EditorResources } from "../../../strings/editor";

const MemoryIcon = require("./header.png");

interface MemoryProps {
    engine: ExecutionEngine;
}

interface MemoryState {
}

export class MemoryComponent extends React.Component<MemoryProps, MemoryState> {
    public render(): JSX.Element {
        return (
            <div className="sidebar-component memory">
                <div className="sidebar-component-icon" style={{ backgroundImage: `url("${MemoryIcon}")` }}></div>
                <div className="sidebar-component-label">{EditorResources.Memory_Header}</div>
                <ul>
                    {Object.keys(this.props.engine.memory.values).sort().map((key, i) =>
                        <li key={i}>
                            {key}: {this.props.engine.memory.values[key].toDebuggerString()}
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
