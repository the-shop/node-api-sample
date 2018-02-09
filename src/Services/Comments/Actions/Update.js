import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import CommentsCollection from "../Collections/Comments";
import AbstractAction from "../../../Framework/AbstractAction";

/**
 * @swagger
 * /comments/:id:
 *   put:
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
 *       - name: ownerId
 *         description: Comment owner 
 *         type: schema.types.objectid
 *         in: body
 *         required: true
 *       - name: content
 *         description: Post content 
 *         type: string
 *         in: body
 *         required: true
 *     description: Updates Comment model and returns it
 *     summary: Update Comment model values
 *     responses:
 *       200:
 *         description: Comment successfully updated
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
class UpdateAction extends AbstractAction {
  static VERB = "PUT";
  static PATH = "comments/:id";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput(request) {
    this.getAcl().check("UPDATE_COMMENT");

    if (typeof request.body.ownerId !== "string") {
      throw new InputMalformedError(
        "Comment owner is mandatory for this API call."
      );
    }

    if (typeof request.body.content !== "string") {
      throw new InputMalformedError(
        "Post content is mandatory for this API call."
      );
    }

    return {
      id: request.params.id,
      ownerId: request.body.ownerId,
      content: request.body.content,
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle({
    id, 
    ownerId, 
    content, 
    }) {
    await this.trigger("EVENT_ACTION_COMMENT_UPDATE_MODEL_PRE");

    const model = await CommentsCollection.loadOne({ _id: id });

    await this.trigger("EVENT_ACTION_COMMENT_UPDATE_MODEL_LOADED", model);

    if (!model) {
      await this.trigger("EVENT_ACTION_COMMENT_UPDATE_MODEL_NOT_FOUND");
      throw new NotFoundError("Comment model not found.");
    }
  
    model.ownerId = ownerId;
    model.content = content;

    await CommentsCollection.save(model);

    await this.trigger("EVENT_ACTION_COMMENT_UPDATE_MODEL_POST", model);

    return model;
  }
}

export default UpdateAction;
