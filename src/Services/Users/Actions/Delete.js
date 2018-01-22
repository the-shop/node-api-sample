import UsersCollection from "../Collections/Users";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import AbstractAction from "../../../Framework/AbstractAction";

/**
 * @swagger
 * /users/:id:
 *   delete:
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
 *     description: Find a User model by ID and delete it
 *     summary: Delete a User model
 *     responses:
 *       200:
 *         description: User successfully deleted
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
  static VERB = "DELETE";
  static PATH = "users/:id";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    this.getAcl().check("DELETE_USER");
    return {
      id: request.params.id
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({id}) {
    await this.trigger("EVENT_ACTION_USER_DELETE_MODEL_PRE");

    const model = await UsersCollection.loadOne({_id: id});

    await this.trigger("EVENT_ACTION_USER_DELETE_MODEL_LOADED", model);

    if (!model) {
      await this.trigger("EVENT_ACTION_USER_DELETE_MODEL_NOT_FOUND");
      throw new NotFoundError("User model not found.");
    }

    await UsersCollection.delete({_id: id});

    await this.trigger("EVENT_ACTION_USER_DELETE_MODEL_POST", model);

    return model;
  }
}

export default LoadOneAction;
