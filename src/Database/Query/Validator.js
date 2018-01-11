import { join } from "path";
import InputMalformedError from "../../Framework/Errors/InputMalformedError";

class Validator {
  validateAndBuild(attributeName, attributeValue, attributeDefinedSchema) {
    let schemaInstance = attributeDefinedSchema.instance;
    if (schemaInstance === "ObjectID") {
      schemaInstance = "String";
    }
    const classPath = join(__dirname, "./Parsers", schemaInstance);
    const parserClass = require(classPath).default;
    const instance = new parserClass();

    let response = {};
    try {
      response = instance.parse(attributeName, attributeValue, attributeDefinedSchema);
    } catch (error) {
      throw new InputMalformedError(error.message);
    }

    // In case some parsers return false because value is type of object so we need to check if
    // value is "operatorsObject"
    if (response === false) {
      const classMixedParserPath = join(__dirname, "./Parsers/Mixed");
      const mixedParserClass = require(classMixedParserPath).default;
      const mixedParserInstance = new mixedParserClass();

      return mixedParserInstance.parse(attributeName, attributeValue, attributeDefinedSchema);
    }

    return response;
  }
}

export default Validator;
