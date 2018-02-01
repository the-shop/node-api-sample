import AbstractAction from "../../../Framework/AbstractAction";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import UsersCollection from "../Collections/Users";

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: User's first name 
 *         type: string
 *         in: body
 *         required: true
 *       - name: lastName
 *         description: User's last name 
 *         type: string
 *         in: body
 *         required: true
 *       - name: email
 *         description: User's description 
 *         type: string
 *         in: body
 *         required: true
 *       - name: role
 *         description: User's role 
 *         type: string
 *         in: body
 *         required: true
 *     description: Create new User model and returns it
 *     summary: Create new User model
 *     responses:
 *       200:
 *         description: User successfully created
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserResponse'
 *       400:
 *         description: Malformed input
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 *       401:
 *         description: This API call requires authorization
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 *       403:
 *         description: Forbidden to do this action
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class CreateAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "users";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput(request) {
    this.getAcl().check("CREATE_USER");

    if (typeof request.body.firstName !== "string") {
      throw new InputMalformedError(
        "User&#39;s first name is mandatory for this API call."
      );
    }

    if (typeof request.body.lastName !== "string") {
      throw new InputMalformedError(
        "User&#39;s last name is mandatory for this API call."
      );
    }

    if (typeof request.body.email !== "string") {
      throw new InputMalformedError(
        "User&#39;s description is mandatory for this API call."
      );
    }

    if (typeof request.body.role !== "string") {
      throw new InputMalformedError(
        "User&#39;s role is mandatory for this API call."
      );
    }

    // Field "email" has "unique" index applied to it so check if value already taken
    if (await UsersCollection.loadOne({email: request.body.email}) !== null) {
      throw new InputMalformedError("Email is taken.");
    }

    return {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      role: request.body.role,
      owner: request.user._id.toString(),
  };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle({ 
    firstName,
    lastName,
    email,
    role,
    owner,
  }) {
    await this.trigger("EVENT_ACTION_USER_CREATE_MODEL_PRE");

    const model = UsersCollection.create({
      firstName, 
      lastName, 
      email, 
      role, 
      owner, 
    });

    await this.trigger("EVENT_ACTION_USER_CREATE_MODEL_CREATED", model);

    await UsersCollection.save(model);

    await this.trigger("EVENT_ACTION_USER_CREATE_MODEL_POST", model);

    return model;
  }
}

export default CreateAction;
