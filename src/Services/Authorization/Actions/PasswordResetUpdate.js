import AbstractAction from "../../../Framework/AbstractAction";
import UsersCollection from "../../Users/Collections/Users";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import NotFoundError from "../../../Framework/Errors/NotFoundError";

/**
 * Updates password for user based on provided password reset token.
 *
 * @swagger
 * /password-reset:
 *   post:
 *     tags:
 *       - Authorization
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: Password reset token from the emailed link
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: New password value
 *         in: formData
 *         required: true
 *         type: string
 *       - name: passwordConfirm
 *         description: Repeated password value
 *         in: formData
 *         required: true
 *         type: string
 *     description: Updates user password and return user model
 *     summary: Update user password
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserResponse'
 *       403:
 *         description: Field "password" and "passwordConfirm" doesn't match
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class PasswordResetAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "password-reset";
  static VERSION = "v1";
  static IS_PUBLIC = true;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    if (!request.body.token) {
      throw new InputMalformedError("Field \"token\" is required.");
    }

    if (!request.body.password) {
      throw new InputMalformedError("Field \"password\" is required.");
    }

    if (!request.body.passwordConfirm) {
      throw new InputMalformedError("Field \"passwordConfirm\" is required.");
    }

    if (request.body.password !== request.body.passwordConfirm) {
      throw new InputMalformedError("Field \"password\" and \"passwordConfirm\" doesn't match.");
    }

    return {
      token: request.body.token,
      password: request.body.password
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({ token, password }) {
    await this.trigger("EVENT_ACTION_PASSWORD_RESET_PRE");

    const user = await UsersCollection.loadOne({ passResetToken: token });

    if (!user) {
      await this.trigger("EVENT_ACTION_PASSWORD_RESET_USER_NOT_FOUND");
      throw new NotFoundError("Token doesn't exist or has expired.");
    }

    try {
      user.password = password;
    } catch (tokenExpiredError) {
      await this.trigger("EVENT_ACTION_PASSWORD_RESET_TOKEN_EXPIRED");
      throw new NotFoundError(tokenExpiredError.message);
    }

    await UsersCollection.save(user);

    await this.trigger("EVENT_ACTION_PASSWORD_RESET_POST", user);

    return user;
  }
}

export default PasswordResetAction;
