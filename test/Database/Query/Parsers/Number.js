import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import NumberParser from "../../../../src/Database/Query/Parsers/Number";

class Number extends BaseTest {
  async run() {
    test("NUMBER - parse - SUCCESS", async test => {
      const numberParser = new NumberParser();
      const modelSchema = {
        instance: "Number"
      };

      const response = numberParser.parse("test", 10, modelSchema);

      test.deepEqual(response,
        {
          test: 10
        });
      test.end();
    });

    test("NUMBER - parse - invalid type - object passed - FAIL ", async test => {
      const numberParser = new NumberParser();
      const modelSchema = {
        instance: "Number"
      };

      const response = numberParser.parse("test", {test: "test"}, modelSchema);

      test.equal(response, false);
      test.end();
    });

    test("NUMBER - parse - FAIL", async test => {
      const numberParser = new NumberParser();
      const modelSchema = {
        instance: "Number"
      };

      try {
        numberParser.parse("test", "test", modelSchema);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "number type field" - 'test'.`);
      }

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Number;
