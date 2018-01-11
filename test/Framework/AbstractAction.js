import test from "tape-promise/tape";
import BaseTest from "../BaseTest";
import AbstractAction from "../../src/Framework/AbstractAction";

class TestActionClass extends AbstractAction {
}

class AbstractActionTest extends BaseTest {
  async run() {
    test(`AbstractAction - parseQueryInput - SUCCESS`, async test => {
      const query = JSON.stringify({
        test: "test",
        testingField: "testing"
      });

      const absAction = new TestActionClass();

      const response = absAction.parseQueryInput([], query);

      test.deepEqual({
        test: "test",
        testingField: "testing"
      }, response);

      test.end();

    });

    test(`AbstractAction - parseQueryInput - simplified search - SUCCESS`, async test => {
      const query = "test";
      const searchableFields = [
        "fieldOne",
        "fieldTwo",
        "fieldThree",
        "testField",
        "testingSearchableField"
      ];

      const absAction = new TestActionClass();

      const response = absAction.parseQueryInput(searchableFields, query, true);

      test.deepEqual({
        fieldOne: "test",
        fieldTwo: "test",
        fieldThree: "test",
        testField: "test",
        testingSearchableField: "test"
      }, response);

      test.end();

    });

    test(`AbstractAction - parseQueryInput -  invalid JSON - FAIL`, async test => {
      const query = "test";

      const absAction = new TestActionClass();

      try {
        absAction.parseQueryInput([], query);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, "Query must be valid JSON.")
      }

      test.end();

    });

    test(`AbstractAction - parseQueryInput - search with array - SUCCESS`, async test => {
      const query = ["test"];
      const searchableFields = [
        "fieldOne",
        "fieldTwo"
      ];

      const absAction = new TestActionClass();

      const response = absAction.parseQueryInput(searchableFields, query, true);

      test.deepEqual({
          fieldOne: ["test"],
          fieldTwo: ["test"]
        },
        response);

      test.end();

    });

    test(`AbstractAction - parseQueryInput - search with null value - SUCCESS`, async test => {
      const query = null;
      const searchableFields = [
        "fieldOne",
        "fieldTwo"
      ];

      const absAction = new TestActionClass();

      const response = absAction.parseQueryInput(searchableFields, query, true);

      test.deepEqual({
          fieldOne: null,
          fieldTwo: null
        },
        response);

      test.end();

    });

    test(`AbstractAction - buildSimplifiedSearchObject - SUCCESS`, async test => {
      const query = "test";
      const searchableFields = [
        "fieldOne",
        "fieldTwo"
      ];

      const absAction = new TestActionClass();

      const response = absAction.buildSimplifiedSearchObject(searchableFields, query);

      test.deepEqual({
          fieldOne: "test",
          fieldTwo: "test"
        },
        response);

      test.end();

    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line*/
  }
}

export default AbstractActionTest;
