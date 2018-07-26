///<reference path="../../node_modules/monaco-editor/monaco.d.ts" />

import { EditorComponent } from "./components/editor";
import { RunComponent } from "./components/run";
import { DebugComponent } from "./components/debug";
import { reduce, AppState } from "./store";
import * as React from "react";
import { createStore } from "redux";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { Compilation } from "../compiler/compilation";

window.document.title = "SmallBasic-Online";

const initialState: AppState = {
    compilation: new Compilation(`
' A new Program!
TextWindow.WriteLine("What is your name?")
name = TextWindow.Read()
TextWindow.WriteLine("Hello " + name + "!")`
    )
};

const store = createStore(reduce, initialState);

/*
// TODO: inject instrumentation key during build (package is already installed)
AppInsights.downloadAndSetup!({ instrumentationKey: "xxxx-xxx-xxx-xxx-xxxxxxx" });

AppInsights.trackPageView(pageName, pageUrl, otherProps, otherMetrics, pageViewDuration);
AppInsights.trackEvent(eventName, otherProps, otherMetrics);
*/

ReactDOM.render((
    <Provider store={store}>
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
