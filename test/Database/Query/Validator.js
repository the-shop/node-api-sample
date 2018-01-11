import test from 'tape-promise/tape'
import BaseTest from "../../BaseTest";
import QueryValidator from "../../../src/Database/Query/Validator";

class Validator extends BaseTest {
  async run() {
    test("QUERY_VALIDATOR / STRING - validate and build - SUCCESS", async test => {
      const validator = new QueryValidator();
      const attributeSchema = {
        instance: "String",
        enumValues: []
      };

      const response = validator.validateAndBuild("test", "test", attributeSchema);

      test.deepEqual(response,
        {
          test: "test"
        });
      test.end();
    });

    test("QUERY_VALIDATOR / STRING - validate and build operators object - SUCCESS", async test => {
      const validator = new QueryValidator();
      const attributeSchema = {
        instance: "String",
        enumValues: []
      };

      const response = validator.validateAndBuild(
        "test",
        {
          ">": "a",
          "<": "test"
        }
        , attributeSchema);

      test.deepEqual(response,
        {
          test: {
            "$gt": "a",
            "$lt": "test"
          }
        });
      test.end();
    });

    test("QUERY_VALIDATOR / BOOLEAN - validate and build - SUCCESS", async test => {
      const validator = new QueryValidator();
      const attributeSchema = {
        instance: "Boolean",
        enumValues: []
      };

      const response = validator.validateAndBuild("test", "true", attributeSchema);

      test.deepEqual(response,
        {
          test: true
        });
      test.end();
    });

    test("QUERY_VALIDATOR / NUMBER - validate and build - SUCCESS", async test => {
      const validator = new QueryValidator();
      const attributeSchema = {
        instance: "Number",
        enumValues: []
      };

      const response = validator.validateAndBuild("test", 10, attributeSchema);

      test.deepEqual(response,
        {
          test: 10
        });
      test.end();
    });

    test("QUERY_VALIDATOR / NUMBER - validate and build operators object - SUCCESS", async test => {
      const validator = new QueryValidator();
      const attributeSchema = {
        instance: "Number",
        enumValues: []
      };

      const response = validator.validateAndBuild(
        "test",
        {
          ">=": 10,
          "<=": 200
        }
        , attributeSchema);

      test.deepEqual(response,
        {
          test: {
            "$gte": 10,
            "$lte": 200
          }
        });
      test.end();
    });

    test("QUERY_VALIDATOR / ARRAY - validate and build - SUCCESS", async test => {
      const validator = new QueryValidator();
      const attributeSchema = {
        instance: "Array",
        enumValues: []
      };

      const response = validator.validateAndBuild("test", [], attributeSchema);

      test.deepEqual(response,
        {
          test: { $in: [] }
        });
      test.end();
    });

    test("QUERY_VALIDATOR / MIXED - validate and build - SUCCESS", async test => {
      const validator = new QueryValidator();
      const attributeSchema = {
        instance: "Mixed",
        enumValues: []
      };

      const response = validator.validateAndBuild("test", {test: "test"}, attributeSchema);

      test.deepEqual(response,
        {
          test: {
            test: "test"
          }
        });
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Validator;
