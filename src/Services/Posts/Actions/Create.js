import AbstractAction from "../../../Framework/AbstractAction";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import PostsCollection from "../Collections/Posts";

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Posts
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
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
 *     description: Create new Post model and returns it
 *     summary: Create new Post model
 *     responses:
 *       200:
 *         description: Post successfully created
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
 */
class CreateAction extends AbstractAction {
  static VERB = "POST";
  static PATH = "posts";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput(request) {
    this.getAcl().check("CREATE_POST");

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

    await this.trigger("EVENT_ACTION_POST_CREATE_MODEL_ACTION_INPUT_POST");

    return {
      title: request.body.title,
      content: request.body.content,
      owner: request.user._id.toString(),
  };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle({ 
    title,
    content,
    owner,
  }) {
    await this.trigger("EVENT_ACTION_POST_CREATE_MODEL_PRE");

    const model = PostsCollection.create({
      title, 
      content, 
      owner, 
    });

    await this.trigger("EVENT_ACTION_POST_CREATE_MODEL_CREATED", model);

    await PostsCollection.save(model);

    await this.trigger("EVENT_ACTION_POST_CREATE_MODEL_POST", model);

    return model;
  }
}

export default CreateAction;
