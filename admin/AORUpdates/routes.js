import React from "react";
import { Route } from "react-router-dom";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";

export default [
  <Route
    exact
    path="/password-reset-request"
    component={PasswordResetRequest}
    noLayout
    key="passwordResetRequest"
  />,
  <Route
    exact
    path="/password-reset"
    component={PasswordReset}
    noLayout
    key="PasswordReset"
  />,
  <Route
    exact
    path="/register"
    component={Register}
    noLayout
    key="register"
  />,
];
