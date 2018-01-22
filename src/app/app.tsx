import { EditorComponent } from "./components/editor";
import { RunComponent } from "./components/run";
import { reduce } from "./store";
import * as React from "react";
import { createStore } from "redux";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

// TODO: get from settings along with version
window.document.title = "SuperBasic";

const store = createStore(reduce);

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/editor" component={EditorComponent} />
                <Route path="/run" component={RunComponent} />
                <Redirect from="/" to="/editor" />
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById("react-app"));
