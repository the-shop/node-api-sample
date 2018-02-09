/**
 * Wrapper for Express response
 */
class Response {
  async buildResponse(expressResponse) {
    this.code = 200;
    this.body = {};
    this.headers = {};
    this.type = null;
    this.setExpressRes(expressResponse);

    return this;
  }

  /**
   * Set response body
   * @param responseBody
   * @returns {Response}
   */
  setBody(responseBody) {
    this.body = responseBody;
    return this;
  }

  /**
   * Returns response body
   * @returns {*}
   */
  getBody() {
    return this.body;
  }

  /**
   * Set response Content-Type HTTP header
   * @param type
   */
  setType(type) {
    this.type = type;
  }

  /**
   * Return response Content-Type
   * @returns {*}
   */
  getType() {
    return this.type;
  }

  /**
   * Set response status code
   * @param code
   * @returns {Response}
   */
  setCode(code) {
    this.code = code;
    return this;
  }

  /**
   * Returns response status code
   * @returns {*}
   */
  getCode() {
    return this.code;
  }

  /**
   * Add header
   * @param headerName
   * @param headerValue
   * @returns {Response}
   */
  addHeader(headerName, headerValue) {
    this.headers[headerName] = headerValue;
    return this;
  }

  /**
   * Add headers
   * @param headersObject
   * @returns {Response}
   */
  addHeaders(headersObject) {
    this.headers = Object.assign(this.headers, headersObject);
    return this;
  }

  /**
   * Get all headers
   * @returns {*}
   */
  getHeaders() {
    return this.headers;
  }

  /**
   * Get header value
   * @param header
   * @returns {*}
   */
  getHeader(header) {
    return this.headers[header];
  }

  /**
   * Set express response instance
   * @param expRes
   * @returns {Response}
   */
  setExpressRes(expRes) {
    this.expressRes = expRes;
    return this;
  }

  /**
   * Get express response instance
   * @returns {*}
   */
  getExpressRes() {
    return this.expressRes;
  }

  /**
   * Use to quickly end the response without any data. If you need to respond with data, instead use
   * methods such as send() and json().
   */
  end() {
    this.getExpressRes()
      .end();
  }

  /**
   * Sends a JSON response. This method sends a response (with the correct content-type) that is
   * the parameter converted to a JSON string using JSON.stringify().
   * The parameter can be any JSON type, including object, array, string, Boolean, or number,
   * and you can also use it to convert other values to JSON, such as null, and undefined
   * (although these are technically not valid JSON).
   */
  json() {
    const expressRes = this.getExpressRes();
    const type = this.getType();
    if (type !== null) {
      expressRes.type(type);
    }

    expressRes.set(this.getHeaders())
      .status(this.getCode())
      .json(this.getBody());
  }

  /**
   * Sends the HTTP response.
   * The body parameter can be a Buffer object, a String, an object, or an Array.
   */
  send() {
    const expressRes = this.getExpressRes();
    const type = this.getType();
    if (type !== null) {
      expressRes.type(type);
    }

    expressRes.set(this.getHeaders())
      .status(this.getCode())
      .send(this.getBody());
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

export default Response;
