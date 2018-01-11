import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from "admin-on-rest";
import cookies from "./Cookies";

import jsonServer, { fetchJson }  from "./jsonServer";

/**
 * @param type
 * @param params
 * @returns {*}
 */
const authClient = (type, params) => {
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const request = new Request("/api/v1/login", {
      method: "POST",
      body: JSON.stringify({
        email: username,
        password
      }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
    return fetchJson(request).then((response) => {
      if (response.status !== 200) {
        return Promise.reject(response.body);
      }

      return response.headers.get("Authorization");
    }).then((token) => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      cookies.set(
        "Authorization",
        token,
        { path: "/", expires: date }
      );
    }).catch(loginError => {
      return Promise.reject(loginError);
    });
  }

  if (type === AUTH_ERROR) {
    const { status } = params;
    if (status === 401 || status === 403) {
      cookies.remove("Authorization");
      return Promise.reject();
    }
    return Promise.resolve();
  }

  if (type === AUTH_CHECK) {
    return cookies.get("Authorization") ? Promise.resolve() : Promise.reject();
  }

  if (type === AUTH_LOGOUT) {
    cookies.remove("Authorization");
    return Promise.resolve();
  }

  return Promise.resolve();
};

/**
 * @param url
 * @param options
 * @returns {*}
 */
const httpClient = (url, options) => {
  options = options || {};
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  const token = cookies.get("Authorization");
  options.headers.set("Authorization", token);

  return fetchJson(url, options)
    .then((res) => {
      if (res.json.models) {
        return {
          headers: res.headers,
          json: res.json.models.map((record) => {
            return record;
          })
        };
      } else {
        const modelData = res.json.model;
        return {
          headers: res.headers,
          json: modelData
        };
      }
    }).catch((json) => {
      return Promise.reject(json && json.errors.join("\n" || "Server error"));
    });
};

export default { authClient, httpClient, jsonServer };
