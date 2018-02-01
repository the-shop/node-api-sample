import fs from "fs";
import { join } from "path";
import AbstractListener from "../AbstractListener";

/**
 * Application is written using events, this class is in charge of listening / triggering events
 */
class EventsRegistry {
  /**
   * Does setup for the class
   */
  constructor () {
    /***
     * Map in format of: {eventName => [Listener, Listener,...],...}
     * @type {{}}
     */
    this.registeredListeners = {};

    /**
     * @type {Application|null}
     */
    this.applicationInstance = null;

    /**
     * Write stream for the documentation if in dev environment
     *
     * @type {{}|null}
     */
    this.documentationWriteStream = null;

    /**
     * Holds list of all triggered events in chronological order
     * @type {Array}
     */
    this.triggeredEvents = [];
  }

  /**
   * Used to define what `eventHandler` is going to be triggered by triggering of `eventName`
   *
   * @param eventName
   * @param eventHandler
   * @returns {EventsRegistry}
   */
  listen (eventName, eventHandler) {
    this.getApplication()
      .log(
        "Listening for event %s (handler: %s)",
        eventName,
        eventHandler.constructor.name
      );

    if (!this.registeredListeners[eventName]) {
      this.registeredListeners[eventName] = [];
    }

    this.registeredListeners[eventName].push(eventHandler);

    return this;
  }

  /**
   * Triggers `eventName` event with `payload` that is going to be passed as Listener.handle(payload)
   *
   * @param eventName
   * @param payload
   * @param request
   * @param response
   * @returns {Promise<Array>}
   */
  async trigger (eventName, payload = {}, request, response) {
    this.getApplication().log("Triggering event %s", eventName);

    let responses = [];

    if (this.registeredListeners[eventName]) {
      let syncPromises = [];
      let asyncPromises = [];
      try {
        this.registeredListeners[eventName].map(async listener => {
          if (listener instanceof AbstractListener === false) {
            this.getApplication().logError("Listener must be instance of AbstractListener");
            return false;
          }

          listener.setApplication(this.getApplication());

          this.triggeredEvents.push({
            eventName,
            listener: listener.constructor.name,
            timestampMs: (new Date()).getTime()
          });

          if (listener.isAsync() === true) {
            asyncPromises.push(listener.handle(payload, request, response));
          } else {
            syncPromises.push(listener.handle(payload, request, response));
          }
        });

        syncPromises = await Promise.all(syncPromises);
        responses = syncPromises.concat(asyncPromises);

      } catch (listenerError) {
        throw listenerError;
      }
    }

    return responses;
  }

  /**
   * Reads listeners from `src/Listeners/` and from every `src/Services/` service directory and
   * auto-registers them, called once on application startup
   */
  async register() {
    this.getApplication().log("REGISTER: Listeners");

    const { rootDir, listenerPaths } = this.getApplication().getConfiguration();

    // Register listeners from listeners static folder defined in configuration
    const staticListenersDirectory = join(rootDir, listenerPaths.staticPath);
    this.registerListenersFromDirectory(staticListenersDirectory);

    // Register listeners for services
    const servicesDir = join(rootDir, listenerPaths.servicesPath);
    fs.readdirSync(servicesDir)
    // Filter out .js files in Services directory
      .filter(one => one.match(/^(.(?!\.js$))+$/))
      .forEach(dirName => {
        const serviceListenersDirectoryPath = join(servicesDir, dirName, "Listeners");
        // Check if "Listeners" directory exists
        if (fs.existsSync(serviceListenersDirectoryPath)) {
          this.registerListenersFromDirectory(serviceListenersDirectoryPath);
        }
      });

    await this.generateDocumentation();
  }

  registerListenersFromDirectory (directoryPath) {
    fs.readdirSync(directoryPath)
    // Filter out non-js files from the directory (git related, documentation,...)
      .filter(one => !one.match(/^(.(?!\.js$))+$/))
      .forEach(file => {
        const className = require(join(directoryPath, file)).default;
        const listenerInstance = new className();
        const eventsList = listenerInstance.constructor.LISTEN_ON;
        listenerInstance.setApplication(this.getApplication());
        eventsList.map(eventName => this.listen(eventName, listenerInstance));
      });
  }

  /**
   * Listener entry point
   */
  async generateDocumentation () {
    const configuration = this.getApplication().getConfiguration();
    this.getApplication().log(" - documentation for the listeners is generating...");
    if (configuration.env === "production") {
      this.getApplication().log(` - detected "${configuration.env}" NODE_ENV, skipping docs generation...`);
      return false;
    }

    const allEvents = await this.getAllEventsForDocumentation();

    const registeredListeners = this.getAllRegistered();

    const introLines = [
      "# Events",
      "",
      "This file contains of 2 lists - one of all registered events and the other that also maps to",
      "registered listeners.",
    ];

    this.documentationWriteStream = fs.createWriteStream("docs/EVENTS.md");
    this.documentationWriteStream.once("open", () => {
      introLines.map(lineContent => this.writeDocumentationLine(lineContent));

      try {
        const allEventNames = Object.keys(allEvents);
        const registeredEventNames = Object.keys(registeredListeners);

        this.writeDocumentationLine("");
        this.writeDocumentationLine("## Registered listeners");
        this.writeDocumentationLine("");
        registeredEventNames.map(eventName => {
          this.writeDocumentationLine(` - ${eventName}`);
          registeredListeners[eventName].map(
            listener => this.writeDocumentationLine(`   - ${listener.constructor.name}`)
          );
        });

        this.writeDocumentationLine("");
        this.writeDocumentationLine("## All events");
        this.writeDocumentationLine("");
        allEventNames.map(eventName => this.writeDocumentationLine(` - ${eventName}`));
      } catch (error) {
        this.getApplication().logError(error.stack || error);
      }

      this.writeDocumentationLine("");

      this.documentationWriteStream.end();

      this.getApplication().log(" - documentation for the listeners generated...");
    });
  }

  /**
   * Writes single line into stream
   * @param line
   */
  writeDocumentationLine (line) {
    this.documentationWriteStream.write(`${line}\n`);
  }

  /**
   * Returns list of all events found in codebase
   * @returns {Promise<*>}
   */
  async getAllEventsForDocumentation() {
    const configuration = this.getApplication().getConfiguration();
    if (configuration.env === "production") {
      this.getApplication().log(` - detected "${configuration.env}" NODE_ENV, skipping events search...`);
      return {};
    }

    this.getApplication().log(" - searching for events in the codebase...");

    // Use map to avoid duplicates
    const results = {};

    return new Promise(resolve => {
      // Require here since it's just for dev environment
      let search = require("findit2")(join(__dirname, "../../")); // eslint-disable-line

      search.on("file", (file) => {
        const fileContent = fs.readFileSync(file, "utf8");
        if (fileContent) {
          const res = fileContent.match(/(EVENT_[_A-Z]+)/gmi);
          if (Array.isArray(res)) {
            // Append event to map of results
            res.map((eventName) =>results[eventName] = true);
          }
        }
      });

      search.on("end", () => {
        const sortedObject = {};
        Object.keys(results)
          .sort()
          .map(eventName => sortedObject[eventName] = true);
        resolve(sortedObject);
      });
    });
  }

  /**
   * Returns list of triggered events in time of method call
   * @returns {Array}
   */
  getAllTriggered () {
    return this.triggeredEvents;
  }

  /**
   * Returns list of registered listeners in time of method call
   * @returns {Array}
   */
  getAllRegistered () {
    return this.registeredListeners;
  }

  /**
   * Sets application onto class instance, later used to inject application where needed
   *
   * @param applicationInstance
   * @returns {this}
   */
  setApplication (applicationInstance) {
    this.applicationInstance = applicationInstance;
  }

  /**
   * Getter for application instance
   * @returns {null|Application}
   */
  getApplication () {
    return this.applicationInstance;
  }
}

export default EventsRegistry;
