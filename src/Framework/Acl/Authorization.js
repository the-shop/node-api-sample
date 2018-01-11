/**
 * Holds authorization information used by ACL to determine permission
 */
class Authorization {
  /**
   * @param type
   * @param id
   */
  constructor(type = "user", id = "everyone") {
    this.authType = type;
    this.id = id;
  }

  /**
   * @param authType
   * @returns {Authorization}
   */
  setAuthType(authType) {
    this.authType = authType;
    return this;
  }

  /**
   * @returns {string}
   */
  getAuthType() {
    return this.authType;
  }

  /**
   * @param id
   * @returns {Authorization}
   */
  setId(id) {
    this.id = id;
    return this;
  }

  /**
   * @returns {string}
   */
  getId() {
    return this.id;
  }
}

export default Authorization;
