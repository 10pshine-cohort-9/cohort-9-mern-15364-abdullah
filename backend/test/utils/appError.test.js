import { expect } from "chai";
import appError from "../../src/utils/appError.js";

describe("appError", () => {
  it("should be an instance of Error", () => {
    const err = new appError("Something went wrong", 500);
    expect(err).to.be.instanceOf(Error);
  });

  it("should store the message", () => {
    const err = new appError("Not found", 404);
    expect(err.message).to.equal("Not found");
  });

  it("should store the statusCode", () => {
    const err = new appError("Not found", 404);
    expect(err.statusCode).to.equal(404);
  });
});