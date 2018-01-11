import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import NotFoundError from "../../../Framework/Errors/NotFoundError";
import PostsCollection from "../Collections/Posts";
import AbstractAction from "../../../Framework/AbstractAction";

/**
 * @swagger
 * /posts/:id:
 *   put:
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
 *       - name: title
 *         description: Post title 
 *         type: string
 *         in: body
 *         required: true
 *       - name: content
 *         description: Post content 
 *         type: string
 *         in: body
 *         required: true
 *     description: Updates Post model and returns it
 *     summary: Update Post model values
 *     responses:
 *       200:
 *         description: Post successfully updated
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
class UpdateAction extends AbstractAction {
  static VERB = "PUT";
  static PATH = "posts/:id";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput(request) {
    this.getAcl().check("UPDATE_POST");

    if (typeof request.body.title !== "string") {
      throw new InputMalformedError(
        "Post title is mandatory for this API call."
      );
    }

    if (typeof request.body.content !== "string") {
      throw new InputMalformedError(
        "Post content is mandatory for this API call."
      );
    }

    return {
      id: request.params.id, 
      title: request.body.title,
      content: request.body.content,
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle({
    id, 
    title,
    content,
  }) {
    this.trigger("EVENT_ACTION_POST_UPDATE_MODEL_PRE");

    const model = await PostsCollection.loadOne({ _id: id });

    this.trigger("EVENT_ACTION_POST_UPDATE_MODEL_LOADED", model);

    if (!model) {
      this.trigger("EVENT_ACTION_POST_UPDATE_MODEL_NOT_FOUND");
      throw new NotFoundError("Post model not found.");
    }
  
    model.title = title;
    model.content = content;

    await model.save();

    this.trigger("EVENT_ACTION_POST_UPDATE_MODEL_POST", model);

    return model;
  }
}

export default UpdateAction;
