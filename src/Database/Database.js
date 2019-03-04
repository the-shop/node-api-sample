import dotenv from "dotenv";
import debug from "debug";
import Bluebird from "bluebird";
import mongoose from "mongoose";
import FrameworkError from "../Framework/Errors/FrameworkError";
import config from "../config";

dotenv.config();

const logMessage = debug("node-api-sample:database:message");
const logError = debug("node-api-sample:database:error");

class Database {
  static DATABASE_CONNECTION_CONNECTED = "DATABASE_CONNECTION_CONNECTED";

  /**
   * @param options
   * @param {boolean} options.keepAlive - will attempt to re-connect on disconnect
   */
  constructor (options = {}) {
    this.options = options;
    this.reconnects = 0;
  }

  /**
   * Create a new connection and register listeners
   *
   * @returns {*}
   */
  connect () {
    const options = Object.assign({
      useNewUrlParser: true,
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 100, // Reconnect every 100ms
      poolSize: 10, // Maintain up to 10 socket connections
      bufferMaxEntries: 0
    }, this.options);

    logMessage("Connecting mongo at %s with options %O", config.db, options);
    mongoose.Promise = Bluebird;

    mongoose.connect(config.db, options)
      .catch(
        error => {
          logError("Initial connection error: %s", error.message);
        }
      );

    this.connection = mongoose.connection;

    const app = this.getApplication();

    if (app) {
      this.connection.on(
        "connected",
        () => app.getEventsRegistry().trigger(Database.DATABASE_CONNECTION_CONNECTED)
      );

      this.connection.on(
        "error",
        () => logError
      );
    }

    if (this.options.keepAlive) {
      this.connection.on("disconnected", this.connect.bind(this));
    }

    return this.connection;
  }

  /**
   * Return existing connection
   *
   * If doesn't exist, create a connection and return new one
   *
   * @returns {*}
   */
  getConnection () {
    if (!this.connection) {
      logMessage("No connection, attempting to create new one");
      this.connect();
    }
    return this.connection;
  }

  /**
   * Closes Mongo connection
   *
   * @returns {boolean}
   */
  disconnect () {
    if (!this.connection) {
      return true;
    }

    return this.connection.close();
  }

  /**
   * Drops current database
   * @returns {Promise<*>}
   */
  async drop() {
    if (!this.getConnection().db) {
      throw new FrameworkError("Database not connected yet.");
    }

    return await this.getConnection()
      .db
      .dropDatabase();
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

export default Database;
