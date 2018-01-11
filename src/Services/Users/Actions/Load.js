import UsersCollection from "../Collections/Users";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import AbstractAction from "../../../Framework/AbstractAction";

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: query
 *         type: string
 *         description: JSON serialized query object
 *       - in: query
 *         name: search
 *         type: string
 *         description: JSON serialized object or primitive type value for simplified search
 *     description: Load User models
 *     summary: Return a list of User models
 *     responses:
 *       200:
 *         description: Users successfully loaded
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UsersResponse'
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
class LoadAction extends AbstractAction {
  static VERB = "GET";
  static PATH = "users";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  /**
   * Formats input values from request to be passed onto handle() method
   */
  async getActionInput (request) {
    let searchableFields = [
    ];

    const { queryFilter, allowedFields } = this.getAcl().check("LOAD_USERS");

    let query = this.parseQueryInput(searchableFields, request.query.query);

    // Apply query filter based on ACL rules
    query = Object.assign(query, queryFilter);

    const search = this.parseQueryInput(searchableFields, request.query.search, true);

    let validatedQuery = {};
    try {
      // Now validate query
      validatedQuery = await UsersCollection.validateQuery(query, search, "User");
    } catch (error) {
      throw new InputMalformedError(error.message);
    }

    return {
      query: validatedQuery,
      fields: allowedFields,
      start: parseInt(request.query.start || 0, 10),
      end: parseInt(request.query.end || 10, 10),
      sort: request.query.sort || "_id",
      order: request.query.order || "asc",
      request
    };
  }

  /**
   * Actual handler for the API endpoint
   */
  async handle ({ query, fields, start, end, sort, order }, expressReq, expressRes) {
    this.trigger("EVENT_ACTION_USER_LOAD_MODELS_PRE");

    const models = await UsersCollection.load(
      query,
      fields,
      start,
      end,
      sort,
      order
    );

    this.trigger("EVENT_ACTION_USER_LOAD_MODELS_LOADED", models);

    expressRes.header("X-Total-Count", await UsersCollection.count(query));

    return models;
  }
}

export default LoadAction;
