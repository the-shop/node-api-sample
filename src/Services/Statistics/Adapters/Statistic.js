import AbstractAdapter from "../../../Framework/AbstractAdapter";

/**
 * Statistic response schema
 *
 * @swagger
 * definitions:
 *   StatisticModel:
 *     type: object
 *     properties:
 *       stats:
 *         type: object
 *         properties: 
 *           users:
 *             type: "number"
 *           posts:
 *             type: "number"
 *           comments:
 *             type: "number"
 *       filtered:
 *         type: object
 *         properties: 
 *           users:
 *             type: object
 *             properties: 
 *              admin:
 *                type: "number" 
 *              user:
 *                type: "number"   
 *   StatisticResponse:
 *     type: object
 *     required:
 *       - error
 *       - model
 *     properties:
 *       error:
 *         type: boolean
 *       model:
 *         type: object
 *         $ref: '#/definitions/StatisticModel'
 */
class Statistic extends AbstractAdapter {
  adapt (model) {
    return model;
  }
}

export default Statistic;
