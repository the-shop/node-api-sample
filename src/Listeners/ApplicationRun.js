import AbstractListener from "../Framework/AbstractListener";
import Database from "../Database/Database";
import config from "../config";
import Application from "../Application";

/**
 * Used by framework to actually run the Application
 */
class ApplicationRun extends AbstractListener {
  /**
   * Array of event string identifiers
   *
   * @type {Array}
   */
  static LISTEN_ON = [
    Application.EVENT_APPLICATION_RUN
  ];

  /**
   * Listener entry point
   */
  handle () {
    this.getApplication()
      .getEventsRegistry()
      .trigger(Application.EVENT_APPLICATION_RUN_PRE, this.getApplication());

    try {
      this.getApplication().log("Connecting to Mongo");
      const database = new Database({ keepAlive: true });
      database.setApplication(this.getApplication());
      database.connect();

      this.getApplication().setDatabase(database);

      this.getApplication().log("REGISTER: Routes");
      this.getApplication().getRouter().registerRoutes();

      this.getApplication().log("REGISTER: Error handler");
      this.registerErrorHandler();

      this.startExpress();

    } catch (error) {
      this.getApplication()
        .logError(error.stack || error);
    }

    this.getApplication()
      .getEventsRegistry()
      .trigger(Application.EVENT_APPLICATION_RUN_POST, this.getApplication());
  }

  /**
   * Actually starts the express Application
   */
  startExpress () {
    this.getApplication()
      .getEventsRegistry()
      .trigger(Application.EVENT_EXPRESS_START_PRE, this.getApplication());

    if (this.getApplication().getExpress().get("env") === "test") {
      this.getApplication().log("Test environment detected. Exiting.");
      return;
    }

    const port = this.getApplication()
      .getExpressPort();

    this.getApplication()
      .getExpress()
      .listen(port, () => {
        this.getApplication().log(`API started on port ${port}`);
        return this.getApplication()
          .getEventsRegistry()
          .trigger(
            Application.EVENT_EXPRESS_START_POST,
            this.getApplication()
              .getExpress()
          );
      });
  }

  registerErrorHandler () {
    /**
     * Error handling
     */
    this.getApplication()
      .getExpress()
      .use((err, req, res, next) => {
        if (res.headersSent) {
          return next(err);
        }

        let errors = [];
        let code = 500;

        if (err.constructor.name === "FacebookApiException") {
          errors.push(err.response.error.message);
          code = 400;
        }

        if (err.name === "JsonWebTokenError") {
          errors.push(err.message);
          code = 401;
        }

        if (err.message
          && (~err.message.indexOf("Cast to ObjectId failed"))
        ) {
          errors.push("Invalid value for ID provided");
          code = 400;
        }

        if (err.constructor.name === "NotFoundError"
          || err.constructor.name === "InputMalformedError"
          || err.constructor.name === "UnauthorizedError"
        ) {
          errors.push(err.message);
          code = err.code;
        }

        const response = {
          error: true
        };

        // Show stack based on debug config flag if not test environment
        if (config.debug && config.env !== "test") {
          response.stack = err.stack;
        }

        // Handle input validation errors
        if (err.name === "ValidationError") {
          const keys = Object.keys(err.errors);
          for (const one of keys) {
            errors.push(err.errors[ one ].message);
          }
          code = 400;
        }

        response.errors = errors;

        if (code === 500) {
          this.getApplication()
            .logError("Internal server error occurred: %O", err);
        }

        if (!errors.length) {
          errors.push(err.message ? err.message : "Unknown error occurred.");
        }

        return res.status(code).json(response);
      });

    /**
     * 404 middleware since no middleware responded
     */
    this.getApplication()
      .getExpress()
      .use(function (req, res) {
        res.status(404).json({
          error: true,
          errors: [ "Route not found" ]
        });
      });
  }
}

export default ApplicationRun;
