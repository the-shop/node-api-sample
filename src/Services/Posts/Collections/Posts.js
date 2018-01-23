import mongoose from "mongoose";
import Collection from "../../../Framework/Collection";
import Query from "../../../Database/Query";

class PostCollection extends Collection {
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
   * Loads models of type `Post` based on given `query`
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
  static load(query = {}, fields = {}, start = 0, end = 100, sort = "_id", order = "desc") {
    const Post = mongoose.model("Post");
    return Collection.load(Post, query, fields, start, end, sort,order);
  }

  /**
   * Loads single model or returns null
   */
  static loadOne(query = {}) {
    const Post = mongoose.model("Post");
    return Collection.loadOne(Post, query);
  }

  /**
   * Wrapper for mongoose model saving
   */
  static create(fields = {}) {
    const Post = mongoose.model("Post");
    return Collection.create(Post, fields);
  }

  /**
   * Wrapper for mongoose model saving
   */
  static save(Model) {
    return Collection.save(Model);
  }

  /**
   * Delete model implementation using mongoose's remove() method and all references on that model
   */
  static async delete(query = {}) {
    const Post = mongoose.model("Post");
    const deleteResponse = await Collection.delete(Post, query);

    return deleteResponse;
  }

  /**
   * Helper to see collection size, optionally pass in query to filter the data set
   */
  static count(query = {}) {
    const Post = mongoose.model("Post");
    return Collection.count(Post, query);
  }
}

export default PostCollection;
