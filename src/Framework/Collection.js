import mongoose from "mongoose";
import FrameworkError from "./Errors/FrameworkError";
import config from "../config";

/**
 * Adapter for mongoose's interfaces
 */
class Collection {
  /**
   * Loads models of type `Model` based on given `query`
   *
   * If start or end parameters are `null` it respond query to all records
   *
   * @param Model
   * @param fields
   * @param query
   * @param start
   * @param end
   * @param sort
   * @param order
   */
  static load(Model, query = {}, fields = {}, start = 0, end = 10, sort = "_id", order = "desc") {
    // Convert id to _id
    if (query.id) {
      query._id = query.id;
      delete query.id;
    }

    const sortOrder = order.toLowerCase().trim();
    const sortQuery = {};
    const queryOptions = {};

    if (start !== null && end !== null) {
      queryOptions.skip = parseInt(start, 10);
      let limit = parseInt(end, 10) - parseInt(start, 10);
      if (limit < 1) {
        throw new FrameworkError(`Limit passed on database calculated to be "${limit}" - please fix data fetching.`);
      }
      queryOptions.limit = limit;
    }

    const fieldsSelectObject = {};
    Object.keys(fields).map(field => {
      let selectorValue = 1;

      if (typeof fields[field] === "object" && fields[field]["$slice"]) {
        selectorValue = { $slice: fields[field]["$slice"] };
      }

      fieldsSelectObject[field] = selectorValue;
    });

    const builtQuery = Model.find(query, fieldsSelectObject);

    let sortKey = sort.trim();

    builtQuery.setOptions(queryOptions);
    if (sortKey && order) {
      if (sortKey === "id") {
        sortKey = "_id";
      }
      sortQuery[sortKey] = sortOrder;
      builtQuery.sort(sortQuery);
    }

    return builtQuery;
  }

  /**
   * Loads single model or returns null
   *
   * @param Model
   * @param query
   * @param fields
   * @returns {Promise<*>}
   */
  static async loadOne(Model, query, fields = {}) {
    // Convert id to _id
    if (query.id) {
      query._id = query.id;
      delete query.id;
    }

    const fieldsSelectObject = {};
    Object.keys(fields).map(field => {
      let selectorValue = 1;

      if (typeof fields[field] === "object" && fields[field]["$slice"]) {
          selectorValue = { $slice: fields[field]["$slice"] };
      }

      fieldsSelectObject[field] = selectorValue;
    });

    return await Model.findOne(query, fieldsSelectObject);
  }

  /**
   * Wrapper for mongoose model creation
   *
   * @param Model
   * @param fields
   * @returns {*}
   */
  static create(Model, fields = {}) {
    return new Model(fields);
  }

  /**
   * Wrapper for mongoose model saving
   *
   * @param Model
   * @returns {Promise.<*>}
   */
  static async save(Model) {
    if (typeof Model.owner !== "object" || mongoose.Types.ObjectId.isValid(Model.owner) === false) {
      Model.owner = mongoose.Types.ObjectId(config.application.ownerId).toString();
    }
    if (typeof Model.timeCreated !== "object") {
      Model.timeCreated = new Date().toISOString();
    }
    Model.timeEdited = new Date().toISOString();

    return await Model.save();
  }

  /**
   * Delete model implementation using mongoose's remove() method
   *
   * @param Model
   * @param query
   * @returns {Promise.<*>}
   */
  static async delete(Model, query) {
    // Convert id to _id
    if (query.id) {
      query._id = query.id;
      delete query.id;
    }

    return await Model.remove(query);
  }

  /**
   * Helper to see collection size, optionally pass in query to filter the data set
   *
   * @param Model
   * @param query
   * @returns {Query}
   */
  static count(Model, query = {}) {
    return Model.count(query, count => count);
  }
}

export default Collection;
