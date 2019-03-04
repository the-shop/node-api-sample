import mongoose from "mongoose";
import Collection from "../../../Framework/Collection";
import Query from "../../../Database/Query";
import CommentCollection from "../../Comments/Collections/Comments";

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
  static load(query = {}, fields = {}, start = 0, end = 100, sort = "_id", order = "desc") {
    const User = mongoose.model("User");
    return Collection.load(User, query, fields, start, end, sort,order);
  }

  /**
  * Loads single model or returns null
  *
  * @param query
  * @param fields
  * @returns {Promise<*>}
  */
  static loadOne(query = {}, fields = {}) {
    const User = mongoose.model("User");
    return Collection.loadOne(User, query, fields);
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
   * Delete model implementation using mongoose's remove() method and all references on that model
   */
  static async delete(query = {}) {
    const User = mongoose.model("User");
    const deleteResponse = await Collection.delete(User, query);

    const commentsQuery =
      { ownerId: { $eq: query._id } };
    const comments = await CommentCollection.load(commentsQuery);
    await Promise.all(comments.map(async model => {
      model["ownerId"] = undefined;
      await CommentCollection.save(model);
    }));

    return deleteResponse;
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
