import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import UnauthorizedErrorException from "../../../src/Framework/Errors/UnauthorizedError";

class UnauthorizedError extends BaseTest {
  async run() {
    test("THROW UnauthorizedError - success", test => {
      const testFunction = (input = true) => {
        if (!input) {
          throw new UnauthorizedErrorException("test");
        }
        return input;
      };
      try {
        testFunction(false);
      } catch (error) {
        test.equal(error.code, 401);
        test.equal(error.message, "test");
      }
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default UnauthorizedError;
