import mongoose from "mongoose";
import Collection from "../../../Framework/Collection";
import Query from "../../../Database/Query";

class CommentCollection extends Collection {
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
   * Loads models of type `Comment` based on given `query`
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
    const Comment = mongoose.model("Comment");
    return Collection.load(Comment, query, fields, start, end, sort,order);
  }

  /**
   * Loads single model or returns null
   */
  static loadOne(query = {}) {
    const Comment = mongoose.model("Comment");
    return Collection.loadOne(Comment, query);
  }

  /**
   * Wrapper for mongoose model saving
   */
  static create(fields = {}) {
    const Comment = mongoose.model("Comment");
    return Collection.create(Comment, fields);
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
    const Comment = mongoose.model("Comment");
    return Collection.delete(Comment, query);
  }

  /**
   * Helper to see collection size, optionally pass in query to filter the data set
   */
  static count(query = {}) {
    const Comment = mongoose.model("Comment");
    return Collection.count(Comment, query);
  }
}

export default CommentCollection;
