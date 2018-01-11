import jwt from "jsonwebtoken";
import config from "../config";
import AbstractListener from "../Framework/AbstractListener";
import Router from "../Framework/Application/Router";

/**
 * Used to renew JWT for already authorized users
 */
class RenewJwt extends AbstractListener {
  /**
   * Array of event string identifiers
   *
   * @type {Array}
   */
  static LISTEN_ON = [
    Router.EVENT_ROUTER_ROUTE_HANDLE_PRE
  ];

  /**
   * Listener entry point
   */
  async handle ({ expressRes, expressReq }) {
    /**
     * Renew auth token on all calls that require auth
     */
    if (expressReq.user) {
      const jwtOptions = {};
      const token = await jwt.sign({ email: expressReq.user.email }, config.jwt.secret, jwtOptions);
      expressRes.header("Authorization", `Bearer ${token}`);
    }
  }
}

export default RenewJwt;
