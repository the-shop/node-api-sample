/**
 * Holds authorization information used by ACL to determine permission
 */
class Authorization {
    /**
     * @param type
     * @param id
     * @param userId
     */
  constructor(type = "user", id = "$everyone", userId = null) {
    this.authType = type;
    this.id = id;
    this.userId = userId;
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
     * If current user exists, should be set here
     *
     * @param userId
     * @returns {Authorization}
     */
  setUserId(userId) {
    this.userId = userId;
    return this;
  }

    /**
     * @returns {null|string}
     */
  getUserId() {
    return this.userId;
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
