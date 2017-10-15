import * as React from "react";
import { strings } from "./loc";
import { Main } from "./components";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

import "./content/scss/styles.scss";

window.document.title = strings.app.productName;

ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route path="/" component={Main} />
        </Switch>
    </HashRouter>
), document.getElementById("react-app"));
