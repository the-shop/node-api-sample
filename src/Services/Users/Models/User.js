import mongoose from "mongoose";
import crypto from "crypto";
import config from "../../../config";
import FrameworkError from "../../../Framework/Errors/FrameworkError";
import InputMalformedError from "../../../Framework/Errors/InputMalformedError";

const Schema = mongoose.Schema;

/**
 * UserSchema definition
 */
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name has to be defined"],
    minlength: 1,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: [true, "Last name has to be defined"],
    minlength: 1,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    index: {"unique": true},
  },
  role: {
    type: String,
    required: [true, "User role has to be defined"],
    default: "user",
    enum: ["admin", "user"],
  },
  hashedPassword: {
    type: String
  },
  salt: {
    type: String,
  },
  passResetToken: {
    type: String
  },
  passResetTime: {
    type: Number
  },
});

/**
 * Methods
 */
UserSchema.method({
  /**
   * Ensure `id` property format
   */
  toJSON: function() {
    const obj = this.toObject();

    obj.id = obj._id ? obj._id.toString() : null;
    delete obj.__v;
    delete obj._id;

    return obj;
  },

  /**
   * Generate and set reset password token
   *
   * If callback function is set it will be called with the token as parameter
   *
   * @param {function} cb
   * @returns {this}
   */
  generatePasswordRestToken: function (cb) {
    const buffer = crypto.randomBytes(48);

    const resetToken = buffer.toString("hex");
    // Set generated token
    this.passResetToken = resetToken;

    // Set time of token generation
    this.passResetTime = Math.round((new Date()).getTime() / 1000);

    if (cb) {
      cb(resetToken);
    }

    return this;
  },

  /**
   * Authenticate by checking the hashed password and provided password
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api private
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Create password salt
   *
   * @return {String}
   * @api private
   */
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + "";
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api private
   */
  encryptPassword: function (password) {
    if (!password) return "";
    return crypto.createHmac("sha1", this.salt)
      .update(password)
      .digest("hex");
  },
});

/**
 * Password virtual
 */
UserSchema.virtual("password")
  /**
   * Setting password virtual field will deal with all password related fields.
   *
   * Throws FrameworkError in case token has expired
   */
  .set(function (password) {
    const secondsSinceRequested = Math.round((new Date()).getTime() / 1000 - this.passResetTime);
    if (secondsSinceRequested > config.password.resetTokenTimeoutSeconds) {
      throw new FrameworkError("Token doesn't exist or has expired.");
    }

    if (!/^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g.test(password)) {
      throw new InputMalformedError(
        "Password must be at least 8 characters long and must contain at least one number and one special character!"
      );
    }

    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
    this.passResetTime = null;
    this.passResetToken = null;
  })
  /**
   * Returns virtual _password property
   */
  .get(() => {
    return this._password;
  });

/**
 * Statics
 */
UserSchema.static({});

/**
 * Indexes
 */
UserSchema.index({});

/**
 * Register
 */
mongoose.model("User", UserSchema);
