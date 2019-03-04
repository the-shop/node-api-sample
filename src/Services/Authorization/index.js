import passportJWT from "passport-jwt";
import AbstractService  from "../AbstractService";
import Strategies from "./Strategies";
import config from "../../config";

/**
 * Authorization
 */
class Authorization extends AbstractService {
  /**
   * Setup the instance
   */
  bootstrap () {
    super.bootstrap();

    const strategies = new Strategies(this.getApplication());
    strategies.register();
  }

  /**
   * Checks if auth header is provided
   *
   * @param req
   * @returns {boolean}
   */
  static isAuthenticated (req) {
    const token = Authorization.getAuthorizationHeader(req);

    return !!token;
  }

  /**
   * Attempts to parse JWT from various places
   *
   * @param req
   * @returns string|null
   */
  static getAuthorizationHeader (req) {
    if (!req) {
      return null;
    }

    // Try to read from headers, query, and cookies
    if (req.headers && req.headers.authorization && req.headers.authorization.split(" ")[ 0 ] === "Bearer") {
      return req.headers.authorization.split(" ")[ 1 ];
    } else if (req.headers && req.headers.authorization) {
      return req.headers.authorization;
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.cookies.authToken && req.cookies.authToken.split(" ")[ 0 ] === "Bearer") {
      return req.cookies.authToken.split(" ")[ 1 ];
    } else if (req.cookies.authToken) {
      return req.cookies.authToken;
    } else if (req.cookies.authorization && req.cookies.authorization.split(" ")[ 0 ] === "Bearer") {
      return req.cookies.authorization.split(" ")[ 1 ];
    } else if (req.cookies.authorization) {
      return req.cookies.authorization;
    } else if (req.cookies.Authorization && req.cookies.Authorization.split(" ")[ 0 ] === "Bearer") {
      return req.cookies.Authorization.split(" ")[ 1 ];
    } else if (req.cookies.Authorization) {
      return req.cookies.Authorization;
    }

    return null;
  }

  /**
   * Returns JWT params object
   *
   * @returns {{secretOrKey: *, jwtFromRequest: *}}
   */
  static getJwtParams() {
    return {
      secretOrKey: config.jwt.secret,
      jwtFromRequest: passportJWT.ExtractJwt
        .fromExtractors([ Authorization.getAuthorizationHeader ])
    };
  }
}

export default Authorization;