import { About } from "./about";
import { Dashboard } from "./dashboard";

interface ISection {
    name: string;
    url: string;
    icon: string;
    component: React.ComponentClass;
}

export const defaultSection = "/dashboard";

export const sections: ISection[] = [
    {
        name: "Dashboard",
        url: "/dashboard",
        icon: "icon-speedometer",
        component: Dashboard
    },
    {
        name: "About",
        url: "/about",
        icon: "icon-info",
        component: About
    }
];
