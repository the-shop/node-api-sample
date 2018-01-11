import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * CommentSchema definition
 */
const CommentSchema = new Schema({
  owner: {
    type: String,
    required: [true, "Comment owner has to be defined"],
  },
  content: {
    type: String,
    required: [true, "Post content has to be defined"],
    maxlength: 5000,
  },
});

/**
 * Methods
 */
CommentSchema.method({
  /**
   * Ensure `id` property format
   */
  toJSON: function() {
    const obj = this.toObject();

    obj.id = obj._id ? obj._id.toString() : null;
    delete obj.__v;
    delete obj._id;

    return obj;
  }
});

/**
 * Statics
 */
CommentSchema.static({});

/**
 * Indexes
 */
CommentSchema.index({});

/**
 * Register
 */
mongoose.model("Comment", CommentSchema);
