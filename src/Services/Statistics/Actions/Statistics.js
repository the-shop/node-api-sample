import AbstractAction from "../../../Framework/AbstractAction";
import UsersCollection from "../../../Services/Users/Collections/Users";
import PostsCollection from "../../../Services/Posts/Collections/Posts";
import CommentsCollection from "../../../Services/Comments/Collections/Comments";

/**
 * @swagger
 * /statistics/counts:
 *   get:
 *     tags:
 *       - Statistics
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     description: Fetches aggregated counts from database
 *     summary: Fetches aggregated counts
 *     responses:
 *       200:
 *         description: Totals and filtered counts of DB objects
 *         schema:
 *           type: object
 *           $ref: '#/definitions/StatisticResponse'
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
class StatisticsAction extends AbstractAction {
  static VERB = "GET";
  static PATH = "statistics/counts";
  static VERSION = "v1";
  static IS_PUBLIC = false;

  async handle({ user }) {
    await this.trigger("EVENT_ACTION_GET_STATISTICS_PRE", user);

    const stats = {
      totals: {
        users: await UsersCollection.count(),
        posts: await PostsCollection.count(),
        comments: await CommentsCollection.count(),
      },
      filtered: {
        users: {
          admin: await UsersCollection.count({ role: "admin" }),
          user: await UsersCollection.count({ role: "user" }),
        },
      }
    };

    await this.trigger("EVENT_ACTION_GET_STATISTICS_POST", stats);

    return stats;
  }
}

export default StatisticsAction;
