import newrelic from "newrelic";
import AbstractListener from "../Framework/AbstractListener";
import Database from "../Database/Database";
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
  async handle () {
    const app = this.getApplication();

    app.getEventsRegistry()
      .trigger(Application.EVENT_APPLICATION_RUN_PRE, app);

    try {
      this.getApplication().log("Connecting to Mongo");
      const database = new Database({ keepAlive: true });
      database.setApplication(app)
        .connect();

      app.setDatabase(database)
        .log("REGISTER: Routes");

      app.getRouter()
        .registerRoutes();

      await app.getEventsRegistry()
        .trigger(Application.EVENT_EXPRESS_API_ROUTES_REGISTERED_POST, app);

      app.log("REGISTER: Error handler");

      this.registerErrorHandler();

      await this.startExpress();

    } catch (error) {
      app.logError(error.stack || error);
    }

    app.getEventsRegistry()
      .trigger(Application.EVENT_APPLICATION_RUN_POST, app);
  }

  /**
   * Actually starts the express Application
   */
  async startExpress () {
    const app = this.getApplication();
    await app.getEventsRegistry()
      .trigger(Application.EVENT_EXPRESS_START_PRE, app);

    if (this.getApplication().getExpress().get("env") === "test") {
      this.getApplication().log("Test environment detected. Exiting.");
      return;
    }

    const port = app.getExpressPort();

    app.getExpress()
      .listen(port, async () => {
        app.log(`API started on port ${port}`);
        return await app.getEventsRegistry()
          .trigger(
            Application.EVENT_EXPRESS_START_POST,
            app.getExpress()
          );
      });
  }

  registerErrorHandler () {
    /**
     * Error handling
     */
    const config = this.getApplication().getConfiguration();
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

        if (code === 500) {
          newrelic.noticeError(`HTTP 500 errors: ${JSON.stringify(response.errors)}`,{ err: err.message});
        }

        return res.status(code).json(response);
      });

    /**
     * 404 middleware since no middleware responded
     */
    const notFoundHandler = (req, res) => {
      this.getApplication()
        .log(`Route "${req.url}" not found.`);
      res.status(404).json({
        error: true,
        errors: [ "Route not found" ]
      });
    };

    this.getApplication()
      .getExpress()
      .use(notFoundHandler);
  }
}

export default ApplicationRun;
