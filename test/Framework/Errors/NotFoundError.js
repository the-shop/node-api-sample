import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import NotFoundErrorException from "../../../src/Framework/Errors/NotFoundError";

class NotFoundError extends BaseTest {
  async run() {
    test("THROW NotFoundError - success", test => {
      const testFunction = (input = true) => {
        if (!input) {
          throw new NotFoundErrorException("test");
        }
        return input;
      };
      try {
        testFunction(false);
      } catch (error) {
        test.equal(error.code, 404);
        test.equal(error.message, "test");
      }
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default NotFoundError;
