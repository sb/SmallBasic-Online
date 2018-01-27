/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />

import { EditorComponent } from "./components/editor";
import { RunComponent } from "./components/run";
import { reduce, AppState } from "./store";
import * as React from "react";
import { createStore } from "redux";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { Compilation } from "../compiler/compilation";

// TODO: get from settings along with version
window.document.title = "SuperBasic";

const initialState: AppState = {
    compilation: new Compilation([
        `' A new Program!`,
        `TextWindow.WriteLine("Hello World!")`
    ].join("\n"))
};

const store = createStore(reduce, initialState);

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
