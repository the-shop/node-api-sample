import AbstractListener from "../../src/Framework/AbstractListener";

/**
 * Test listener for output modification
 */
class DummyResponseOutputListener extends AbstractListener {
  /**
   * Array of event string identifiers
   *
   * @type {Array}
   */
  static LISTEN_ON = [
    "EVENT_API_RESPONSE_OUTPUT_PRE"
  ];

  /**
   * Listener entry point
   */
  async handle (out) {
    let tmpOut = Object.assign({}, out);

    if (!tmpOut.model) {
      throw new Error("Model in response is missing.");
    }

    const model = tmpOut.model;
    delete tmpOut.model;

    return {
      modifiedOutput: model
    };
  }
}

export default DummyResponseOutputListener;
