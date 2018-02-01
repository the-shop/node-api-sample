import AbstractAction from "../../../Framework/AbstractAction";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import CommentsCollection from "../Collections/Comments";

/**
 * @swagger
 * /comments:
 *   post:
 *     tags:
 *       - Comments
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
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
 *     description: Create new Comment model and returns it
 *     summary: Create new Comment model
 *     responses:
 *       200:
 *         description: Comment successfully created
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
 */
class CreateAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "comments";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput(request) {
    this.getAcl().check("CREATE_COMMENT");

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
      ownerId: request.body.ownerId,
      content: request.body.content,
      owner: request.user._id.toString(),
  };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle({ 
    ownerId,
    content,
    owner,
  }) {
    await this.trigger("EVENT_ACTION_COMMENT_CREATE_MODEL_PRE");

    const model = CommentsCollection.create({
      ownerId, 
      content, 
      owner, 
    });

    await this.trigger("EVENT_ACTION_COMMENT_CREATE_MODEL_CREATED", model);

    await CommentsCollection.save(model);

    await this.trigger("EVENT_ACTION_COMMENT_CREATE_MODEL_POST", model);

    return model;
  }
}

export default CreateAction;
