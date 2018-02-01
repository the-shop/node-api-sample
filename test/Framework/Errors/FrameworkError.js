import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import FrameworkErrorException from "../../../src/Framework/Errors/FrameworkError";

class FrameworkError extends BaseTest {
  async run() {
    test("THROW FrameworkError - success", test => {
      const testFunction = (input = true) => {
        if (!input) {
          throw new FrameworkErrorException("test");
        }
        return input;
      };
      try {
        testFunction(false);
      } catch (error) {
        test.equal(error.code, 500);
        test.equal(error.message, "test");
      }
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default FrameworkError;
