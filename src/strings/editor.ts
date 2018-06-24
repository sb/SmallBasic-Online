// This file is generated through a build task. Do not edit by hand.

export module EditorResources {
    export const ToolbarButton_New_Title = "New";
    export const ToolbarButton_New_Description = "Clears the editor and starts a new program";
    export const ToolbarButton_Publish_Title = "Publish";
    export const ToolbarButton_Publish_Description = "Get a publish url to share with friends";
    export const ToolbarButton_Cut_Title = "Cut";
    export const ToolbarButton_Cut_Description = "Cut selected text";
    export const ToolbarButton_Copy_Title = "Copy";
    export const ToolbarButton_Copy_Description = "Copy selected text";
    export const ToolbarButton_Paste_Title = "Paste";
    export const ToolbarButton_Paste_Description = "Paste copied text";
    export const ToolbarButton_Undo_Title = "Undo";
    export const ToolbarButton_Undo_Description = "Undo last action";
    export const ToolbarButton_Redo_Title = "Redo";
    export const ToolbarButton_Redo_Description = "Redo last undone action";
    export const ToolbarButton_Run_Title = "Run";
    export const ToolbarButton_Run_Description = "Run this program";
    export const ToolbarButton_Debug_Title = "Debug";
    export const ToolbarButton_Debug_Description = "Debug this program";
    export const ToolbarButton_Stop_Title = "Stop";
    export const ToolbarButton_Stop_Description = "Stop execution of the program and return to the editor";
    export const ToolbarButton_Step_Title = "Step";
    export const ToolbarButton_Step_Description = "Step to the next statement of the program";
    export const Modal_ConfirmNew_Text = "Are you sure you want to erase all code and start a new program?";
    export const Modal_Button_Yes = "Yes";
    export const Modal_Button_No = "No";
    export const Documentation_Header = "Library";
    export const CallStack_Header = "Call Stack";
    export const Memory_Header = "Memory";
    export const TextWindow_TerminationMessage = "Program ended...";

    export function get(key: string): string {
        return (<any>EditorResources)[key];
    }
}
