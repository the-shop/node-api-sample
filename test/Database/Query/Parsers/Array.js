import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import ArrayParser from "../../../../src/Database/Query/Parsers/Array";

class Array extends BaseTest {
  async run() {
    test("ARRAY - parse - SUCCESS", async test => {
      const arrayParser = new ArrayParser();
      const modelSchema = {
        instance: "Array"
      };

      const response = arrayParser.parse("test", ["testing"], modelSchema);

      test.deepEqual(response,
        {
          test: {$in: ["testing"]}
        });
      test.end();
    });

    test("ARRAY - parse - FAIL", async test => {
      const arrayParser = new ArrayParser();
      const modelSchema = {
        instance: "Array"
      };

      try {
        arrayParser.parse("test", "test", modelSchema);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "array type field" - 'test'.`);
      }

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Array;
