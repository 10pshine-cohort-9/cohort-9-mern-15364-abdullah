import { expect } from "chai";
import { validationResult } from "express-validator";
import sinon from "sinon";
import {
  registerValidation,
  loginValidation,
  validateRequest,
} from "../../src/middleware/authValidation.js";

async function runValidations(validations, req) {
  await Promise.all(validations.map((validation) => validation.run(req)));
}

function createRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe("authValidation", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("registerValidation", () => {
    it("should produce errors for empty fullName, invalid email, and short password", async () => {
      const req = { body: { fullName: "", email: "not-an-email", password: "short" } };

      await runValidations(registerValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).to.be.false;
      const fields = errors.array().map((e) => e.path);
      expect(fields).to.include.members(["fullName", "email", "password"]);
    });

    it("should produce no errors for valid input", async () => {
      const req = {
        body: { fullName: "Test User", email: "test@test.com", password: "password123" },
      };

      await runValidations(registerValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).to.be.true;
    });
  });

  describe("loginValidation", () => {
    it("should produce errors for invalid email and empty password", async () => {
      const req = { body: { email: "bad-email", password: "" } };

      await runValidations(loginValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).to.be.false;
      const fields = errors.array().map((e) => e.path);
      expect(fields).to.include.members(["email", "password"]);
    });

    it("should produce no errors for valid input", async () => {
      const req = { body: { email: "test@test.com", password: "password123" } };

      await runValidations(loginValidation, req);
      const errors = validationResult(req);

      expect(errors.isEmpty()).to.be.true;
    });
  });

  describe("validateRequest", () => {
    it("should return 400 with the error list if validation errors exist", async () => {
      const req = { body: { fullName: "", email: "bad-email", password: "short" } };
      await runValidations(registerValidation, req);
      const res = createRes();
      const next = sinon.spy();

      validateRequest(req, res, next);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const jsonArg = res.json.firstCall.args[0];
      expect(jsonArg.success).to.be.false;
      expect(jsonArg.errors).to.be.an("array").with.length.greaterThan(0);
      expect(next.called).to.be.false;
    });

    it("should call next() if there are no validation errors", async () => {
      const req = {
        body: { fullName: "Test User", email: "test@test.com", password: "password123" },
      };
      await runValidations(registerValidation, req);
      const res = createRes();
      const next = sinon.spy();

      validateRequest(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
    });
  });
});