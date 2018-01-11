import Rule from "./Rule";
import UnauthorizedError from "../Errors/UnauthorizedError";
import aclRules from "../../acl.json";

/**
 * Main ACL handling class
 */
class Acl {
  /**
   * @param authorization
   */
  constructor(authorization) {
    this.applicationInstance = null;
    this.authorization = authorization;
    this.rules = {};
  }

  /**
   * Check does the role have permission for the rule
   *
   * @param action
   * @param authType
   * @param authId
   * @returns {*}
   */
  check(action, authType, authId) {
    const auth = this.getAuthorization();
    let type = auth.getAuthType();
    let id = auth.getId();
    if (authType && authId) {
      type = authType;
      id = authId;
    }

    this.getApplication()
      .log("Checking ACL for %s action (%s:%s)", action, type, id);

    const rules = this.getRulesForAction(action, type, id);

    let queryFilter = {};
    let allowedFields = [];

    const failedRule = rules.find(rule => {
      queryFilter = Object.assign(queryFilter, rule.getQueryFilter());
      allowedFields = allowedFields.concat(rule.getAllowedFields());
      // Unique list of fields
      allowedFields = [... new Set(allowedFields)];

      return rule.permission !== "allow";
    });

    if (failedRule && type === "role") {
      return this.check(action, "user", "authenticated");
    } else if (failedRule) {
      throw new UnauthorizedError(failedRule.getErrorMessage());
    }

    return {
      queryFilter,
      allowedFields,
    };
  }

  /**
   * Builds a list of Rule instances based of ACL configuration
   */
  readRules() {
    aclRules.map(one => {
      if (this.rules[one.type] === undefined) {
        this.rules[one.type] = {};
      }

      if (this.rules[one.type][one.id] === undefined) {
        this.rules[one.type][one.id] = {};
      }

      if (this.rules[one.type][one.id][one.action] === undefined) {
        this.rules[one.type][one.id][one.action] = [];
      }

      this.rules[one.type][one.id][one.action].push(new Rule(
        one.type,
        one.id,
        one.action,
        one.permission,
        one.queryFilter,
        one.allowedFields,
        one.errorMessage
      ));
    });
  }

  /**
   * Searches for rules on given action
   *
   * @param action
   * @param authType
   * @param authId
   * @returns {*}
   */
  getRulesForAction(action, authType, authId) {
    const denyRule = new Rule(
      "user",
      "everyone",
      "*",
      "allow" // TODO: fix this: default to allow for now
    );
    if (this.rules[authType] === undefined) {
      return [denyRule];
    }

    if (this.rules[authType][authId] === undefined) {
      return [denyRule];
    }

    if (this.rules[authType][authId][action] === undefined) {
      return [denyRule];
    }

    return this.rules[authType][authId][action];
  }

  /**
   * @returns Authorization
   */
  getAuthorization() {
    return this.authorization;
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

export default Acl;
