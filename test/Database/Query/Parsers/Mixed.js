import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import MixedParser from "../../../../src/Database/Query/Parsers/Mixed";

class Mixed extends BaseTest {
  async run() {
    test("MIXED - parse - SUCCESS", async test => {
      const mixedParser = new MixedParser();
      const modelSchema = {
        instance: "Mixed"
      };

      const response = mixedParser.parse("test", {test: "test"}, modelSchema);

      test.deepEqual(response,
        {
          test: {
            test: "test"
          }
        });
      test.end();
    });

    test("MIXED - parse - operators object - string definition - SUCCESS", async test => {
      const mixedParser = new MixedParser();
      const modelSchema = {
        instance: "String"
      };

      const response = mixedParser.parse(
        "test",
        {
          ">": "a",
          "<=": "testing"
        },
        modelSchema
      );

      test.deepEqual(response, {
        "test": {
          "$gt": "a",
          "$lte": "testing"
        }
      });
      test.end();
    });

    test("MIXED - parse - operators object - number definition - SUCCESS", async test => {
      const mixedParser = new MixedParser();
      const modelSchema = {
        instance: "Number"
      };

      const response = mixedParser.parse(
        "test",
        {
          "<": 100,
          ">": 20
        },
        modelSchema
      );

      test.deepEqual(response, {
        "test": {
          "$lt": 100,
          "$gt": 20
        }
      });
      test.end();
    });

    test("MIXED - parse - not object -  FAIL", async test => {
      const mixedParser = new MixedParser();
      const modelSchema = {
        instance: "Object"
      };

      try {
        mixedParser.parse("test", 10, modelSchema);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "object type field" - 'test'.`);
      }

      test.end();
    });

    test("MIXED - parse - wrong operators value type for string -  FAIL", async test => {
      const mixedParser = new MixedParser();
      const modelSchema = {
        instance: "String"
      };

      try {
        mixedParser.parse(
          "test",
          {
            "<": 100,
            ">": 20
          },
          modelSchema
        );
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "query operator" '<' - 'test'.`);
      }

      test.end();
    });

    test("MIXED - parse - wrong operators value type for number -  FAIL", async test => {
      const mixedParser = new MixedParser();
      const modelSchema = {
        instance: "Number"
      };

      try {
        mixedParser.parse(
          "test",
          {
            "<": "TESTING",
            ">": "a"
          },
          modelSchema
        );
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "query operator" '<' - 'test'.`);
      }

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Mixed;
