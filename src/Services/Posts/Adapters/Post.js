import AbstractAdapter from "../../../Framework/AbstractAdapter";
import UsersCollection from "../../Users/Collections/Users";
import UserAdapter from "../../Users/Adapters/User";

/**
 * Post response schema
 *
 * @swagger
 * definitions:
 *   PostModel:
 *     type: object
 *     required:
 *       - title
 *       - content
 *     properties:
 *       id:
 *         type: string
 *       title:
 *         type: string
 *       content:
 *         type: string
 *       timeCreated:
 *         type: string
 *         format: date
 *       timeEdited:
 *         type: string
 *         format: date
 *       owner:
 *         type: object
 *         $ref: '#/definitions/UserModel'
 *
 *   PostResponse:
 *     type: object
 *     required:
 *       - error
 *       - model
 *     properties:
 *       error:
 *         type: boolean
 *       model:
 *         type: object
 *         $ref: '#/definitions/PostModel'
 *
 *   PostsResponse:
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
 *           $ref: '#/definitions/PostModel'
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
class Post extends AbstractAdapter {
  async adapt (model) {
    const out = {};
    const modelData = model.toJSON();

    const userAdapter = new UserAdapter();

    let owner = null;
    if (modelData.owner !== undefined) {
      owner = null;
      const ownerModel = await UsersCollection.loadOne({id: modelData.owner});
      if (ownerModel) {
        owner = await userAdapter.adapt(ownerModel);
      }
    }

    out.id = modelData.id;
    out.title = modelData.title === undefined ? null : modelData.title;
    out.content = modelData.content === undefined ? null : modelData.content;
    out.timeCreated = modelData.timeCreated === undefined ? null : modelData.timeCreated;
    out.timeEdited = modelData.timeEdited === undefined ? null : modelData.timeEdited;
    out.owner = modelData.owner === undefined ? null : modelData.owner;
    out.ownerPopulated = owner;

    return out;
  }
}

export default Post;
