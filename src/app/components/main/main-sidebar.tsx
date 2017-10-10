import * as React from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";

import {sections} from "../../navigation";

export class Sidebar extends React.Component<RouteComponentProps<{}>> {
    private sidebarMinimize(): void {
        document.body.classList.toggle("sidebar-minimized");
        document.body.classList.toggle("brand-minimized");
    }

    private activeRoute(routeName: string): string {
        return this.props.location.pathname.indexOf(routeName) >= 0 ? "nav-link active" : "nav-link";
    }

    public render(): JSX.Element {
        return (
            <div className="sidebar">
                <nav className="sidebar-nav">
                    <Nav>
                        {sections.map((item, index) =>
                            <NavItem key={index}>
                                <NavLink to={item.url} className={this.activeRoute(item.url)}>
                                    <i className={item.icon}></i>{item.name}
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </nav>
                <button className="sidebar-minimizer" type="button" onClick={this.sidebarMinimize}></button>
            </div>
        );
    }
}
