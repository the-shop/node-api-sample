class NotFoundError {
  constructor (message, code = 404) {
    this.message = message;
    this.code = code;
  }
}

export default NotFoundError;
