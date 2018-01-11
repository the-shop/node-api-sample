import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

class ArrayParser {
  parse(attributeName, attributeValue, attributeDefinedSchema) {
    // If query parameter type is array, format query param with $in operator
    if (attributeValue instanceof Array && attributeDefinedSchema.instance.toLowerCase() === "array") {
      return {
        [attributeName]: {
          $in: attributeValue
        }
      };
    }

    throw new InputMalformedError(`Invalid type provided for "array type field" - '${attributeName}'.`);
  }
}

export default ArrayParser;
