import AbstractAdapter from "../../../Framework/AbstractAdapter";

/**
 * Comment response schema
 *
 * @swagger
 * definitions:
 *   CommentModel:
 *     type: object
 *     required:
 *       - owner
 *       - content
 *     properties:
 *       id:
 *         type: string
 *       owner:
 *         type: string
 *       content:
 *         type: string
 *
 *   CommentResponse:
 *     type: object
 *     required:
 *       - error
 *       - model
 *     properties:
 *       error:
 *         type: boolean
 *       model:
 *         type: object
 *         $ref: '#/definitions/CommentModel'
 *
 *   CommentsResponse:
 *     type: object
 *     required:
 *       - error
 *       - models
 *     properties:
 *       error:
 *         type: boolean
 *       models:
 *         type: array
 *         items:
 *           $ref: '#/definitions/CommentModel'
 *       pagination:
 *         type: object
 *         properties:
 *           pagesCount:
 *             type: number
 *             description: Number of pages for given \"query\", \"start\" and \"end\" request values
 *           totalCount:
 *             type: number
 *             description: Total number of resource items for given \"query\" request value
 *           modelsCount:
 *             type: number
 *             description: Number of items in response
 *           start:
 *             type: number
 *             description: First index of response array you request, default 0
 *           end:
 *             type: number
 *             description: Last index of response array you request, default 10
 *           sort:
 *             type: string
 *             description: Filed name to sort by it, default \"id\"
 *           order:
 *             type: string
 *             description: \"asc\" \/ \"desc\" sort order, default \"asc\"
 */
class Comment extends AbstractAdapter {
  async adapt (model) {
    const out = {};
    const modelData = model.toJSON();


    out.id = modelData.id;
    out.owner = modelData.owner === undefined ? null : modelData.owner;
    out.content = modelData.content === undefined ? null : modelData.content;

    return out;
  }
}

export default Comment;
