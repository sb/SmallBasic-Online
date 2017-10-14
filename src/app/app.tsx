import * as React from "react";
import { strings } from "./loc";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

import "font-awesome/css/font-awesome.min.css";
import "simple-line-icons/css/simple-line-icons.css";
import "@coreui/react/React_Starter/scss/style.scss";

import { Main } from "./components";

window.document.title = strings.app.productName;

ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route path="/" component={Main} />
        </Switch>
    </HashRouter>
), document.getElementById("react-app"));
