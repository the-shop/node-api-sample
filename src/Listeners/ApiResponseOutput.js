import moment from "moment";
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

    // Let's see all event handlers
    const registeredEvents = await this.getApplication()
      .getEventsRegistry()
      .getAllRegistered();

    let formattedOutput = out;

    // Check for output event handlers
    const outputEventHandlers = registeredEvents[ApiResponseOutput.EVENT_API_RESPONSE_OUTPUT_PRE] || [];

    // Iterate and let them mutate the output
    for (let i = 0; i < outputEventHandlers.length; i++) {
      const listener = outputEventHandlers[i];

      if (listener instanceof AbstractListener === false) {
        this.getApplication().logError("Listener must be instance of AbstractListener");
        return false;
      }

      listener.setApplication(this.getApplication());

      this.getApplication()
        .getEventsRegistry()
        .triggeredEvents
        .push({
          eventName: ApiResponseOutput.EVENT_API_RESPONSE_OUTPUT_PRE,
          listener: listener.constructor.name,
          timestampMs: moment().unix()
        });

      formattedOutput = await listener.handle(
        formattedOutput,
        httpRequest,
        httpResponse,
      );
    }

    /**
     * Send response back through express' response
     */
    if (httpResponse.getType() !== null) {
      httpResponse.send(formattedOutput);
    } else {
      httpResponse.json(formattedOutput);
    }


    return formattedOutput;
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
