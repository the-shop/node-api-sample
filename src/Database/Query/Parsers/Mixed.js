import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

class ObjectParser {
  constructor() {
    this.operators = {
      ">": "$gt",
      "<": "$lt",
      ">=": "$gte",
      "<=": "$lte",
      "=": "$eq"
    };
  }

  parse(attributeName, attributeValue, attributeDefinedSchema) {
    let parsedAtt = {
      [attributeName]: {}
    };
    if (typeof attributeValue === "object") {
      const operators = Object.keys(this.operators);
      let operatorsObject = false;
      Object.keys(attributeValue).map(keyName => {
        if (operators.includes(keyName)) {
          operatorsObject = true;
          const definedFieldType = attributeDefinedSchema.instance.toLowerCase();
          if (typeof attributeValue[keyName] === definedFieldType) {
            parsedAtt[attributeName][this.operators[keyName]] = attributeValue[keyName];
          } else {
            throw new InputMalformedError(`Invalid type provided for "query operator" '${keyName}' - '${attributeName}'.`);
          }
        }
      });

      if (!operatorsObject && attributeDefinedSchema.instance.toLowerCase() === "mixed") {
        parsedAtt = {
          [attributeName]: attributeValue
        };
      }
      // In case parser was called from StringParser > Validator > MixedParser
      if (!operatorsObject && attributeDefinedSchema.instance.toLowerCase() === "string") {
        throw new InputMalformedError(`Invalid type provided for "string type field" - '${attributeName}'.`);
      }
      // In case parser was called from NumberParser > Validator > MixedParser
      if (!operatorsObject && attributeDefinedSchema.instance.toLowerCase() === "number") {
        throw new InputMalformedError(`Invalid type provided for "number type field" - '${attributeName}'.`);
      }
    } else {
      throw new InputMalformedError(`Invalid type provided for "object type field" - '${attributeName}'.`);
    }

    return parsedAtt;
  }
}

export default ObjectParser;
