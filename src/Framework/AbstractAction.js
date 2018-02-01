import FrameworkError from "./Errors/FrameworkError";
import InputMalformedError from "./Errors/InputMalformedError";

/**
 * Provides class structure for the concrete Actions
 */
class AbstractAction {
  static IS_PUBLIC = false;

  /**
   * Ensure class behaves as abstract
   */
  constructor () {
    this.name = this.constructor.name;
    if (this.name === "AbstractAction") {
      throw new FrameworkError("Can't instantiate AbstractAction");
    }

    this.applicationInstance = null;
    this.aclInstance = null;
    this.request = null;
    this.response = null;
  }

  /**
   * Shortcut to triggering events from actions
   *
   * @param eventName
   * @param payload
   * @returns {Promise<*>}
   */
  async trigger(eventName, payload = {}) {
    try {
      return await this.getApplication()
        .getEventsRegistry()
        .trigger(eventName, payload, this.getRequest(), this.getResponse());
    } catch (error) {
      this.getApplication().logError("Issue with listener.", error.message);
      throw error;
    }
  }

  /**
   * Used to pre-format object that will be passed as first argument to AbstractAction.handle() method
   * @returns {{}}
   */
  async getActionInput () {
    return {};
  }

  /**
   * Exit if proper class doesn't implement this method and notify the developer
   */
  async handle () {
    throw new FrameworkError(
      `${this.name} has to implement "handle(payload, request)" method`
    );
  }

  /**
   * Sets application onto class instance, later used to inject application where needed
   *
   * @param applicationInstance
   * @returns {AbstractAction}
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

  getVerb () {
    return this.verb;
  }

  /**
   * @param searchableModelFields
   * @param value
   * @param search
   * @returns {string}
   */
  parseQueryInput(searchableModelFields, value, search = false) {
    let query = "{}";

    try {
      query = JSON.parse(value || query);
      if (search &&
        typeof query !== "object" ||
        Array.isArray(query) === true ||
        value === null
      ) {
        query = this.buildSimplifiedSearchObject(searchableModelFields, value);
      }
    } catch (error) {
      if (!search) {
        throw new InputMalformedError("Query must be valid JSON.");
      }
      query = this.buildSimplifiedSearchObject(searchableModelFields, value);
    }

    return query;
  }

  /**
   *
   * @param searchableModelFields
   * @param value
   * @returns {{}}
   */
  buildSimplifiedSearchObject(searchableModelFields, value) {
    let search = {};
    searchableModelFields.map(fieldName => {
      search[fieldName] = value;
    });

    return search;
  }

  /**
   * @param aclInstance
   * @returns {AbstractAction}
   */
  setAcl(aclInstance) {
    this.aclInstance = aclInstance;
    return this;
  }

  /**
   * @returns Acl|null
   */
  getAcl() {
    return this.aclInstance;
  }

  /**
   * Setter for request object
   *
   * @param request
   * @returns {AbstractAction}
   */
  setRequest(request) {
    this.request = request;
    return this;
  }

  /**
   * Getter for request object
   *
   * @returns {*}
   */
  getRequest() {
    return this.request;
  }

  /**
   * Setter for response object
   *
   * @param response
   * @returns {AbstractAction}
   */
  setResponse(response) {
    this.response = response;
    return this;
  }

  /**
   * Getter for response object
   *
   * @returns {*}
   */
  getResponse() {
    return this.response;
  }
}

export default AbstractAction;
