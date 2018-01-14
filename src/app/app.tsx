import { MainFrame } from "./content/components/main-frame";
import { reduce } from "./store";
import * as React from "react";
import { createStore } from "redux";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import "./content/css/documentation.css";
import "./content/css/layout.css";
import "./content/css/toolbar.css";

import "../../node_modules/jquery/dist/jquery.js";

// TODO: get from settings along with version
window.document.title = "SuperBasic";

// TODO: pass initial state (code from url) if it exists
const store = createStore(reduce, undefined);

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/" component={MainFrame} />
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById("react-app"));
