// test/utils/generateToken.test.js
import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { generateToken } from "../../src/utils/generateToken.js";

describe("generateToken", () => {
  let originalSecret;
  let originalExpiresIn;

  beforeEach(() => {
    // Arrange (shared): remember the real values so we can restore them
    originalSecret = process.env.JWT_SECRET;
    originalExpiresIn = process.env.JWT_EXPIRES_IN;
  });

  afterEach(() => {
    // Cleanup: restore real env values and undo any stubs
    process.env.JWT_SECRET = originalSecret;
    process.env.JWT_EXPIRES_IN = originalExpiresIn;
    sinon.restore();
  });

  it("should throw if JWT_SECRET is not configured", () => {
    delete process.env.JWT_SECRET;
    process.env.JWT_EXPIRES_IN = "1h";

    expect(() => generateToken(1)).to.throw("JWT_SECRET is not configured");
  });

  it("should throw if JWT_EXPIRES_IN is not configured", () => {
    process.env.JWT_SECRET = "test-secret";
    delete process.env.JWT_EXPIRES_IN;

    expect(() => generateToken(1)).to.throw("JWT_EXPIRES_IN is not configured");
  });

  it("should call jwt.sign with the correct payload, secret, and options", () => {
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";

    const signStub = sinon.stub(jwt, "sign").returns("fake.jwt.token");

    const token = generateToken(42);

    expect(signStub.calledOnce).to.be.true;
    expect(signStub.firstCall.args[0]).to.deep.equal({ id: 42 });
    expect(signStub.firstCall.args[1]).to.equal("test-secret");
    expect(signStub.firstCall.args[2]).to.deep.equal({ expiresIn: "1h" });
    expect(token).to.equal("fake.jwt.token");
  });
});