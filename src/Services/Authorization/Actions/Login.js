import jwt from "jsonwebtoken";
import AbstractAction from "../../../Framework/AbstractAction";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import UnauthorizedError from "../../../Framework/Errors/UnauthorizedError";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import UsersCollection from "../../Users/Collections/Users";

/**
 * Logs in user based on request body input `email` and `password` parameters.
 *
 * Optional param is `rememberLogin`
 *
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authorization
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     description: Login the user
 *     summary: Logs user in
 *     responses:
 *       200:
 *         description: Successful login
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *             description: Bearer JWT used to authorize further requests
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserResponse'
 *       403:
 *         description: Invalid credentials
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class LoginAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "login";
  static VERSION = "v1";
  static IS_PUBLIC = true;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    const email = request.body
      .email
      .toLowerCase()
      .trim();

    if (!email) {
      throw new InputMalformedError("Property 'email' is mandatory for this API call.");
    }

    if (!request.body.password) {
      throw new InputMalformedError("Property 'password' is mandatory for this API call.");
    }

    return {
      email,
      password: request.body.password
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({ email, password }, req, res) {
    const config = this.getApplication().getConfiguration();
    const user = await UsersCollection.loadOne({ email: email.toLowerCase() });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.authenticate(password)) {
      throw new UnauthorizedError("Invalid login email or password");
    }

    const token = jwt.sign({ email: user.email }, config.jwt.secret);

    res.getExpressRes()
      .cookie(
        "Authorization",
        `Bearer ${token}`,
        { path: "/" }
      );
    res.addHeader("Authorization", `Bearer ${token}`);

    return user;
  }
}

export default LoginAction;
