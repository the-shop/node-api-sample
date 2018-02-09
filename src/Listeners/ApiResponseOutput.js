import AbstractListener from "../Framework/AbstractListener";
import Router from "../Framework/Application/Router";

class ApiResponseOutput extends AbstractListener {
  /**
   * Array of event string identifiers
   *
   * @type {Array}
   */
  static LISTEN_ON = [
    Router.EVENT_ROUTER_ROUTE_HANDLE_POST,
  ];

  /**
   * Triggers before ApiResponseOutput returns express response
   * @type {string}
   */
  static EVENT_API_RESPONSE_OUTPUT_PRE = "EVENT_API_RESPONSE_OUTPUT_PRE";

  /**
   * Listener entry point
   */
  async handle({ error, response, httpRequest, httpResponse }) {
    // To be on safe side, check for error and do nothing if it happens
    if (error) {
      return null;
    }

    let out = {
      error: false
    };

    if (Array.isArray(response)) {
      const modelPromises = [];

      response.forEach(model => modelPromises.push(this.formatSingleModel(model, httpRequest.getUrl())));

      out.models = await Promise.all(modelPromises);

      // Build out pagination part of response
      const query = httpRequest.getQuery();
      const start = parseInt(query.start || 0, 10);
      const end = parseInt(query.end || 10, 10);
      // Number of responses for given query
      const totalCount = parseInt(httpResponse.getHeader("X-Total-Count") || response.length, 10);
      // Number of models in response
      const modelsCount = response.length;
      // Number of pages for given "query", "start" and "end" request values
      const pagesCount = modelsCount === 0 ? 0 : Math.ceil(totalCount / modelsCount);
      out.pagination = {
        pagesCount,
        modelsCount,
        start,
        end,
        sort: query.sort || "id",
        order: query.sort || "asc",
        totalCount,
      };
    } else {
      out.model = await this.formatSingleModel(response, httpRequest.getUrl());
    }

    const eventResponses = await this.getApplication()
      .getEventsRegistry()
      .trigger(
        ApiResponseOutput.EVENT_API_RESPONSE_OUTPUT_PRE, Object.assign({}, out)
      );

    /**
     * We have got array of responses from events registry (all triggered listeners on one event)
     * so we'll just account for the first one to return modified output
     */
    if (eventResponses.length > 0 ) {
      out = eventResponses[0];
    }

    /**
     * Send response back through express response
     */
    httpResponse.setCode(200)
      .setBody(out)
      .json();

    return out;
  }

  async formatSingleModel(model, url) {
    let result = model;

    if (model.constructor && model.constructor.modelName) {
      const modelName = model.constructor.modelName;
      const adapterInstance = this.getApplication()
        .getAdaptersRegistry()
        .get(modelName, null);

      if (adapterInstance) {
        result = await adapterInstance.adapt(model);
      } else {
        this.getApplication()
          .logError(`"${url}" responded without Adapter.`);
      }
    }

    return result;
  }
}

export default ApiResponseOutput;
