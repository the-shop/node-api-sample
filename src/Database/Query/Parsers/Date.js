import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import moment from "moment";

class DateParser {
  parse(attributeName, attributeValue, attributeDefinedSchema) {
    if (attributeDefinedSchema.instance.toLowerCase() === "date") {
      if (typeof attributeValue === "string" || typeof attributeValue === "number") {
        const isoStringFromTimestamp = this.getIsoStringFromTimestamp(attributeValue);
        const checkIfValidIsoString = moment(attributeValue, moment.ISO_8601).isValid();

        let parsedAtt = {};
        if (!isoStringFromTimestamp && checkIfValidIsoString) {
          parsedAtt = { [attributeName]: attributeValue };
        } else if (isoStringFromTimestamp && !checkIfValidIsoString) {
          parsedAtt = { [attributeName]: isoStringFromTimestamp};
        } else {
          throw new InputMalformedError(`Invalid type provided for "date type field" - '${attributeName}'.`);
        }

        return parsedAtt;
      }
    }

    if (typeof attributeValue === "object") {
      return false;
    }

    throw new InputMalformedError(`Invalid type provided for "date type field" - '${attributeName}'.`);
  }

  getIsoStringFromTimestamp(input) {
    if (input.toString().length === 10) {
      return moment.unix(parseInt(input)).toISOString();
    } else if (input.toString().length === 13) {
      const sliced = input.toString().slice(0, -3);
      return moment.unix(parseInt(sliced)).toISOString();
    } else {
      return false;
    }
  }
}

export default DateParser;
