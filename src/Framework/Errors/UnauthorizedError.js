class UnauthorizedError {
  constructor (message, code = 401) {
    this.message = message;
    this.code = code;
  }
}

export default UnauthorizedError;
