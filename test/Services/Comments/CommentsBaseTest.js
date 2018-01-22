import request from "supertest";
import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import mongoose from "mongoose";
import moment from "moment";

class CommentsBaseTest extends BaseTest {
  async createTestComment(headers) {
    const { authorization } = headers;
    const response = await request(this.express)
      .post("/api/v1/comments")
      .set("Authorization", authorization)
      .send({
        ownerId:  mongoose.Types.ObjectId().toString(),
        content: this.getRandomizer().randomHex(10),
      });

    return {
      response,
      headers: response.headers,
      comment: response.body.model,
    }
  }

  validateModelResponseFields(responseModel) {
    test("Validate 'Comment' model response properties", test => {
      test.equal(typeof responseModel.ownerId, "string");
      test.equal(typeof responseModel.content, "string");
      test.equal(typeof responseModel.timeCreated, "string");
      test.equal(moment(responseModel.timeCreated, moment.ISO_8601).isValid(), true);
      test.equal(typeof responseModel.timeEdited, "string");
      test.equal(moment(responseModel.timeEdited, moment.ISO_8601).isValid(), true);
      test.equal(typeof responseModel.owner, "string");

      test.end();
    });
  }
}

export default CommentsBaseTest;
