import * as React from "react";
import { NavbarToggler, NavbarBrand } from "reactstrap";

export class Header extends React.Component {
    private sidebarToggle(e: React.FormEvent<HTMLElement>): void {
        e.preventDefault();
        document.body.classList.toggle("sidebar-hidden");
    }

    private mobileSidebarToggle(e: React.FormEvent<HTMLElement>): void {
        e.preventDefault();
        document.body.classList.toggle("sidebar-mobile-show");
    }

    public render(): JSX.Element {
        return (
            <header className="app-header navbar">
                <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>&#9776;</NavbarToggler>
                <NavbarBrand href="#"></NavbarBrand>
                <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>&#9776;</NavbarToggler>
            </header>
        );
    }
}
