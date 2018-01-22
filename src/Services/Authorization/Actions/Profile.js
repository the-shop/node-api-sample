import jwt from "jsonwebtoken";
import AbstractAction from "../../../Framework/AbstractAction";
import UnauthorizedError from "../../../Framework/Errors/UnauthorizedError";
import UsersCollection from "../../Users/Collections/Users";
import Authorization from "../index";
import PasswordStrategy from "../Strategies/PasswordStrategy";

/**
 * @swagger
 * /profile:
 *   get:
 *     tags:
 *       - Authorization
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: authorization
 *         in: header
 *         description: JWT authorization token
 *         required: true
 *         type: string
 *     description: Returns logged in user
 *     summary: Authenticates a user from authorization token and returns the User model
 *     responses:
 *       200:
 *         description: Logged in user model
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserResponse'
 *       403:
 *         description: Invalid token provided
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class ProfileAction extends AbstractAction {
  static VERB = "GET";
  static PATH = "profile";
  static VERSION = "v1";
  static IS_PUBLIC = true;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput(request) {
    const jwtString = Authorization.getAuthorizationHeader(request);
    const error = new UnauthorizedError("Not logged in");

    if (!jwtString) {
      throw error;
    }

    const decodedData = await jwt.decode(jwtString, PasswordStrategy.getJwtParams());

    if (!decodedData || !decodedData.email) {
      throw error;
    }

    const user = UsersCollection.loadOne({ email: decodedData.email });
    if (!user) {
      throw error;
    }

    return {
      user,
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle({ user }) {
    await this.trigger("EVENT_ACTION_PROFILE_GET");

    return user;
  }
}

export default ProfileAction;
