import fs from "fs";
import path from "path";
import AbstractListener from "../Framework/AbstractListener";
import Application from "../Application";
import config from "../config";

/**
 * Starts the administration
 */
class StartAdmin extends AbstractListener {
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
  handle () {
    const app = this.getApplication();
    try {
      app.log(`Starting Admin at "${config.admin.uri}" route`);

      const file = fs.readFileSync(path.join(__dirname, "../../admin/index.html"));

      // Serve index.html that will start up React application
      app.getExpress()
        .get(
          `${config.admin.uri}*`,
          (req, res) => {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(file);
          }
        );
    } catch (error) {
      app.logError(error.stack || error);
    }
  }
}

export default StartAdmin;
