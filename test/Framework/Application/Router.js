import test from "tape-promise/tape";
import request from "supertest";
import BaseTest from "../../BaseTest";
import Application from "../../../src/Application";
import express from "express";

class Router extends BaseTest {
  constructor() {
    super();
    this.publicRoutes = [];
    this.privateRoutes = [];
  }

  getRoutePaths() {
    const app = new Application();
    app.setExpress(express());

    const services = app
      .getServicesRegistry()
      .getAll();

    Object.keys(services).map(serviceName => {
      const service = services[serviceName];

      const routesMapping = service.getRoutesMapping();

      Object.keys(routesMapping).map(routePath => {
        const routeActionInstances = routesMapping[routePath];

        Object.keys(routeActionInstances).map(httpMethod => {
          const actionInstance = routesMapping[routePath][httpMethod];
          const isPublic = actionInstance.constructor.IS_PUBLIC;
          const version = actionInstance.constructor.VERSION;
          const fullRoutePath = `/api/${version}/${routePath}`;
          if (isPublic === true) {
            this.publicRoutes.push({ httpMethod, fullRoutePath })
          } else {
            this.privateRoutes.push({ httpMethod, fullRoutePath })
          }
        });
      });
    });
  }

  async run() {
    this.getRoutePaths();
    // Test public routes - authorization token not needed for accessing route
    this.publicRoutes.forEach(publicRoute => {
      test(`Router test (public) - /${publicRoute.httpMethod} - ${publicRoute.fullRoutePath} - SUCCESS`, async test => {
        const { httpMethod, fullRoutePath } = publicRoute;

        const response = await request(this.express)[httpMethod.toLowerCase()](fullRoutePath);

        if (response.body.errors) {
          test.notEqual(response.body.errors[0], "No auth token", "Field 'errors' matches");
          test.notEqual(response.body.errors[0], "jwt malformed", "Field 'errors' matches");
          test.end();
        }
      });
    });

    // Test private routes for success read authorization token, deny if no auth token or
    // malformed jwt
    this.privateRoutes.forEach(privateRoute => {
      test(`Router test (private) - /${privateRoute.httpMethod} - ${privateRoute.fullRoutePath} - NOT AUTHORIZED`, async test => {
        const { httpMethod, fullRoutePath } = privateRoute;

        const response = await request(this.express)[httpMethod.toLowerCase()](fullRoutePath);

        test.equal(response.statusCode, 401);
        test.equal(response.headers.authorization, undefined, 'Authorization header not defined');
        test.equal(response.body.error, true, "Error occurred");
        test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");
        test.end();
      });

      test(`Router test (private) - /${privateRoute.httpMethod} - ${privateRoute.fullRoutePath} - JWT MALFORMED`, async test => {
        const { httpMethod, fullRoutePath } = privateRoute;

        const response = await request(this.express)[httpMethod.toLowerCase()](fullRoutePath)
          .set("Authorization", "malformedJwt");

        test.equal(response.statusCode, 401);
        test.equal(response.headers.authorization, undefined, 'Authorization header not defined');
        test.equal(response.body.error, true, "Error occurred");
        test.equal(response.body.errors[0], "jwt malformed", "Field 'errors' matches");
        test.end();
      });
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line*/
  }
}

export default Router;
