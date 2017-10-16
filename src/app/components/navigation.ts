import { Run } from "./run";
import { Learn } from "./learn";
import { Debug } from "./debug";
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
        name: "Code Editor",
        url: "/editor",
        icon: "icon-note",
        component: CodeEditor,
        showInSideBar: true
    },
    {
        name: "Run",
        url: "/run",
        icon: "icon-control-play",
        component: Run,
        showInSideBar: true
    },
    {
        name: "Debug",
        url: "/debug",
        icon: "icon-magnifier-add",
        component: Debug,
        showInSideBar: true
    },
    {
        name: "Learn",
        url: "/learn",
        icon: "icon-notebook",
        component: Learn,
        showInSideBar: true
    },
    {
        name: "Lesson",
        url: "/lesson",
        icon: "icon-book-open",
        component: Lesson,
        showInSideBar: false
    }
];
