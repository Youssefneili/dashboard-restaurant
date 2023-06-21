import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminLayout from "layouts/Admin.js";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="1092923765283-te746nbj4g21ftlirbi2r3vheodtdirb.apps.googleusercontent.com">
   <App/>
    <BrowserRouter>
      <Switch>
      {/* <Route exact path="/" component={App} /> */}
        <Route path="/admin" component={AdminLayout} />
      </Switch>
    </BrowserRouter>
  </GoogleOAuthProvider>
);