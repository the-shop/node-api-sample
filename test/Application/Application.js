import test from "tape-promise/tape";
import BaseTest from "../BaseTest";
import Application from "../../src/Application";
import config from "../testConfig";
import express from "express";

class DummyHttpClient {
  constructor() {
    this.queryData = null;
    this.postData = null;
    this.headers = null;
    this.url = null;
  }
  post(url) {
    this.url = url;
    return this;
  }
  get(url) {
    this.url = url;
    return this;
  }
  put(url) {
    this.url = url;
    return this;
  }
  patch(url) {
    this.url = url;
    return this;
  }
  delete(url) {
    this.url = url;
    return this;
  }
  query(data) {
    this.queryData = data;
    return this;
  }
  send(data) {
    this.postData = data;
    return this;
  }
  set(headers) {
    this.headers = headers;
  }
}

class ApplicationTest extends BaseTest {
  async run() {
    test("APPLICATION - instantiate - SUCCESS", test => {
      const app = new Application();

      test.equal(undefined, app.getServicesRegistry());
      test.equal(undefined, app.getRouter());
      test.equal(undefined, app.getEventsRegistry());
      test.equal(undefined, app.getAcl());
      test.equal(undefined, app.getAdaptersRegistry());
      test.equal(undefined, app.getDatabase());
      test.notEqual(undefined, app.getAppStartTime());
      test.equal(undefined, app.getExpress());
      test.equal(undefined, app.getExpressPort());
      test.notEqual(config.api.port, app.getExpressPort());
      test.equal(undefined, app.getModelsRegistry());

      test.end();
    });

    test("APPLICATION - externalHttp() - no url - FAIL", async test => {
      const app = new Application();
      app.setExpress(express())
        .setConfiguration(config)
        .bootstrap();

      try {
        await app.externalHttpRequest();
      } catch (error) {
        test.equal(error.message, "Parameter \"urlObj\" must be an object, not null");
      }

      test.end();
    });

    test("APPLICATION - externalHttp() - SUCCESS", async test => {
      const app = new Application();
      app.setExpress(express())
        .setConfiguration(config)
        .bootstrap()
        .setHttpClient(new DummyHttpClient());

      const response = await app.externalHttpRequest(
        "POST",
        "testing"
      );

      test.equal(response.url, "testing");

      test.end();
    });

    test("APPLICATION - externalHttp() with query parameters - SUCCESS", async test => {
      const app = new Application();
      app.setExpress(express())
        .setConfiguration(config)
        .bootstrap()
        .setHttpClient(new DummyHttpClient());

      const response = await app.externalHttpRequest(
        "GET",
        "testing",
        {
          query: "testQueryData",
          headers: {
            Authorization: "testAuthHeader"
          }
        }
      );

      test.equal(response.url, "testing");
      test.deepEqual(response.headers,
        {
          Authorization: "testAuthHeader"
        });
      test.equal(response.queryData, "testQueryData");
      test.equal(response.postData, null);

      test.end();
    });

    test("APPLICATION - externalHttp() with post parameters - SUCCESS", async test => {
      const app = new Application();
      app.setExpress(express())
        .setConfiguration(config)
        .bootstrap()
        .setHttpClient(new DummyHttpClient());

      const response = await app.externalHttpRequest(
        "POST",
        "testing",
        {
          data: "testPostData",
          headers: {
            Authorization: "testAuthHeader"
          }
        }
      );

      test.equal(response.url, "testing");
      test.deepEqual(response.headers,
        {
          Authorization: "testAuthHeader"
        });
      test.equal(response.queryData, null);
      test.equal(response.postData, "testPostData");

      test.end();
    });

    test("APPLICATION - bootstrap - no configuration set - FAIL", test => {
      const app = new Application();

      test.equal(app.configuration, null);

      try {
        app.bootstrap();
      } catch (error) {
        test.equal(error.code, 500);
        test.equal(error.message, "Configuration not set in Application.");
      }

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line*/
  }
}

export default ApplicationTest;
