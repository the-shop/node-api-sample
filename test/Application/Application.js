import test from "tape-promise/tape";
import BaseTest from "../BaseTest";
import Application from "../../src/Application";
import config from "../../src/config";
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
      test.notEqual(undefined, app.getServicesRegistry());
      test.notEqual(undefined, app.getRouter());
      test.notEqual(undefined, app.getEventsRegistry());
      test.notEqual(undefined, app.getAcl());
      test.notEqual(undefined, app.getAdaptersRegistry());
      test.equal(undefined, app.getDatabase());
      test.notEqual(undefined, app.getAppStartTime());
      test.equal(undefined, app.getExpress());
      test.notEqual(undefined, app.getExpressPort());
      test.equal(config.api.port, app.getExpressPort());
      test.notEqual(undefined, app.getModelsRegistry());

      test.end();
    });

    test("APPLICATION - externalHttp() - no url - FAIL", async test => {
      const app = new Application();

      try {
        await app.externalHttpRequest();
      } catch (error) {
        test.equal(error.message, "Parameter \"urlObj\" must be an object, not null");
      }

      test.end();
    });

    test("APPLICATION - externalHttp() - SUCCESS", async test => {
      const app = new Application({ httpClient: new DummyHttpClient() });
      app.setExpress(express);

      const response = await app.externalHttpRequest(
        "POST",
        `testing`
      );

      test.equal(response.url, "testing");

      test.end();
    });

    test("APPLICATION - externalHttp() with query parameters - SUCCESS", async test => {
      const app = new Application({ httpClient: new DummyHttpClient() });
      app.setExpress(express);

      const response = await app.externalHttpRequest(
        "GET",
        `testing`,
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
      const app = new Application({ httpClient: new DummyHttpClient() });
      app.setExpress(express);

      const response = await app.externalHttpRequest(
        "POST",
        `testing`,
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

    test.onFinish(() => process.exit(0)); // eslint-disable-line*/
  }
}

export default ApplicationTest;
