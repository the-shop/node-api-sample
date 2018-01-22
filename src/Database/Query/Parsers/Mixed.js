import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

class ObjectParser {
  constructor() {
    this.operators = {
      ">": "$gt",
      "<": "$lt",
      ">=": "$gte",
      "<=": "$lte",
      "=": "$eq",
      "or": "$in"
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

          // Support $or operator - array of values
          if (keyName === "or" && Array.isArray(attributeValue[keyName])) {
            attributeValue[keyName].map(arrayValue => {
              if (typeof arrayValue !== definedFieldType) {
                throw new InputMalformedError(
                  `Invalid type provided for field '${attributeName}', "query operator" - '${keyName}', "value" - '${arrayValue}'.`
                );
              }
            });
            parsedAtt[attributeName][this.operators[keyName]] = attributeValue[keyName];
            // All other operators
          } else if (keyName !== "or" && typeof attributeValue[keyName] === definedFieldType) {
            parsedAtt[attributeName][this.operators[keyName]] = attributeValue[keyName];
            // If all fail throw exception
          } else {
            throw new InputMalformedError(
              `Invalid type provided for field '${attributeName}', "query operator" - '${keyName}', "value" - '${attributeValue[keyName]}'.`
            );
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
