import jwt from "jsonwebtoken";
import UsersCollection from "../../Users/Collections/Users";
import AbstractAction from "../../../Framework/AbstractAction";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import CreateUserAction from "../../Users/Actions/Create";
import Email from "../../../../src/Helpers/Email";

/**
 * Registers a user.
 *
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Authorization
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: User's first name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: User's last name
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: Email to use for registration.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     description: Creates new user and returns JWT used for authentication as header along with the user model
 *     summary: Registers a new user
 *     responses:
 *       200:
 *         description: Successful registration
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserResponse'
 *       403:
 *         description: Email taken
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class RegisterAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "register";
  static VERSION = "v1";
  static IS_PUBLIC = true;

  /**
   * Formats input values from request to be passed onto handle() method
   *
   * @param request
   * @returns {Promise<{email, firstName, lastName, password}>}
   */
  async getActionInput (request) {
    if (!request.body.email) {
      throw new InputMalformedError("Field \"email\" is required");
    }

    if (!request.body.firstName) {
      throw new InputMalformedError("Field \"firstName\" is required");
    }

    if (!request.body.lastName) {
      throw new InputMalformedError("Field \"lastName\" is required");
    }

    if (!request.body.password) {
      throw new InputMalformedError("Field \"password\" is required");
    }

    request.body.email = request.body.email.toLowerCase().trim();

    const EmailValidator = new Email();

    if (!EmailValidator.validateEmail(request.body.email)) {
      throw new InputMalformedError("Invalid email format.");
    }

    return request.body;
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle (params, req, res) {
    const config = this.getApplication().getConfiguration();
    const existingUser = await UsersCollection.loadOne({ email: params.email });

    if (existingUser) {
      throw new InputMalformedError("Email already taken");
    }

    const tmpUser = await UsersCollection.create({ email: params.email });
    tmpUser.password = params.password;

    const createAction = new CreateUserAction();
    createAction.setApplication(this.getApplication());
    const user = await createAction.handle(params);

    user.password = params.password;
    user.save();

    await this.trigger("EVENT_ACTION_REGISTER_USER_POST", user);

    const token = jwt.sign({ email: user.email }, config.jwt.secret);
    res.header("Authorization", `Bearer ${token}`);

    return user;
  }
}

export default RegisterAction;
