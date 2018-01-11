import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import fileUpload from "express-fileupload";
import expressSession from "express-session";
import express from "express";
import passport from "passport";
import UsersCollection from "../Services/Users/Collections/Users";
import config from "../config";
import AbstractListener from "../Framework/AbstractListener";
import Application from "../Application";

/**
 * Used by framework to actually run the Application
 */
class RegisterMiddleware extends AbstractListener {
  /**
   * Array of event string identifiers
   *
   * @type {Array}
   */
  static LISTEN_ON = [
    Application.EVENT_APPLICATION_RUN_PRE
  ];

  /**
   * Listener entry point
   */
  handle () {
    try {
      this.getApplication().log("REGISTER: Middleware");

      const expressApp = this.getApplication().getExpress();

      /**
       * General middleware setup
       */
      // Compression middleware (should be placed before express.static)
      expressApp.use(compression({
        threshold: 512
      }));

      // Enable CORS
      expressApp.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Total-Count");
        res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Total-Count");

        // intercept OPTIONS method
        if (req.method === "OPTIONS") {
          res.sendStatus(200);
        } else {
          next();
        }
      });

      // Uploads middleware
      // Parse file uploads from multipart/form-data requests
      expressApp.use(fileUpload());

      expressApp.use(express.static(config.rootDir + "/public"));
      expressApp.use(express.static(config.rootDir + "/uploads"));

      // cookieParser should be above session
      expressApp.use(cookieParser());

      // bodyParser should be above methodOverride
      expressApp.use(bodyParser.json());

      // Accept urlencoded body
      expressApp.use(bodyParser.urlencoded({
        extended: false
      }));

      // Old browsers support
      expressApp.use(methodOverride(function (req) {
        if (req.body && typeof req.body === "object" && "_method" in req.body) {
          // look in urlencoded POST bodies and delete it
          const method = req.body._method;
          delete req.body._method;
          return method;
        }
      }));

      // Session
      expressApp.use(expressSession({
        secret: config.session.secret,
        resave: true,
        saveUninitialized: true
      }));

      /**
       * Passport setup
       */
      expressApp.use(passport.initialize());
      expressApp.use(passport.session());
      passport.serializeUser((user, done) => {
        done(null, user.email);
      });
      passport.deserializeUser(async (email, done) => {
        const user = await UsersCollection.loadOne({email});
        done(null, user);
      });
    } catch (error) {
      this.getApplication()
        .logError(error.stack || error);
    }
  }
}

export default RegisterMiddleware;
