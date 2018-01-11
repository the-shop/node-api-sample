import AbstractListener from "../Framework/AbstractListener";
import Application from "../Application";

class BootTime extends AbstractListener {
  static LISTEN_ON = [
    Application.EVENT_EXPRESS_START_POST,
  ];

  handle() {
    const app = this.getApplication();
    const instantiationTime = app.getAppStartTime();

    app.log(
      "Application booted in %s second(s).",
      ((new Date().getTime()) - instantiationTime) / 1000
    );
  }
}

export default BootTime;