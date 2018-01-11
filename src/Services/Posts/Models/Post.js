import mongoose from "mongoose";

const Schema = mongoose.Schema;

/**
 * PostSchema definition
 */
const PostSchema = new Schema({
  title: {
    type: String,
    required: [true, "Post title has to be defined"],
    minlength: 1,
    maxlength: 255,
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
PostSchema.method({
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
PostSchema.static({});

/**
 * Indexes
 */
PostSchema.index({});

/**
 * Register
 */
mongoose.model("Post", PostSchema);
