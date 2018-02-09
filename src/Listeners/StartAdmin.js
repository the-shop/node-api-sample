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
    Application.EVENT_APPLICATION_RUN_PRE
  ];

  /**
   * Listener entry point
   */
  handle () {
    try {
      this.getApplication()
        .log("Starting Admin");

      const file = fs.readFileSync(path.join(__dirname, "../../admin/index.html"));

      // Serve index.html that will start up React application
      this.getApplication()
        .getExpress()
        .get(`${config.admin.uri}`, function (req, res) {
          res.writeHead(200, {"Content-Type": "text/html"});
          res.end(file);
        });
    } catch (error) {
      this.getApplication().logError(error.stack || error);
    }
  }
}

export default StartAdmin;
