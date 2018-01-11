import mongoose from "mongoose";
import Collection from "../../../Framework/Collection";
import Query from "../../../Database/Query";

class UserCollection extends Collection {
  /**
   * @throws FrameworkError
   * @param parsedQuery
   * @param parsedSearch
   * @param modelName
   */
  static validateQuery(parsedQuery, parsedSearch, modelName) {
    const QueryBuilder = new Query(parsedQuery, parsedSearch, modelName);
    return QueryBuilder.buildQueryObject();
  }

  /**
   * Loads models of type `User` based on given `query`
   *
   * If start or end parameters are `null` it respond query to all records
   *
   * @param query
   * @param fields
   * @param start
   * @param end
   * @param sort
   * @param order
   */
  static load(query = {}, fields = [], start = 0, end = 100, sort = "_id", order = "desc") {
    const User = mongoose.model("User");
    return Collection.load(User, query, fields, start, end, sort,order);
  }

  /**
   * Loads single model or returns null
   */
  static loadOne(query = {}) {
    const User = mongoose.model("User");
    return Collection.loadOne(User, query);
  }

  /**
   * Wrapper for mongoose model saving
   */
  static create(fields = {}) {
    const User = mongoose.model("User");
    return Collection.create(User, fields);
  }

  /**
   * Wrapper for mongoose model saving
   */
  static save(Model) {
    return Collection.save(Model);
  }

  /**
   * Delete model implementation using mongoose's remove() method
   */
  static delete(query = {}) {
    const User = mongoose.model("User");
    return Collection.delete(User, query);
  }

  /**
   * Helper to see collection size, optionally pass in query to filter the data set
   */
  static count(query = {}) {
    const User = mongoose.model("User");
    return Collection.count(User, query);
  }
}

export default UserCollection;
