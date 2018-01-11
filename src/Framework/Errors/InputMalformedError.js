class InputMalformedError {
  constructor (message, code = 400) {
    this.message = message;
    this.code = code;
  }
}

export default InputMalformedError;
