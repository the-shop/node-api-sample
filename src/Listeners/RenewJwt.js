import jwt from "jsonwebtoken";
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
  async handle ({ httpRequest, httpResponse }) {
    const config = this.getApplication().getConfiguration();
    /**
     * Renew auth token on all calls that require auth
     */
    if (httpRequest.user) {
      const jwtOptions = {};
      const token = await jwt.sign({ email: httpRequest.user.email }, config.jwt.secret, jwtOptions);
      httpResponse.getExpressRes()
        .cookie(
          "Authorization",
          `Bearer ${token}`,
          { path: "/" }
        );

      httpResponse.addHeader("Authorization", `Bearer ${token}`);
    }
  }
}

export default RenewJwt;
