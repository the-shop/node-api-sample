import FrameworkError from "./Errors/FrameworkError";

/**
 * Provides class structure for the concrete Adapters
 */
class AbstractAdapter {
  /**
   * Ensure class behaves as abstract class
   */
  constructor () {
    this.name = this.constructor.name;
    if (this.name === "AbstractAdapter") {
      throw new FrameworkError("Can't instantiate AbstractAdapter");
    }

    this.applicationInstance = null;
  }

  adapt () {
    throw new FrameworkError(
      `Adapter ${this.name} ("server/Adapters/${this.name}") has to implement "adapt(response)" method`
    );
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

export default AbstractAdapter;
