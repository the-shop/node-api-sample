import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import ModelErrorException from "../../../src/Framework/Errors/ModelError";

class ModelError extends BaseTest {
  async run() {
    test("THROW ModelError - success", test => {
      const testFunction = (input = true) => {
        if (!input) {
          throw new ModelErrorException("test");
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

export default ModelError;
