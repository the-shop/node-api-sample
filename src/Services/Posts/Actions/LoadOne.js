import PostsCollection from "../Collections/Posts";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import AbstractAction from "../../../Framework/AbstractAction";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

/**
 * @swagger
 * /posts/:id:
 *   get:
 *     tags:
 *       - Posts
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Post's ID
 *         required: true
 *         type: string
 *     description: Find Post model by ID
 *     summary: Returns a single Post model
 *     responses:
 *       200:
 *         description: Post successfully loaded
 *         schema:
 *           type: object
 *           $ref: '#/definitions/PostResponse'
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
 *         description: Post model not found
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class LoadOneAction extends AbstractAction {
  static VERB = "GET";
  static PATH = "posts/:id";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    const { queryFilter, allowedFields } = this.getAcl().check("LOAD_ONE_POST");

    let validatedQuery = {};
    try {
      // Now validate query
      validatedQuery = await PostsCollection.validateQuery(queryFilter, {}, "Post");
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
    await this.trigger("EVENT_ACTION_POST_LOAD_MODEL_PRE");

    const model = await PostsCollection.loadOne(query, fields);

    await this.trigger("EVENT_ACTION_POST_LOAD_ONE_MODEL_LOADED", model);

    if (!model) {
      await this.trigger("EVENT_ACTION_POST_LOAD_ONE_MODEL_NOT_FOUND");
      throw new NotFoundError("Post model not found.");
    }

    await this.trigger("EVENT_ACTION_POST_LOAD_ONE_MODEL_POST", model);

    return model;
  }
}

export default LoadOneAction;
