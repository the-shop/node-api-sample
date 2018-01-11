import FrameworkError from "./Errors/FrameworkError";

/**
 * Provides key => value registry
 */
class AbstractRegistry {
  /**
   * Ensure class behaves as abstract class
   */
  constructor () {
    this.name = this.constructor.name;
    if (this.name === "AbstractRegistry") {
      throw new FrameworkError("Can't instantiate AbstractService");
    }

    this.registry = {};
    this.applicationInstance = null;
  }

  register () {
    throw new FrameworkError(
      `${this.name} has to implement "register()" method`
    );
  }

  set (key, value, overwrite = false) {
    if (this.registry[key] !== undefined && overwrite === false) {
      throw new FrameworkError(`Key ${key} is already set in ${this.constructor.name}`);
    }
    this.registry[key] = value;
  }

  get (key, defaultValue = undefined) {
    if (!this.registry[key] && defaultValue === undefined) {
      throw new FrameworkError(`Key ${key} not registered in ${this.constructor.name}`);
    }
    return this.registry[key];
  }

  getAll () {
    return this.registry;
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

export default AbstractRegistry;
