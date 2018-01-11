/**
 * @swagger
 * definitions:
 *   ErrorResponse:
 *     type: object
 *     required:
 *       - error
 *       - errors
 *     properties:
 *       error:
 *         type: boolean
 *       errors:
 *         type: array
 *         items:
 *           type: string
 */
class FrameworkError extends Error {
  constructor (message, code = 500) {
    super(message, code);

    this.message = message;
    this.code = code;
  }
}

export default FrameworkError;
