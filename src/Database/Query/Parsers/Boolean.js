import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

class BooleanParser {
  parse(attributeName, attributeValue, attributeDefinedSchema) {
    // If query parameter type is string and defined type is boolean try to cast value to
    // boolean or throw exception otherwise
    let parsedAtt = {};
    if (typeof attributeValue === "boolean" && attributeDefinedSchema.instance.toLowerCase() === "boolean") {
      parsedAtt = {
        [attributeName]: attributeValue
      };
    } else if (typeof attributeValue === "string" && attributeValue.toLowerCase() === "false") {
      parsedAtt = {
        [attributeName]: false
      };
    } else if (typeof attributeValue === "string" && attributeValue.toLowerCase() === "true") {
      parsedAtt = {
        [attributeName]: true
      };
    } else {
      throw new InputMalformedError(`Invalid type provided for "boolean type field" - '${attributeName}'.`);
    }

    return parsedAtt;
  }
}

export default BooleanParser;
