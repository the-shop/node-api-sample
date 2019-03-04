import UsersCollection from "../Collections/Users";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import AbstractAction from "../../../Framework/AbstractAction";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

/**
 * @swagger
 * /users/:id:
 *   get:
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
 *     description: Find User model by ID
 *     summary: Returns a single User model
 *     responses:
 *       200:
 *         description: User successfully loaded
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
class LoadOneAction extends AbstractAction {
  static VERB = "GET";
  static PATH = "users/:id";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    const { queryFilter, allowedFields } = this.getAcl().check("LOAD_ONE_USER");

    let validatedQuery = {};
    try {
      // Now validate query
      validatedQuery = await UsersCollection.validateQuery(queryFilter, {}, "User");
    } catch (error) {
      throw new InputMalformedError(error.message);
    }

    validatedQuery.id = request.params.id;

    return {
      query: validatedQuery,
      fields: allowedFields,
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({ query, fields }) {
    await this.trigger("EVENT_ACTION_USER_LOAD_MODEL_PRE");

    const model = await UsersCollection.loadOne(query, fields);

    await this.trigger("EVENT_ACTION_USER_LOAD_ONE_MODEL_LOADED", model);

    if (!model) {
      await this.trigger("EVENT_ACTION_USER_LOAD_ONE_MODEL_NOT_FOUND");
      throw new NotFoundError("User model not found.");
    }

    await this.trigger("EVENT_ACTION_USER_LOAD_ONE_MODEL_POST", model);

    return model;
  }
}

export default LoadOneAction;
