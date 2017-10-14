import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { default as packageInfo } from "./package-info";

import "font-awesome/css/font-awesome.min.css";
import "simple-line-icons/css/simple-line-icons.css";
import "@coreui/react/React_Starter/scss/style.scss";

import { Main } from "./components/main/main";

window.document.title = packageInfo.title;

ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route path="/" component={Main} />
        </Switch>
    </HashRouter>
), document.getElementById("react-app"));
