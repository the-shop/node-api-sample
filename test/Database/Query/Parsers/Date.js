import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import DateParser from "../../../../src/Database/Query/Parsers/Date";
import moment from "moment";

class Date extends BaseTest {
  async run() {
    test("DATE - parse valid ISO string - SUCCESS", async test => {
      const dateParser = new DateParser();
      const modelSchema = {
        instance: "Date",
        enumValues: []
      };

      const isoString = moment().toISOString();

      const response = dateParser.parse("test", isoString, modelSchema);

      test.deepEqual(response,
        {
          test: isoString
        });
      test.end();
    });

    test("DATE - parse - invalid ISO string - FAIL ", async test => {
      const dateParser = new DateParser();
      const modelSchema = {
        instance: "Date"
      };

      try {
        dateParser.parse("test", "test", modelSchema);
      } catch (error) {
        test.equal(error.code, 400);
        test.equal(error.message, `Invalid type provided for "date type field" - 'test'.`);
      }

      test.end();
    });

    test("DATE - parse - timestamp - SUCCESS", async test => {
      const dateParser = new DateParser();
      const modelSchema = {
        instance: "Date"
      };

      const momentDate = moment();
      const timeNow = momentDate.unix();

      const response = dateParser.parse("test", timeNow, modelSchema);

      test.deepEqual(
        response,
        {
          test: momentDate.milliseconds(0).toISOString()
        }
        );

      test.end();
    });

    test("DATE - parse - invalid type - object passed - FAIL ", async test => {
      const dateParser = new DateParser();
      const modelSchema = {
        instance: "Date"
      };

      const response = dateParser.parse("test", {test: "test"}, modelSchema);

      test.equal(response, false);
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Date;
