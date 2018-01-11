import CommentsCollection from "../Collections/Comments";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import AbstractAction from "../../../Framework/AbstractAction";

/**
 * @swagger
 * /comments/:id:
 *   get:
 *     tags:
 *       - Comments
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Comment's ID
 *         required: true
 *         type: string
 *     description: Find Comment model by ID
 *     summary: Returns a single Comment model
 *     responses:
 *       200:
 *         description: Comment successfully loaded
 *         schema:
 *           type: object
 *           $ref: '#/definitions/CommentResponse'
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
 *         description: Comment model not found
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorResponse'
 */
class LoadOneAction extends AbstractAction {
  static VERB = "GET";
  static PATH = "comments/:id";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    this.getAcl().check("LOAD_ONE_COMMENT");
    return {
      id: request.params.id
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({id}) {
    this.trigger("EVENT_ACTION_COMMENT_LOAD_MODEL_PRE");

    const model = await CommentsCollection.loadOne({_id: id});

    this.trigger("EVENT_ACTION_COMMENT_LOAD_ONE_MODEL_LOADED", model);

    if (!model) {
      this.trigger("EVENT_ACTION_COMMENT_LOAD_ONE_MODEL_NOT_FOUND");
      throw new NotFoundError("Comment model not found.");
    }

    this.trigger("EVENT_ACTION_COMMENT_LOAD_ONE_MODEL_POST", model);

    return model;
  }
}

export default LoadOneAction;
