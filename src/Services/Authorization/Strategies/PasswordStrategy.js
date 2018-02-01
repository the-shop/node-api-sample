import passport from "passport";
import passportJWT from "passport-jwt";
import mongoose from "mongoose";
import UnauthorizedError from "../../../Framework/Errors/UnauthorizedError";
import Authorization from "../index";

const User = mongoose.model("User");

class PasswordStrategy {
  constructor() {
    this.applicationInstance = null;
  }

  register() {
    this.getApplication().log(" - Password Strategy");

    passport.use(new passportJWT.Strategy(
      Authorization.getJwtParams(),
      async (payload, done) => {
        if (payload.expires < Date.now()) {
          return done(null, false, new UnauthorizedError("Token expired"));
        }

        const user = await User.findOne({ email: payload.email });

        if (!user) {
          return done(null, false, new UnauthorizedError("Token references non-existing user"));
        }

        return done(null, user);
      }
    ));
  }

  /**
   * Sets application onto class instance, later used to inject application where needed
   *
   * @param applicationInstance
   * @returns {this}
   */
  setApplication (applicationInstance) {
    this.applicationInstance = applicationInstance;
    return this;
  }

  /**
   * Getter for application instance
   * @returns {null|Application}
   */
  getApplication () {
    return this.applicationInstance;
  }
}

export default PasswordStrategy;
