import superagent from "superagent";
import debug from "debug";

const methods = ["get", "post", "put", "patch", "delete"];

const logError = debug("node-api-sample:framework:httpClient:error");
const logWarning = debug("node-api-sample:framework:httpClient:warning");

class ApiClient {
  constructor() {
    this.store = null;
    this.requestsHistory = {};
    this.errorHandlerFunction = (error, url, method = "unknown") => {
      logError(`Error handler in ApiClient missing, error triggered (${method.toUpperCase()}: ${url}): `, error);
    };

    methods.forEach(async (method) => {
      this[method] = (
        path,
        {
          params,
          data,
          files,
          progressCb,
          headers = {},
          requestId = null,
        } = {},
      ) =>
        new Promise((resolve, reject) => {
          let requestPath = path;

          let requestUrl = null;
          if (requestPath.indexOf("http") === -1) {
            // Sanitize path
            if (requestPath.charAt(0) !== "/") {
              requestPath = `/${requestPath}`;
            }
            requestUrl = requestPath;
          } else {
            requestUrl = requestPath;
          }

          const request = superagent[method](requestUrl);

          if (requestId) {
            this.requestsHistory[requestId] = request;
          }

          if (progressCb) {
            request.on("progress", event => progressCb(event));
          }

          // Default headers for non form submission
          if (!files) {
            request.set("content-type", "application/json");
          }

          // Additional headers
          Object.keys(headers).map(header => request.set(header, headers[header]));

          if (params) {
            request.query(params);
          }

          if (data && !files) {
            request.send(data);
          }

          if (files) {
            if (data) {
              Object.keys(data).forEach(key => request.field(key, data[key]));
            }
            const formData = new FormData();
            Object.keys(files).forEach((key) => {
              formData.append(key, files[key]);
            });
            request.send(formData);
          }

          request.end(
            (err, res) => {
              if (err) {
                let errors = [ "Issue with the API." ];
                if (err.message) {
                  errors = [ err.message ];
                }

                const rejectionContent = res && res.body ? res.body : { error: true, errors };

                this.errorHandlerFunction(rejectionContent, requestUrl, method);

                return reject(rejectionContent);
              }

              if (!res.body) {
                return reject("No response body in API response.");
              }

              let response = {};
              try {
                response = JSON.parse(res.body);
              } catch (e) {
                response = res.body;
              }

              return resolve({response, headers: res.headers});
            },
          );
        });
      try {
        return this[method];
      } catch (error) {
        logError(error);
      }
    });
  }

  getRequestById(requestId) {
    if (!this.requestsHistory[requestId]) {
      logWarning(`Request with ID: "${requestId}" doesn"t exist`);
      return null;
    }
    return this.requestsHistory[requestId];
  }

  setErrorHandlerFunction(errorHandlerFunction) {
    this.errorHandlerFunction = errorHandlerFunction;
    return this;
  }

  getStore() {
    return this.store;
  }

  setStore(store) {
    this.store = store;
  }
}

export default ApiClient;
