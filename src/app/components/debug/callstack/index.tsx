import * as React from "react";
import { ExecutionEngine } from "../../../../compiler/execution-engine";
import { EditorResources } from "../../../../strings/editor";

const CallStackIcon = require("./header.png");

interface CallStackProps {
    engine: ExecutionEngine;
}

interface CallStackState {
}

export class CallStackComponent extends React.Component<CallStackProps, CallStackState> {
    public render(): JSX.Element {
        return (
            <div className="sidebar-component callstack">
                <div className="sidebar-component-icon" style={{ backgroundImage: `url("${CallStackIcon}")` }}></div>
                <div className="sidebar-component-label">{EditorResources.CallStack_Header}</div>
                <ul>
                    {this.props.engine.executionStack.map((frame, i) =>
                        <li key={i}>
                            {frame.moduleName}: ({this.props.engine.modules[frame.moduleName][frame.instructionIndex].sourceRange.start.line})
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
