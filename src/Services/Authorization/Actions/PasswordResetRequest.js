import AbstractAction from "../../../Framework/AbstractAction";
import UsersCollection from "../../Users/Collections/Users";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import Email from "../../../../src/Helpers/Email";

/**
 * Generates password reset token
 *
 * @swagger
 * /password-reset-request:
 *   post:
 *     tags:
 *       - Authorization
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email for password reset
 *         in: formData
 *         required: true
 *         type: string
 *     description: Updates user model password_reset_token and password_reset_time fields, creates reset link and sends it to user email
 *     summary: Creates password reset link and send email to user
 *     responses:
 *       200:
 *         description: Successful operation
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserResponse'
 *       400:
 *         description: Malformed input
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 *       404:
 *         description: Email not found
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class PasswordResetRequestAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "password-reset-request";
  static VERSION = "v1";
  static IS_PUBLIC = true;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    if (!request.body.email) {
      throw new InputMalformedError("Field \"email\" is required");
    }

    request.body.email = request.body.email.toLowerCase().trim();

    const EmailValidator = new Email();

    if (!EmailValidator.validateEmail(request.body.email)) {
      throw new InputMalformedError("Invalid email format.");
    }

    return {
      email: request.body.email,
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({ email }) {
    await this.trigger("EVENT_ACTION_PASSWORD_RESET_REQUEST_PRE");

    const user = await UsersCollection.loadOne({ email: email });

    if (!user) {
      await this.trigger("EVENT_ACTION_PASSWORD_RESET_REQUEST_USER_NOT_FOUND");
      throw new NotFoundError("User with provided email doesn't exist.");
    }

    user.generatePasswordRestToken();

    await UsersCollection.save(user);

    await this.trigger("EVENT_ACTION_PASSWORD_RESET_REQUEST_POST", user);

    return user;
  }
}

export default PasswordResetRequestAction;
