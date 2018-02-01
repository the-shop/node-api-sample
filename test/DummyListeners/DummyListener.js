import AbstractListener from "../../src/Framework/AbstractListener";

class DummyListener extends AbstractListener {
  static DUMMY_LISTENER = "EVENT_DUMMY_LISTENER";

  static LISTEN_ON = [
    DummyListener.DUMMY_LISTENER
  ];

  handle(payload) {
    return "Dummy listener.";
  }
}

export default DummyListener;
