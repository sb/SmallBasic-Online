import * as React from "react";
import { strings } from "../loc";
import * as navigation from "./navigation";
import { Container, NavbarToggler, NavbarBrand, Nav, NavItem } from "reactstrap";
import { Switch, Route, Redirect, RouteComponentProps, NavLink } from "react-router-dom";

export class Main extends React.Component<RouteComponentProps<{}>> {
  private sidebarToggle(e: React.FormEvent<HTMLElement>): void {
    e.preventDefault();
    document.body.classList.toggle("sidebar-mobile-show");
  }

  private activeRoute(routeName: string): string {
    return this.props.location.pathname.indexOf(routeName) >= 0 ? "nav-link active" : "nav-link";
  }

  private sidebarCollapse(): void {
    if (document.body.classList.contains("sidebar-mobile-show")) {
      document.body.classList.remove("sidebar-mobile-show");
    }
  }

  public render(): JSX.Element {
    return (
      <div className="app">
        <header className="app-header navbar">
          <NavbarToggler className="d-lg-none" onClick={this.sidebarToggle}>&#9776;</NavbarToggler>
          <NavbarBrand href="#"></NavbarBrand>
        </header>
        <div className="app-body">
          <div className="sidebar">
            <nav className="sidebar-nav">
              <Nav>
                {navigation.sections.map((item, index) =>
                  <NavItem key={index}>
                    <NavLink to={item.url} className={this.activeRoute(item.url)} onClick={this.sidebarCollapse}>
                      <i className={item.icon}></i>{item.name}
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
            </nav>
          </div>
          <main className="main">
            <Container fluid>
              <div className="main-page-container">
                <Switch>
                  {navigation.sections.map(section =>
                    <Route key={section.name} path={section.url} component={section.component} />
                  )}
                  <Redirect from="/" to={navigation.defaultSection} />
                </Switch>
              </div>
            </Container>
          </main>
        </div>
        <footer className="app-footer">
          <span>
            <a href="https://github.com/OmarTawfik/SuperBasic" target="_blank">{strings.app.productName} {strings.app.productVersion}</a>
            &nbsp;
            {strings.app.productDescription}
          </span>
        </footer>
      </div>
    );
  }
}
