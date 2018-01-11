import InputMalformedError from "../../../Framework/Errors/InputMalformedError";
import mongoose from "mongoose";

class StringParser {
  parse(attributeName, attributeValue, attributeDefinedSchema) {
    if (typeof attributeValue === "string" &&
      attributeDefinedSchema.instance.toLowerCase() === "string" ||
      attributeDefinedSchema.instance.toLowerCase() === "objectid"
    ) {

      if (attributeDefinedSchema.instance.toLocaleLowerCase() === "objectid" && !mongoose.Types.ObjectId.isValid(attributeValue)) {
        throw new InputMalformedError(`Invalid field '${attributeName}', value ${attributeValue} not valid ObjectId string.'`);
      }

      return { [attributeName]: attributeValue };
    }

    if (typeof attributeValue === "object") {
      return false;
    }

    throw new InputMalformedError(`Invalid type provided for "string type field" - '${attributeName}'.`);
  }
}

export default StringParser;
