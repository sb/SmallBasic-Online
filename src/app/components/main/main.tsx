import * as React from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import { Container } from "reactstrap";

import { Header } from "./main-header";
import { Sidebar } from "./main-sidebar";

import { sections, defaultSection } from "../../navigation";

export class Main extends React.Component<RouteComponentProps<{}>> {
  public render(): JSX.Element {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props} />
          <main className="main">
            <Container fluid>
              <Switch>
                {sections.map(section => <Route key={section.name} path={section.url} component={section.component} />)}
                <Redirect from="/" to={defaultSection} />
              </Switch>
            </Container>
          </main>
        </div>
        <footer className="app-footer">
            <span><a href="http://coreui.io">CoreUI</a> &copy; 2017 creativeLabs.</span>
            <span className="ml-auto">Powered by <a href="http://coreui.io">CoreUI</a></span>
        </footer>
      </div>
    );
  }
}
