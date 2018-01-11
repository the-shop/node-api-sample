import React from "react";
import { Route } from "react-router-dom";
import Register from "./Register";

export default [
  <Route exact path="/register" component={Register} noLayout key="register" />,
];
