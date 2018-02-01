import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import InputMalformedErrorException from "../../../src/Framework/Errors/InputMalformedError";

class InputMalformedError extends BaseTest {
  async run() {
    test("THROW InputMalformedError - success", test => {
      const testFunction = (input = true) => {
        if (!input) {
          throw new InputMalformedErrorException("test");
        }
        return input;
      };
      try {
        testFunction(false);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, "test");
      }
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default InputMalformedError;
