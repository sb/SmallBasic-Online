import { Run } from "./run";
import { Learn } from "./learn";
import { Debug } from "./debug";
import { strings } from "../loc";
import { CodeEditor } from "./code-editor";
import { Lesson } from "./lesson";

interface ISection {
    name: string;
    url: string;
    icon: string;
    component: React.ComponentClass;
    showInSideBar: boolean;
}

export const defaultSection = "/editor";

export const sections: ISection[] = [
    {
        name: strings.app.codeEditorTitle,
        url: "/editor",
        icon: "icon-note",
        component: CodeEditor,
        showInSideBar: true
    },
    {
        name: strings.app.runTitle,
        url: "/run",
        icon: "icon-control-play",
        component: Run,
        showInSideBar: true
    },
    {
        name: strings.app.debugTitle,
        url: "/debug",
        icon: "icon-magnifier-add",
        component: Debug,
        showInSideBar: true
    },
    {
        name: strings.app.learnTitle,
        url: "/learn",
        icon: "icon-notebook",
        component: Learn,
        showInSideBar: true
    },
    {
        name: strings.app.lessonTitle,
        url: "/lesson",
        icon: "icon-book-open",
        component: Lesson,
        showInSideBar: false
    }
];
