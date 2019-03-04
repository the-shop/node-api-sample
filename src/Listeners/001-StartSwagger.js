import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import AbstractListener from "../Framework/AbstractListener";
import Application from "../Application";
import config from "../config";

const swaggerHost = config.swagger.host;

const swaggerDefinition = {
  info: { // API information
    title: "Node API Sample",
    version: "0.1.0",
    description: "node-api-sample by The Shop",
  },
  host: swaggerHost,
  basePath: "/api/v1",
};

// Options for the swagger docs
const swaggerJSDocOptions = {
  swaggerDefinition: swaggerDefinition,
  apis: [
    "./src/Services/*/Actions/*.js",
    "./src/Services/*/Adapters/*.js",
    "./src/Framework/*/*.js"
  ],
};

/**
 * Parses the inline swagger documentation and serves that under /api-docs route
 */
class StartSwagger extends AbstractListener {
  /**
   * Array of event string identifiers
   *
   * @type {Array}
   */
  static LISTEN_ON = [
    Application.EVENT_EXPRESS_API_ROUTES_REGISTERED_POST
  ];

  /**
   * Listener entry point
   */
  handle() {
    const app = this.getApplication();
    try {
      app.log(`Starting Swagger at "${config.swagger.docsUri}" route`);
      const express = app.getExpress();

      // Initialize swagger-jsdoc -> returns validated swagger spec in json format
      const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

      // Serve swagger docs the way you like (Recommendation: swagger-tools)
      express.get("/api-docs.json", function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
      });

      express.use(
        `${config.swagger.docsUri}`,
        swaggerUi.serve,
        swaggerUi.setup(
          null, // Swagger document, skip and use route to fetch it
          false, // Show explorer
          null, // Options
          null, // Custom CSS
          null, // Custom favicon
          `${swaggerHost}/api-docs.json`,
          "Node API Sample" // Custom title
        ));
    } catch (error) {
      app.logError(error.stack || error);
    }
  }
}

export default StartSwagger;