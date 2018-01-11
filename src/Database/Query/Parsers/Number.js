import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

class NumberParser {
  parse(attributeName, attributeValue, attributeDefinedSchema) {
    if (typeof attributeValue === "number" && attributeDefinedSchema.instance.toLowerCase() === "number") {
      return {
        [attributeName]: attributeValue
      };
    }

    if (typeof attributeValue === "object") {
      return false;
    }

    throw new InputMalformedError(`Invalid type provided for "number type field" - '${attributeName}'.`);

  }
}

export default NumberParser;
