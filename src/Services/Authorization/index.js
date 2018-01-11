import AbstractService  from "../AbstractService";
import Strategies from "./Strategies";

class Authorization extends AbstractService {
  bootstrap () {
    super.bootstrap();

    const strategies = new Strategies(this.getApplication());
    strategies.register();
  }

  static isAuthenticated (req) {
    const token = Authorization.getAuthorizationHeader(req);

    return !!token;
  }

  static getAuthorizationHeader (req) {
    if (!req) {
      return null;
    }

    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[ 0 ] === "Bearer") {
      return req.headers.authorization.split(" ")[ 1 ];
    } else if (req.headers && req.headers.authorization) {
      return req.headers.authorization;
    } else if (req.query && req.query.token) {
      return req.query.token;
    }

    return null;
  }
}

export default Authorization;