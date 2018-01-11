class Strategies {
  static REGISTERED_STRATEGIES = [
    "PasswordStrategy",
  ];

  constructor(applicationInstance) {
    this.setApplication(applicationInstance);
  }

  /**
   * Runs through Strategies.REGISTERED_STRATEGIES and registers the strategies
   */
  register() {
    this.getApplication().log("AUTHORIZATION SERVICE STRATEGIES REGISTRATION");

    const registeredStrategies = Strategies.REGISTERED_STRATEGIES;

    if (registeredStrategies.length > 0) {
      registeredStrategies.map(strategy => this.registerStrategy(strategy));
    } else {
      this.getApplication().log(" - Strategies list is empty.");
    }
  }

  registerStrategy(strategyName) {
    const strategyClass = require(`./${strategyName}`).default;
    const strategy = new strategyClass();
    strategy.setApplication(this.getApplication());
    strategy.register();
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

export default Strategies;