import moment from "moment";
import passport from "passport";
import FrameworkError from "../Errors/FrameworkError";
import UnauthorizedError from "../Errors/UnauthorizedError";
import "../../Helpers/String";

/**
 * Handles routes
 */
class Router {
  /**
   * Triggers before route handle starts execution
   * @type {string}
   */
  static EVENT_ROUTER_ROUTE_HANDLE_PRE = "EVENT_ROUTER_ROUTE_HANDLE_PRE";

  /**
   * Triggers after route handle starts execution
   * @type {string}
   */
  static EVENT_ROUTER_ROUTE_HANDLE_POST = "EVENT_ROUTER_ROUTE_HANDLE_POST";

  constructor () {
    this.applicationInstance = null;
  }

  /**
   * Auto register the route actions from `src/Services/<SERVICE_NAME>/Actions`
   */
  registerRoutes () {
    const services = this.getApplication()
      .getServicesRegistry()
      .getAll();

    this.publicRoutes = [];

    Object.keys(services).map(serviceName => {
      this.getApplication().log("%s SERVICE ROUTES:", serviceName.camelToSpace().toUpperCase());
      const service = services[serviceName];

      const routesMapping = service.getRoutesMapping();

      Object.keys(routesMapping).map(routePath => {
        const routeActionInstances = routesMapping[routePath];

        Object.keys(routeActionInstances).map(httpMethod => {
          const actionInstance = routesMapping[routePath][httpMethod];
          const isPublic = actionInstance.constructor.IS_PUBLIC;
          const version = actionInstance.constructor.VERSION;
          const fullRoutePath = `/api/${version}/${routePath}`;

          this.getApplication().log(
            " - %s ROUTE: %s %s",
            isPublic ? "PUBLIC" : "PRIVATE",
            httpMethod,
            fullRoutePath
          );

          const routeHandler = async (req, res, next) => {
            const startMs = new Date();
            let endMs = null;
            try {
              this.getApplication()
                .getEventsRegistry()
                .trigger(Router.EVENT_ROUTER_ROUTE_HANDLE_PRE, {
                  expressReq: req,
                  expressRes: res,
                  expressNext: next,
                });

              const auth = this.getApplication().getAcl().getAuthorization();
              auth.setAuthType("user")
                .setId(isPublic ? "everyone" : "unauthorized");

              if (req.user) {
                auth.setAuthType("user")
                  .setId("authorized");

                if (req.user.role) {
                  auth.setAuthType("role")
                    .setId(req.user.role);
                }
              }

              actionInstance.setAcl(this.getApplication().getAcl());

              const actionInput = await actionInstance.getActionInput(req);

              const response = await actionInstance.handle(actionInput, req, res, next);

              // If there's no response from the action handler, that's a problem...
              if (!response) {
                throw new FrameworkError("Empty response from server");
              }

              endMs = new Date();
              this.getApplication().log(
                "Request handled: %s %s (at: %s, duration: %sms, code: %s)",
                httpMethod,
                fullRoutePath,
                moment().toISOString(),
                endMs.getTime() - startMs.getTime(),
                200
              );

              this.getApplication()
                .getEventsRegistry()
                .trigger(
                  Router.EVENT_ROUTER_ROUTE_HANDLE_POST, {
                    error: null,
                    response: response,
                    expressReq: req,
                    expressRes: res,
                    expressNext: next,
                  });
            } catch (handlerError) {
              endMs = new Date();
              this.getApplication().log(
                "Request failed: %s %s (at: %s, duration: %sms, code: %s)",
                httpMethod,
                fullRoutePath,
                moment().toISOString(),
                endMs.getTime() - startMs.getTime(),
                handlerError.code
              );
              this.getApplication()
                .getEventsRegistry()
                .trigger(
                  Router.EVENT_ROUTER_ROUTE_HANDLE_POST, {
                    error: handlerError,
                    response: null,
                    expressReq: req,
                    expressRes: res,
                    expressNext: next,
                  });

              // Use error handler middleware
              return next(handlerError);
            }
          };

          if (isPublic) {
            this.getApplication().express[httpMethod.toLowerCase()](fullRoutePath, routeHandler);
          } else {
            this.getApplication().express[httpMethod.toLowerCase()](fullRoutePath, this.ensureAuthenticated, routeHandler);
          }

          if (isPublic === true) {
            this.publicRoutes.push(routePath);
          }
        });
      });
    });
  }

  ensureAuthenticated (req, res, next) {
    if (req.session && req.session.passport) {
      // User is using a valid session, proceed
      return next();
    }

    try {
      return passport.authenticate("jwt",
        (err, user, info) => {
          if (err) {
            // TODO: check status code and response format
            return next(err);
          }

          if (!user) {
            return next(new UnauthorizedError(info.message));
          }

          req.logIn(user, (err) => {
            // TODO: check status code and response format
            if (err) {
              return next(err);
            }
          });
          return next();
        })(req, res, next);
    } catch (error) {
      throw new UnauthorizedError(error.message);
    }
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

export default Router;
