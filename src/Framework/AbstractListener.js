import FrameworkError from "./Errors/FrameworkError";

/**
 * Defines class structure for the concrete Listeners
 */
class AbstractListener {
  /**
   * List of events that will trigger handle() method call
   * @type {[string]}
   */
  static LISTEN_ON = [
    // Array of event string identifiers, i.e.:
    // EVENT_APPLICATION_RUN_PRE
    // EVENT_APPLICATION_RUN_POST
  ];

  /**
   * Ensure class behaves as abstract class
   */
  constructor () {
    this.name = this.constructor.name;
    this.sync = true;
    if (this.name === "AbstractListener") {
      throw new FrameworkError("Can't instantiate AbstractListener");
    }

    this.applicationInstance = null;
  }

  /**
   * When event triggers, this method will be called with payload as first argument if it's sent
   */
  handle () {
    throw new FrameworkError(
      `${this.name} has to implement "handle(payload)" method`
    );
  }

  /**
   * Set listener as asynchronous
   * @returns {AbstractListener}
   */
  setAsync() {
    this.sync = false;
    return this;
  }

  /**
   * Get listener status, true if listener is synchronous and false otherwise
   * @returns {boolean}
   */
  isAsync() {
    return this.sync === false;
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

export default AbstractListener;
