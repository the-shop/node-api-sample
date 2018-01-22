import request from "supertest";
import Randomizer from "../src/Helpers/Randomizer";
import { MailChimp } from "./ListenerEventConstants";
import mongoose from "mongoose";

class BaseTest {
  constructor(application) {
    this.setApplication(application);
    this.randomizer = new Randomizer();
    this.removeMailChimpListener();
  }

  getRandomizer() {
    return this.randomizer;
  }

  async registerTestUser(
    firstName = this.getRandomizer().randomHex(1),
    lastName = this.getRandomizer().randomHex(1),
    email = this.getRandomEmail(),
    role = "admin",
    password = "aaaaaa0!"
  ) {
    const response = await request(this.express)
      .post("/api/v1/register")
      .send({
        firstName,
        lastName,
        email,
        role,
        password
      });

    return {
      response,
      headers: response.headers,
      user: response.body.model,
    }
  }

  getRandomEmail() {
    return `${this.getRandomizer().randomHex(10)}@${this.getRandomizer().randomHex(10)}.com`;
  }

  setApplication(application) {
    this.application = application;
  }

  getApplication() {
    return this.application;
  }

  removeMailChimpListener() {
    // Remove mailchimp sync listener from registered events
    const eventsRegistry = this.getApplication().getEventsRegistry();
    const registeredListeners = eventsRegistry.getAllRegistered();
    MailChimp.map(hook => {
      if (Array.isArray(registeredListeners[hook])) {
        registeredListeners[hook] = registeredListeners[hook].filter(listener => listener.constructor.name !== "SyncUserWithMailChimp");
      }
    });
    eventsRegistry.registeredListeners = registeredListeners;
  }
}

export default BaseTest;
