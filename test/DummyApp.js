import FrameworkError from "../src/Framework/Errors/FrameworkError";
import Application from "../src/Application";

const httpClientMethod = (url, query, data, headers, app) => {
  if (app.getDummyUser() === null) {
    throw new FrameworkError("Dummy externalHttpRequest Error.");
  }
   return {
    url,
    query,
    data,
    headers
  };
};

class DummyApp extends Application {
  constructor() {
    super();
    this.dummyUser = null;
    this.setHttpClient({
      put: httpClientMethod
      });
  }

  setDummyUser(user) {
    this.dummyUser = user;
  }

  getDummyUser() {
    return this.dummyUser;
  }

  async externalHttpRequest(
    requestMethod = "get",
    url = null,
    { query = {}, data = {}, headers = {} } = {},
    graceful = false
  ) {
    const method = requestMethod.toLowerCase();

    try {
      return this.getHttpClient()[method](url, query, data, headers, this);
    } catch (requestError) {
      this.logError("Dummy request error: ", requestError);
      if (graceful !== true) {
        throw new FrameworkError(requestError.message);
      }
    }
  }
}

export default DummyApp;
