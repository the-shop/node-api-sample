import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import StringParser from "../../../../src/Database/Query/Parsers/String";

class String extends BaseTest {
  async run() {
    test("STRING - parse - SUCCESS", async test => {
      const stringParser = new StringParser();
      const modelSchema = {
        instance: "String",
        enumValues: []
      };

      const response = stringParser.parse("test", "test", modelSchema);

      test.deepEqual(response,
        {
          test: "test"
        });
      test.end();
    });

    test("STRING - parse - invalid type - object passed - FAIL ", async test => {
      const stringParser = new StringParser();
      const modelSchema = {
        instance: "String"
      };

      const response = stringParser.parse("test", {test: "test"}, modelSchema);

      test.equal(response, false);
      test.end();
    });

    test("STRING - parse - FAIL", async test => {
      const stringParser = new StringParser();
      const modelSchema = {
        instance: "String"
      };

      try {
        stringParser.parse("test", 10, modelSchema);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "string type field" - 'test'.`);
      }

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default String;
