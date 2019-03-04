import React from "react";
import ReactDOM from "react-dom";
import AdminPage from "./AdminPage";
import injectTapEventPlugin from "react-tap-event-plugin";
import cookies from "./Cookies";

cookies.setCookiesContent(window.cookie);

try {
  injectTapEventPlugin();
} catch (e) {
  // do nothing
}

ReactDOM.render(
  <AdminPage />,
  document.getElementById("app")
);
