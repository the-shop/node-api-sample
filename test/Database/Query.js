import test from 'tape-promise/tape'
import BaseTest from "../BaseTest";
import QueryBuilder from "../../src/Database/Query";
import moment from "moment";

class Query extends BaseTest {
  async run() {
    test("QUERY - validate build() - SUCCESS", async test => {
      const query = new QueryBuilder({}, {}, "User");
      query.setModelDefinition({
        schema: {
          paths: {
            "test": {
              instance: "String",
              enumValues: []
            }
          }
        }
      });

      query.build({ test: "testing" });

      test.deepEqual(query.builtQueryObject,
        {
          test: "testing"
        });

      test.end();
    });

    test("QUERY - validate build() - no model field - FAIL", async test => {
      const query = new QueryBuilder({}, {}, "User");
      query.setModelDefinition({
        schema: {
          paths: {
            "test": {
              instance: "String",
              enumValues: []
            }
          }
        }
      });

      try {
        query.build({ testNoField: "testing" });
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, "Bad query. Field 'testNoField' does not exist on User model.");
      }

      test.end();
    });

    test("QUERY - validate checkIfKeyExists() - SUCCESS", async test => {
      const query = new QueryBuilder({}, {}, "User");
      query.setModelDefinition({
        schema: {
          paths: {
            "test": {
              instance: "String",
              enumValues: []
            }
          }
        }
      });

      test.equal(false, query.checkIfKeyExists("testing"));

      test.end();
    });

    test("QUERY - validate parseAttribute() - SUCCESS", async test => {
      const query = new QueryBuilder({}, {}, "User");
      query.setModelDefinition({
        schema: {
          paths: {
            "test": {
              instance: "String",
              enumValues: []
            }
          }
        }
      });

      const response = query.parseAttribute("test", "testing", false);

      test.deepEqual({
          test: "testing"
        },
        response
      );

      test.end();
    });

    test("QUERY - validate parseAttribute() with search flag - SUCCESS", async test => {
      const query = new QueryBuilder({}, {}, "User");
      query.setModelDefinition({
        schema: {
          paths: {
            "test": {
              instance: "String",
              enumValues: []
            }
          }
        }
      });

      const response = query.parseAttribute("test", "testing", true);

      const compare = {
        test: new RegExp("testing", "i")
      };

      test.deepEqual(response, compare);

      test.end();
    });

    test("QUERY - validate parseAttribute() with search flag - FAIL", async test => {
      const query = new QueryBuilder({}, {}, "User");
      query.setModelDefinition({
        schema: {
          paths: {
            "test": {
              instance: "String",
              enumValues: []
            }
          }
        }
      });

      try {
        query.parseAttribute("test", { test: "testing object" }, true);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, "Bad query for search. Field 'test' invalid type.");
      }

      test.end();
    });

    test("QUERY - validate buildQueryObject() with query and search - SUCCESS", async test => {
      const momentDate = moment();
      const timeNow = momentDate.unix();
      const query = new QueryBuilder({
        array: ["testingArray"],
        boolean: "TRUE",
        date: timeNow,
        mixed: { test: "testing" },
        number: { ">=": 10, "<": 20 }
      }, {
        string: "testingWithEnum",
      }, "User");
      query.setModelDefinition({
        schema: {
          paths: {
            "string": {
              instance: "String",
              enumValues: ["test", "testing", "testingWithEnum"]
            },
            "number": {
              instance: "Number",
            },
            "array": {
              instance: "Array",
            },
            "boolean": {
              instance: "Boolean"
            },
            "date": {
              instance: "Date"
            },
            "mixed": {
              instance: "Mixed"
            }
          }
        }
      });

      query.buildQueryObject();

      test.deepEqual({
        array: { $in: ["testingArray"] },
        boolean: true,
        date: momentDate.milliseconds(0).toISOString(),
        mixed: { test: "testing" },
        number: { $gte: 10, $lt: 20 },
        "or": [ { string: new RegExp("testingWithEnum", "i") } ]
      }, query.builtQueryObject);
      test.end();
    });
  }
}

export default Query;
