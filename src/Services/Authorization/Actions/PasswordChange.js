import AbstractAction from "../../../Framework/AbstractAction";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import UsersCollection from "../../Users/Collections/Users";
import config from "../../../config";
/**
 * Changes password for current user
 *
 * @swagger
 * /password-change:
 *   post:
 *     tags:
 *       - Authorization
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: password
 *         description: New password value
 *         in: formData
 *         required: true
 *         type: string
 *       - name: passwordRepeat
 *         description: Repeated value for new password
 *         in: formData
 *         required: true
 *         type: string
 *       - name: currentPassword
 *         description: Current user password, required if configuration requires it
 *         in: formData
 *         required: false
 *         type: string
 *     description: Change password for currently logged in user
 *     summary: Change password for currently logged in user
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
class PasswordChangeAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "password-change";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    // Check if config value allows change without current password
    const requireCurrentPassword = !!["true", true].find(one => config.password.requireCurrentOnChange === one);

    if (requireCurrentPassword  && !request.body.currentPassword) {
      throw new InputMalformedError("Field \"currentPassword\" is required");
    }

    if (!request.body.password) {
      throw new InputMalformedError("Field \"password\" is required");
    }

    if (!request.body.passwordRepeat) {
      throw new InputMalformedError("Field \"passwordRepeat\" is required");
    }

    if (request.body.password !== request.body.passwordRepeat) {
      throw new InputMalformedError("Passwords don't match");
    }

    const user = request.user;

    // If config requires current password - validate value
    if (requireCurrentPassword) {
      const currentUserPassHash = user.hashedPassword;
      const hashedCurrentPassword = user.encryptPassword(request.body.currentPassword);
      if (currentUserPassHash !== hashedCurrentPassword) {
        throw new InputMalformedError("Current password is not correct");
      }
    }

    return {
      password: request.body.password,
      user: user,
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({ password, user }) {
    this.trigger("EVENT_ACTION_PASSWORD_CHANGE_PRE");

    user.passResetTime = Math.round(new Date() / 1000);
    user.password = password;

    await UsersCollection.save(user);

    this.trigger("EVENT_ACTION_PASSWORD_CHANGE_POST");

    return user;
  }
}

export default PasswordChangeAction;
