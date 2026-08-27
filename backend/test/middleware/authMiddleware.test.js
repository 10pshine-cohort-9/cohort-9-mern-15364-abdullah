import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { authenticate } from "../../src/middleware/authMiddleware.js";

function createRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe("authMiddleware - authenticate", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should return 401 if no authorization header is present", () => {
    const req = { headers: {} };
    const res = createRes();
    const next = sinon.spy();

    authenticate(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({
      success: false,
      message: "Access denied. No token provided.",
    })).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should return 401 if the header does not start with 'Bearer '", () => {
    const req = { headers: { authorization: "Basic sometoken" } };
    const res = createRes();
    const next = sinon.spy();

    authenticate(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should attach the decoded payload to req.user and call next() on a valid token", () => {
    const req = { headers: { authorization: "Bearer validtoken123" } };
    const res = createRes();
    const next = sinon.spy();
    const fakeDecoded = { id: 5 };
    sinon.stub(jwt, "verify").returns(fakeDecoded);

    authenticate(req, res, next);

    expect(req.user).to.deep.equal(fakeDecoded);
    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it("should return 401 if jwt.verify throws (invalid or expired token)", () => {
    const req = { headers: { authorization: "Bearer badtoken" } };
    const res = createRes();
    const next = sinon.spy();
    sinon.stub(jwt, "verify").throws(new Error("jwt expired"));

    authenticate(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({
      success: false,
      message: "Invalid or expired token.",
    })).to.be.true;
    expect(next.called).to.be.false;
  });
});