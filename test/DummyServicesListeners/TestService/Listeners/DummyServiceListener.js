import AbstractListener from "../../../../src/Framework/AbstractListener";

class DummyServiceListener extends AbstractListener {
  static DUMMY_SERVICE_LISTENER = "EVENT_DUMMY_SERVICE_LISTENER";

  static LISTEN_ON = [
    DummyServiceListener.DUMMY_SERVICE_LISTENER
  ];

  handle(payload) {
    return "Dummy service listener.";
  }
}

export default DummyServiceListener;
