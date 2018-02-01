import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import Application from "../../../src/Application";
import EventsRegistry from "../../../src/Framework/Application/EventsRegistry";
import config from "../../testConfig";
import express from "express";
import DummyListener from "../../DummyListeners/DummyListener";
import DummyServiceListener from "../../DummyServicesListeners/TestService/Listeners/DummyServiceListener";

class EventsRegistryTest extends BaseTest {
  async run() {
    test("EVENTS_REGISTRY - test register(), register static and services listeners success", async test => {
      const app = new Application()
        .setExpress(express())
        .setConfiguration(config)
        .bootstrap();

      const eventsRegistry = new EventsRegistry();
      eventsRegistry.setApplication(app);
      await eventsRegistry.register();

      const registeredEventsAndListeners = eventsRegistry.getAllRegistered();

      const eventsRegisteredKeys = Object.keys(registeredEventsAndListeners);
      const dummyListenerEvent =
        eventsRegisteredKeys.find(eventName => eventName === DummyListener.DUMMY_LISTENER);
      const dummyServiceListenerEvent =
        eventsRegisteredKeys.find(
          eventName => eventName === DummyServiceListener.DUMMY_SERVICE_LISTENER
        );

      test.equal(dummyListenerEvent, DummyListener.DUMMY_LISTENER);
      test.equal(dummyServiceListenerEvent, DummyServiceListener.DUMMY_SERVICE_LISTENER);
      test.equal(
        registeredEventsAndListeners[DummyListener.DUMMY_LISTENER][0].name,
        new DummyListener().constructor.name
      );
      test.equal(
        registeredEventsAndListeners[DummyServiceListener.DUMMY_SERVICE_LISTENER][0].name,
        new DummyServiceListener().constructor.name
      );

      test.end();
    });

    test("LISTEN - EventsRegistry listen() - success", test => {
      const app = new Application()
        .setExpress(express())
        .setConfiguration(config)
        .bootstrap();

      const eventsRegistry = new EventsRegistry();
      eventsRegistry.setApplication(app);
      const listener = new DummyListener();
      listener.setApplication(app);
      eventsRegistry.listen(DummyListener.DUMMY_LISTENER, listener);

      const registeredEventsAndListeners = eventsRegistry.getAllRegistered();

      test.equal(registeredEventsAndListeners[DummyListener.DUMMY_LISTENER][0].name, "DummyListener");

      test.end();
    });

    test("TRIGGER - EventsRegistry trigger() - success", test => {
      const app = new Application()
        .setExpress(express())
        .setConfiguration(config)
        .bootstrap();

      const eventsRegistry = new EventsRegistry();
      eventsRegistry.setApplication(app);
      eventsRegistry.register();
      eventsRegistry.trigger(DummyListener.DUMMY_LISTENER, "test");
      eventsRegistry.trigger(DummyServiceListener.DUMMY_SERVICE_LISTENER, "test");

      const triggeredEvents = eventsRegistry.getAllTriggered();

      test.equal(triggeredEvents[0].eventName, DummyListener.DUMMY_LISTENER);
      test.equal(triggeredEvents[0].listener, new DummyListener().constructor.name);

      test.equal(triggeredEvents[1].eventName, DummyServiceListener.DUMMY_SERVICE_LISTENER);
      test.equal(triggeredEvents[1].listener, new DummyServiceListener().constructor.name);

      test.end();
    });

    test("getAllEventsForDocumentation - EventsRegistry getAllEventsForDocumentation() - success", async test => {
      const app = new Application()
        .setExpress(express())
        .setConfiguration(config)
        .bootstrap();

      const eventsRegistry = new EventsRegistry();
      eventsRegistry.setApplication(app);
      eventsRegistry.register();

      const response = await eventsRegistry.getAllEventsForDocumentation();
      const responseKeysArray = Object.keys(response);

      test.equal(responseKeysArray.length > 0, true);
      test.equal(response[Application.EVENT_EXPRESS_START_POST], true);
      test.equal(response[Application.EVENT_APPLICATION_RUN_PRE], true);
      test.equal(response[Application.EVENT_APPLICATION_BOOTSTRAP_POST], true);
      test.equal(response[Application.EVENT_APPLICATION_RUN], true);
      test.equal(response[Application.EVENT_APPLICATION_RUN_POST], true);
      test.equal(response[Application.EVENT_EXPRESS_START_PRE], true);

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default EventsRegistryTest;
