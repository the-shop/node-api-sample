class ModelError extends Error {
  constructor (message, code = 500) {
    super(message, code);

    this.message = message;
    this.code = code;
  }
}

export default ModelError;
