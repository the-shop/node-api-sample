import request from "supertest";
import Randomizer from "../src/Helpers/Randomizer";

class BaseTest {
  constructor() {
    this.randomizer = new Randomizer();
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
}

export default BaseTest;
