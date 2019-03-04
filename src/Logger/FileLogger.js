import FrameworkError from "../Framework/Errors/FrameworkError";
import fs from "fs";
import { join } from "path";

/**
 * File logger class
 */
class FileLogger {
  constructor() {
    this.applicationInstance = null;
    this.filename = null;
    this.fileDirPath = null;
  }

  /**
   * Set filename
   * @param filename
   */
  setFilename(filename) {
    this.filename = filename;
  }

  /**
   * Set file directory path
   * @param fileDirPath
   */
  setFileDirPath(fileDirPath) {
    this.fileDirPath = fileDirPath;
  }

  /**
   * Get filename
   * @returns {null|*}
   */
  getFilename() {
    return this.filename;
  }

  /**
   * Get file directory path
   * @returns {null|*}
   */
  getFileDirPath() {
    return this.fileDirPath;
  }

  /**
   * Append log message to specific file
   * @param message
   * @returns {boolean}
   */
  logMessage(message) {
    const filename = this.getFilename();
    const fileDirPath = this.getFileDirPath();

    if (filename === null || fileDirPath === null) {
      throw new FrameworkError("Filename and directory path must be provided.");
    }
    const messageLog =`[${Math.floor(Date.now() / 1000)}] ${message} \n`;

    try {
      const stream = fs.createWriteStream(join(fileDirPath, filename), { flags: "a" });
      stream.write(messageLog);
      stream.end();
    } catch (error) {
      console.log(error.stack || error); // eslint-disable-line
    }

    return true;
  }

  /**
   * Sets application onto class instance, later used to inject application where needed
   *
   * @param applicationInstance
   * @returns {this}
   */
  setApplication (applicationInstance) {
    this.applicationInstance = applicationInstance;
    return this;
  }

  /**
   * Getter for application instance
   * @returns {null|Application}
   */
  getApplication () {
    return this.applicationInstance;
  }
}

export default FileLogger;
