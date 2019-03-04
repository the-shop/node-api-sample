import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import UsersCollection from "../Collections/Users";
import AbstractAction from "../../../Framework/AbstractAction";

/**
 * @swagger
 * /users/:id:
 *   put:
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User's ID
 *         required: true
 *         type: string
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
 *     description: Updates User model and returns it
 *     summary: Update User model values
 *     responses:
 *       200:
 *         description: User successfully updated
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
 *       404:
 *         description: User model not found
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class UpdateAction extends AbstractAction {
  static VERB = "PUT";
  static PATH = "users/:id";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput(request) {
    this.getAcl().check("UPDATE_USER");

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
    const existingModel = await UsersCollection.loadOne({email: request.body.email});
    if (existingModel !== null && existingModel._id.toString() !== request.params.id.toString()) {
throw new InputMalformedError("Email is taken.");
    }

    await this.trigger("EVENT_ACTION_USER_UPDATE_MODEL_ACTION_INPUT_POST");

    return {
      id: request.params.id,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      role: request.body.role,
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle({
    id, 
    firstName, 
    lastName, 
    email, 
    role, 
    }) {
    await this.trigger("EVENT_ACTION_USER_UPDATE_MODEL_PRE");

    const model = await UsersCollection.loadOne({ _id: id });

    await this.trigger("EVENT_ACTION_USER_UPDATE_MODEL_LOADED", model);

    if (!model) {
      await this.trigger("EVENT_ACTION_USER_UPDATE_MODEL_NOT_FOUND");
      throw new NotFoundError("User model not found.");
    }
  
    model.firstName = firstName;
    model.lastName = lastName;
    model.email = email;
    model.role = role;

    await UsersCollection.save(model);

    await this.trigger("EVENT_ACTION_USER_UPDATE_MODEL_POST", model);

    return model;
  }
}

export default UpdateAction;
