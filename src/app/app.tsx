import * as React from "react";
import { Main } from "./components";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

import "./content/scss/styles.scss";

window.document.title = "SuperBasic";

ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route path="/" component={Main} />
        </Switch>
    </HashRouter>
), document.getElementById("react-app"));
