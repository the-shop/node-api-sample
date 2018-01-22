import debug from "debug";
import superagent from "superagent";
import EventsRegistry from "./Framework/Application/EventsRegistry";
import FrameworkError from "./Framework/Errors/FrameworkError";
import Router from "./Framework/Application/Router";
import ServicesRegistry from "./ServicesRegistry";
import ModelsRegistry from "./ModelsRegistry";
import AdaptersRegistry from "./AdaptersRegistry";
import TemplatesRegistry from "./TemplatesRegistry";
import Acl from "./Framework/Acl/Acl";
import Authorization from "./Framework/Acl/Authorization";
import config from "./config";

const log = debug("node-api-sample:server:log:message");
const logError = debug("node-api-sample:server:log:error");

/**
 * Application class is a wrapper around express and is considered to be main entry point
 */
class Application {
  /**
   * Triggers before Application.run() call
   * @type {string}
   */
  static EVENT_APPLICATION_RUN_PRE = "EVENT_APPLICATION_RUN_PRE";

  /**
   * Triggers on Application.run() call
   * @type {string}
   */
  static EVENT_APPLICATION_RUN = "EVENT_APPLICATION_RUN";

  /**
   * Triggers after Application.run() call
   * @type {string}
   */
  static EVENT_APPLICATION_RUN_POST = "EVENT_APPLICATION_RUN_POST";

  /**
   * Triggers before Express.JS application is started
   * @type {string}
   */
  static EVENT_EXPRESS_START_PRE = "EVENT_EXPRESS_START_PRE";

  /**
   * Triggers after Express.JS application is started
   * @type {string}
   */
  static EVENT_EXPRESS_START_POST = "EVENT_EXPRESS_START_POST";

  /**
   * Triggers after Application bootstrap is done
   * @type {string}
   */
  static EVENT_APPLICATION_BOOTSTRAP_POST = "EVENT_APPLICATION_BOOTSTRAP_POST";

  /**
   * Setup everything needed for the app
   * @param configuration
   */
  constructor (configuration = {}) {
    this.appStartTimeMs = (new Date()).getTime();

    this.setHttpClient(configuration.httpClient || superagent);
    this.setExpressPort(configuration.expressPort || config.api.port);

    this.bootstrap();
  }

  /**
   * Triggers before the Application.run()
   */
  bootstrap () {
    this.log("Bootstrapping...");

    // Prepare ACL instances
    const authorization = new Authorization(
      "user",
      "unauthenticated"
    );
    this.acl = new Acl(authorization);
    this.acl.setApplication(this);
    this.acl.readRules();

    const eventsRegistry = new EventsRegistry();
    eventsRegistry.setApplication(this);
    eventsRegistry.register();

    const router = new Router();
    router.setApplication(this);

    const servicesRegistry = new ServicesRegistry();
    servicesRegistry.setApplication(this);

    const modelsRegistry = new ModelsRegistry();
    modelsRegistry.setApplication(this);

    const adaptersRegistry = new AdaptersRegistry();
    adaptersRegistry.setApplication(this);

    const templatesRegistry = new TemplatesRegistry();
    templatesRegistry.setApplication(this);

    this.setRouter(router);
    this.setServicesRegistry(servicesRegistry);
    this.setModelsRegistry(modelsRegistry);
    this.setAdaptersRegistry(adaptersRegistry);
    this.setEventsRegistry(eventsRegistry);
    this.setTemplatesRegistry(templatesRegistry);

    this.getModelsRegistry().register();
    this.getServicesRegistry().register();
    this.getAdaptersRegistry().register();
    this.getTemplatesRegistry().register();

    this.getEventsRegistry()
      .trigger(Application.EVENT_APPLICATION_BOOTSTRAP_POST, this);
  }

  /**
   * Main entry point for the Application
   */
  async run () {
    this.getEventsRegistry()
      .trigger(Application.EVENT_APPLICATION_RUN, this);
  }

  /**
   * Wrapper around superagent to make external HTTP requests (i.e. for cross call between services)
   *
   * @param requestMethod
   * @param url
   * @param query
   * @param data
   * @param headers
   * @param graceful
   * @returns {Promise<*>}
   */
  async externalHttpRequest(
    requestMethod = "get",
    url = null,
    { query = {}, data = {}, headers = {} } = {},
    graceful = false
  ) {
    const method = requestMethod.toLowerCase();
    const httpClient = this.getHttpClient();
    const request = httpClient[method](url);

    if (method === "get" && query) {
      request.query(query);
    } else {
      request.send(data);
    }

    request.set(headers);

    try {
      return await request;
    } catch (requestError) {
      this.logError("%s %s: HTTP request error: ", requestMethod, url, requestError.message);
      this.logError(
        "%s %s: Code: %s; Headers: %O, Body: %O: ",
        requestMethod,
        url,
        requestError.response.status,
        requestError.response.headers,
        requestError.response.body
      );
      if (graceful !== true) {
        throw new FrameworkError(requestError.response.body.errors[0]);
      }
    }
  }

  /**
   * Service registry setter
   */
  setServicesRegistry (registry) {
    this.servicesRegistry = registry;
    return this;
  }

  /**
   * Service registry getter
   */
  getServicesRegistry () {
    return this.servicesRegistry;
  }

  /**
   * Models registry setter
   */
  setModelsRegistry (registry) {
    this.modelsRegistry = registry;
    return this;
  }

  /**
   * Models registry getter
   */
  getModelsRegistry () {
    return this.modelsRegistry;
  }

  /**
   * Adapters registry setter
   */
  setAdaptersRegistry (registry) {
    this.adaptersRegistry = registry;
    return this;
  }

  /**
   * Adapters registry getter
   */
  getAdaptersRegistry () {
    return this.adaptersRegistry;
  }

  /**
   * Events registry setter
   */
  setEventsRegistry (registry) {
    this.eventsRegistry = registry;
    return this;
  }

  /**
   * Events registry getter
   */
  getEventsRegistry () {
    return this.eventsRegistry;
  }

  /**
   * Templates registry setter
   */
  setTemplatesRegistry (registry) {
    this.templatesRegistry = registry;
    return this;
  }

  /**
   * Templates registry getter
   */
  getTemplatesRegistry () {
    return this.templatesRegistry;
  }

  /**
   * Express app setter
   */
  setExpress (express) {
    this.express = express;
    return this;
  }

  /**
   * Express app getter
   */
  getExpress () {
    return this.express;
  }

  /**
   * Router setter
   */
  setRouter (router) {
    this.router = router;
    return this;
  }

  /**
   * Router getter
   */
  getRouter () {
    return this.router;
  }

  setExpressPort (port) {
    this.expressPort = port;
    return this;
  }

  getExpressPort () {
    return this.expressPort;
  }

  /**
   * Returns UNIX timestamp of time when Application.constructor() was called in milliseconds
   *
   * @returns Number
   */
  getAppStartTime() {
    return this.appStartTimeMs;
  }

  /**
   * @param database
   * @returns {Application}
   */
  setDatabase(database) {
    this.database = database;
    return this;
  }

  /**
   * @throws FrameworkError
   * @returns Database
   */
  getDatabase() {
    if (this.database === null) {
      throw new FrameworkError("Database not set yet.");
    }

    return this.database;
  }

  /**
   * Getter for the ACL instance
   */
  getAcl() {
    return this.acl;
  }

  /**
   * Setter for httpClient
   * @param client
   */
  setHttpClient(client) {
    this.httpClient = client;
  }

  /**
   * Getter for httpClient
   * @returns {*|httpClient|request}
   */
  getHttpClient() {
    return this.httpClient;
  }

  /**
   * Log helper
   */
  log () {
    log(...arguments);
  }

  /**
   * Log error helper
   */
  logError () {
    logError(...arguments);
  }
}

export default Application;
