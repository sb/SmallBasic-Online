import * as React from "react";
import AceEditor from "react-ace";

export class MainFrame extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="content">
                <div className="toolbar body-box">
                    <div className="toolbar-button new-button" title="Open a new editor tab">
                        <div className="toolbar-label">New</div>
                    </div>
                    <div className="toolbar-button publish-button inactive" title="Publish this program">
                        <div className="toolbar-label">Publish</div>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-button cut-button" title="Cut selected text">
                        <div className="toolbar-label">Cut</div>
                    </div>
                    <div className="toolbar-button copy-button" title="Copy selected text">
                        <div className="toolbar-label">Copy</div>
                    </div>
                    <div className="toolbar-button paste-button" title="Paste text">
                        <div className="toolbar-label">Paste</div>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-button undo-button" title="Undo last action">
                        <div className="toolbar-label">Undo</div>
                    </div>
                    <div className="toolbar-button redo-button" title="Redo">
                        <div className="toolbar-label">Redo</div>
                    </div>
                    <div className="toolbar-divider"></div>
                    <div className="toolbar-button run-button" title="Run this program">
                        <div className="toolbar-label">Run</div>
                    </div>
                </div>

                <div className="container-left body-box">
                    <div>
                        <AceEditor
                            mode="smallbasic"
                            name="code-editor-page-editor-id"
                            value="begin here!"
                            editorProps={{ $blockScrolling: true }}
                        />
                    </div>
                </div>

                <div className="container-right body-box">
                    <div className="documentation">
                        <div className="documentation-icon"></div>
                        <div className="documentation-icon-label">Reference Documents</div>
                        <ul>
                            <li className="library-class">
                                <p className="library-class-name">Array</p>
                                <div className="library-members">
                                    <p className="description">This object provides a way of storing more than one value for a given name. These values can be accessed by another index.</p>
                                    <ul>
                                        <li className="library-member">
                                            <p className="library-member-name">ContainsIndex</p>
                                            <p className="description"> Gets whether or not the array contains the specified index. This is very useful when deciding if the array's index was initialized by some value or not. </p>
                                            <ul>
                                                <li className="members-details">
                                                    <p className="description"><b>array</b>: The array to check.</p>
                                                </li>
                                                <li className="members-details">
                                                    <p className="description"><b>returns</b>: "True" or "False" depending on if the index was present in the specified array.</p>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="library-class">
                                <p className="library-class-name">Array</p>
                                <div className="library-members">
                                    <p className="description">This object provides a way of storing more than one value for a given name. These values can be accessed by another index.</p>
                                    <ul>
                                        <li className="library-member">
                                            <p className="library-member-name">ContainsIndex</p>
                                            <p className="description"> Gets whether or not the array contains the specified index. This is very useful when deciding if the array's index was initialized by some value or not. </p>
                                            <ul>
                                                <li className="members-details">
                                                <p className="description"><b>array</b>: The array to check.</p>
                                            </li>
                                            <li className="members-details">
                                                <p className="description"><b>returns</b>: "True" or "False" depending on if the index was present in the specified array.</p>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
