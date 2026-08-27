import { expect } from "chai";
import loggerMiddleware from "../../src/middleware/loggerMiddleware.js";

describe("loggerMiddleware", () => {
  it("should export a middleware function", () => {
    expect(loggerMiddleware).to.be.a("function");
  });
});