import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import BooleanParser from "../../../../src/Database/Query/Parsers/Boolean";

class Boolean extends BaseTest {
  async run() {
    test("BOOLEAN - parse - SUCCESS", async test => {
      const booleanParser = new BooleanParser();
      const modelSchema = {
        instance: "Boolean"
      };

      const response = booleanParser.parse("test", true, modelSchema);

      test.deepEqual(response,
        {
          test: true
        });
      test.end();
    });

    test("BOOLEAN - parse string 'true' - SUCCESS", async test => {
      const booleanParser = new BooleanParser();
      const modelSchema = {
        instance: "Boolean"
      };

      const response = booleanParser.parse("test", "TruE", modelSchema);

      test.deepEqual(response,
        {
          test: true
        });
      test.end();
    });

    test("BOOLEAN - parse string 'false' - SUCCESS", async test => {
      const booleanParser = new BooleanParser();
      const modelSchema = {
        instance: "Boolean"
      };

      const response = booleanParser.parse("test", "FALSe", modelSchema);

      test.deepEqual(response,
        {
          test: false
        });
      test.end();
    });

    test("BOOLEAN - parse - FAIL", async test => {
      const booleanParser = new BooleanParser();
      const modelSchema = {
        instance: "Boolean"
      };

      try {
        booleanParser.parse("test", "test", modelSchema);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "boolean type field" - 'test'.`);
      }

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Boolean;
