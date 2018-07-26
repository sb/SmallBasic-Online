/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
/// <reference path="../../node_modules/konva/konva.d.ts" />

import { EditorComponent } from "./components/editor";
import { RunComponent } from "./components/run";
import { DebugComponent } from "./components/debug";
import { reduce, createInitialState } from "./store";
import * as React from "react";
import { createStore } from "redux";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

window.document.title = "SmallBasic-Online";

ReactDOM.render((
    <Provider store={createStore(reduce, createInitialState())}>
        <HashRouter>
            <Switch>
                <Route path="/editor" component={EditorComponent} />
                <Route path="/run" component={RunComponent} />
                <Route path="/debug" component={DebugComponent} />
                <Redirect from="/" to="/editor" />
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById("react-app"));
