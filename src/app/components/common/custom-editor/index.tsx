import * as React from "react";
import AceEditor from "react-ace";

interface CustomEditorProps {
    id: string;
    initialValue: string;
    onChange: (value: string) => void;
}

export class CustomEditor extends React.Component<CustomEditorProps> {
    public render(): JSX.Element {
        return (
            <AceEditor
                mode="smallbasic"
                name={this.props.id}
                value={this.props.initialValue}
                width="100%"
                height="100%"
                editorProps={{
                    $blockScrolling: true
                }}
                setOptions={{
                    showPrintMargin: false,
                    fontFamily: "consolas",
                    fontSize: "18px"
                }}
                onChange={this.props.onChange}
            />
        );
    }
}
