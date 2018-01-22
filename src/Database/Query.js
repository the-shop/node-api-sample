import mongoose from "mongoose";
import InputMalformedError from "../Framework/Errors/InputMalformedError";
import Validator from "./Query/Validator";

class Query {
  constructor(query, search, modelName) {
    this.builtQueryObject = {};
    this.modelName = modelName;
    this.validator = new Validator();
    this.setQuery(query);
    this.setSearch(search);
    this.setModelDefinition(mongoose.model(modelName));
  }

  buildQueryObject() {
    const query = this.getQuery();
    const search = this.getSearch();

    this.build(query);
    this.build(search, true);

    return this.builtQueryObject;
  }

  build(queryObject, search = false) {
    Object.keys(queryObject).map(attributeName => {
      if (this.checkIfKeyExists(attributeName)) {
        const parsedAttribute = this.parseAttribute(attributeName, queryObject[attributeName], search);
        if (search) {
          if (this.builtQueryObject["or"] === undefined) {
            this.builtQueryObject["or"] = [];
          }

          this.builtQueryObject["or"].push(parsedAttribute);
        } else {
          Object.assign(this.builtQueryObject, parsedAttribute);
        }
      } else {
        throw new InputMalformedError(`Bad query. Field '${attributeName}' does not exist on ${this.modelName} model.`);
      }
    });
  }

  checkIfKeyExists(attributeName) {
    const modelDefinition = this.getModelDefinition();
    const schemaAttributes = Object.keys(modelDefinition.schema.paths);

    return schemaAttributes.indexOf(attributeName) > -1;
  }

  parseAttribute(attributeName, attributeValue, search) {
    const attributeDefinedSchema = this.getModelDefinition().schema.paths[attributeName];
    if (search && typeof attributeValue === "object") {
      throw new InputMalformedError(`Bad query for search. Field '${attributeName}' invalid type.`);
    }

    let parsedAttribute = {};
    try {
      parsedAttribute = this.validator.validateAndBuild(attributeName, attributeValue, attributeDefinedSchema);
    } catch (error) {
      throw new InputMalformedError(error.message);
    }

    // Build regex if search flag is true
    if (search) {
      parsedAttribute = {
        [attributeName]: new RegExp(parsedAttribute[attributeName], "i")
      };
    }

    return parsedAttribute;
  }

  setQuery(query) {
    this.query = query;
    return this;
  }

  getQuery() {
    return this.query;
  }

  setSearch(search) {
    this.search = search;
    return this;
  }

  getSearch() {
    return this.search;
  }

  setModelDefinition(modelDefinition) {
    this.modelDefinition = modelDefinition;
    return this;
  }

  getModelDefinition() {
    return this.modelDefinition;
  }
}

export default Query;
