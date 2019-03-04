/**
 * Wrapper for Express request
 */
class Request {
  async buildRequest(expressRequest) {
    this.expressRequest = expressRequest;

    this.setExpressReq(this.expressRequest);
    this.setMethod(this.expressRequest.method);
    this.setCookies(this.expressRequest.cookies);
    this.setClientIp(this.expressRequest.ip);
    this.setUrl(this.expressRequest.url);
    this.setParams(this.expressRequest.params);
    this.setFiles(this.expressRequest.files);
    this.setQuery(this.expressRequest.query);
    this.setBody(this.expressRequest.body);
    this.setHeaders(this.expressRequest.headers);
    this.setXhr(this.expressRequest.xhr);
    this.setUser(this.expressRequest.user);

    return this;
  }

  /**
   * Set Boolean property for XHR
   * @param xhr
   * @returns {Request}
   */
  setXhr(xhr) {
    this.xhr = xhr;
    return this;
  }

  /**
   * A Boolean property that is true if the request’s X-Requested-With header field is
   * “XMLHttpRequest”, indicating that the request was issued by a client library such as jQuery.
   * @returns Boolean
   */
  getXhr() {
    return this.xhr;
  }

  /**
   * This property is an object containing properties mapped to the named route “parameters”.
   * For example, if you have the route /user/:name, then the “name” property is available as req.params.name.
   * This object defaults to {}.
   * @param reqParams
   * @returns {Request}
   */
  setParams(reqParams) {
    this.params = reqParams;
    return this;
  }

  /**
   * Get route parameters
   * @returns {*}
   */
  getParams() {
    return this.params;
  }

  /**
   * Set request url
   * @param url
   * @returns {Request}
   */
  setUrl(url) {
    this.url = url;
    return this;
  }

  /**
   * Returns request url
   * @returns {*}
   */
  getUrl() {
    return this.url;
  }

  /**
   * Set client IP address for request
   * @param ip
   * @returns {Request}
   */
  setClientIp(ip) {
    this.clientIp = ip;
    return this;
  }

  /**
   * Contains the remote IP address of the request.
   * @returns {*}
   */
  getClientIp() {
    return this.clientIp;
  }

  /**
   * Set request cookies
   * @param cookies
   * @returns {Request}
   */
  setCookies(cookies) {
    this.cookies = cookies;
    return this;
  }

  /**
   * When using cookie-parser middleware, this property is an object that contains cookies
   * sent by the request. If the request contains no cookies, it defaults to {}.
   * @returns {*|string}
   */
  getCookies() {
    return this.cookies;
  }

  /**
   * Set query parameters
   * @param queryParams
   * @returns {Request}
   */
  setQuery(queryParams) {
    this.query = queryParams;
    return this;
  }

  /**
   * This property is an object containing a property for each query string parameter in the route.
   * If there is no query string, it is the empty object, {}.
   * @returns {*}
   */
  getQuery() {
    return this.query;
  }

  /**
   * Set post parameters
   * @param postParams
   * @returns {Request}
   */
  setBody(postParams) {
    this.body = postParams;
    return this;
  }

  /**
   * Contains key-value pairs of data submitted in the express request body.
   * By default, it is undefined, and is populated when you use body-parsing middleware such
   * as body-parser and multer.
   * @returns {*}
   */
  getBody() {
    return this.body;
  }

  /**
   * Set request files
   * @param files
   * @returns {Request}
   */
  setFiles(files) {
    this.files = files;
    return this;
  }

  /**
   * Get request files
   * @returns {*}
   */
  getFiles() {
    return this.files;
  }

  /**
   * Set request method
   * @param method
   * @returns {Request}
   */
  setMethod(method) {
    this.requestMethod = method.toUpperCase();
    return this;
  }

  /**
   * Contains a string corresponding to the HTTP method of the request: GET, POST, PUT, and so on.
   * @returns {*}
   */
  getMethod() {
    return this.requestMethod;
  }

  /**
   * Set request headers
   * @param headers
   * @returns {Request}
   */
  setHeaders(headers) {
    this.headers = headers;
    return this;
  }

  /**
   * Returns object that maps all request headers
   * @returns {*}
   */
  getHeaders() {
    return this.headers;
  }

  /**
   * Set authenticated user
   * @returns {Request}
   */
  setUser(user) {
    this.user = user;
    return this;
  }

  /**
   * Get authenticated user
   * @returns {*}
   */
  getUser() {
    return this.user;
  }

  /**
   * Set express request instance
   * @param expReq
   * @returns {Request}
   */
  setExpressReq(expReq) {
    this.expressReq = expReq;
    return this;
  }

  /**
   * Get express request instance
   * @returns {*}
   */
  getExpressReq() {
    return this.expressReq;
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

export default Request;
