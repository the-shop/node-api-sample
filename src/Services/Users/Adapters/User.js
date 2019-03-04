import AbstractAdapter from "../../../Framework/AbstractAdapter";
import UsersCollection from "../../Users/Collections/Users";

/**
 * User response schema
 *
 * @swagger
 * definitions:
 *   UserModel:
 *     type: object
 *     required:
 *       - firstName
 *       - lastName
 *       - email
 *       - role
 *     properties:
 *       id:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       role:
 *         type: string
 *         enum: ["admin", "user"]
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
 *   UserResponse:
 *     type: object
 *     required:
 *       - error
 *       - model
 *     properties:
 *       error:
 *         type: boolean
 *         example: false
 *       model:
 *         type: object
 *         $ref: '#/definitions/UserModel'
 *
 *   UsersResponse:
 *     type: object
 *     required:
 *       - error
 *       - models
 *     properties:
 *       error:
 *         type: boolean
 *         example: false
 *       models:
 *         type: array
 *         items:
 *           $ref: '#/definitions/UserModel'
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
class User extends AbstractAdapter {
  async adapt (model) {
    const out = {};
    const modelData = model.toJSON();

    const adapterRegistry = this.getApplication()
      .getAdaptersRegistry();

    const userAdapter = adapterRegistry.get("User", null);

    let owner = null;
    if (modelData.owner !== undefined) {
      owner = null;
      const { queryFilter, allowedFields } = this.getApplication()
        .getAcl()
        .check("ADAPT_USER_MODEL");
      const query = Object.assign({ id: modelData.owner }, queryFilter);
      const ownerModel = await UsersCollection.loadOne(query, allowedFields);
      if (ownerModel && ownerModel.id !== model.id) {
        owner = await userAdapter.adapt(ownerModel);
      } else if (ownerModel && ownerModel.id === model.id) {
        owner = model;
      }
    }

    out.id = modelData.id;
    out.firstName = modelData.firstName === undefined ? null : modelData.firstName;
    out.lastName = modelData.lastName === undefined ? null : modelData.lastName;
    out.email = modelData.email === undefined ? null : modelData.email;
    out.role = modelData.role === undefined ? "user" : modelData.role;
    out.timeCreated = modelData.timeCreated === undefined ? null : modelData.timeCreated;
    out.timeEdited = modelData.timeEdited === undefined ? null : modelData.timeEdited;
    out.owner = modelData.owner === undefined ? null : modelData.owner;
    out.ownerPopulated = owner;

    return out;
  }
}

export default User;
