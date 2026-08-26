import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

function createRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe("authController", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("should return 201 with the created user on success", async () => {
      const registerUserStub = sinon
        .stub()
        .resolves({ id: 1, email: "test@test.com" });
      const { register } = await esmock(
        "../../src/controllers/authController.js",
        {
          "../../src/services/authService.js": {
            registerUser: registerUserStub,
          },
        },
      );
      const req = {
        body: {
          fullName: "Test",
          email: "test@test.com",
          password: "password123",
        },
      };
      const res = createRes();

      await register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.firstCall.args[0].success).to.be.true;
      expect(
        registerUserStub.calledWith("Test", "test@test.com", "password123"),
      ).to.be.true;
    });

    it("should return the services status code and message on a known error", async () => {
      const err = new Error("User already exists");
      err.statusCode = 409;
      const { register } = await esmock(
        "../../src/controllers/authController.js",
        {
          "../../src/services/authService.js": {
            registerUser: sinon.stub().rejects(err),
          },
        },
      );
      const req = {
        body: {
          fullName: "Test",
          email: "test@test.com",
          password: "password123",
        },
      };
      const res = createRes();

      await register(req, res);

      expect(res.status.calledWith(409)).to.be.true;
      expect(
        res.json.calledWith({ success: false, message: "User already exists" }),
      ).to.be.true;
    });
  });

  describe("login", () => {
    it("should return 200 with token and user data on success", async () => {
      const loginUserStub = sinon
        .stub()
        .resolves({ token: "fake.jwt", user: { id: 1 } });
      const { login } = await esmock(
        "../../src/controllers/authController.js",
        {
          "../../src/services/authService.js": {
            loginUser: loginUserStub,
          },
        },
      );
      const req = { body: { email: "test@test.com", password: "password123" } };
      const res = createRes();

      await login(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.firstCall.args[0].data.token).to.equal("fake.jwt");
      expect(loginUserStub.calledWith("test@test.com", "password123")).to.be
        .true;
    });

    it("should return 401 for invalid credentials", async () => {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      const { login } = await esmock(
        "../../src/controllers/authController.js",
        {
          "../../src/services/authService.js": {
            loginUser: sinon.stub().rejects(err),
          },
        },
      );
      const req = { body: { email: "test@test.com", password: "wrong" } };
      const res = createRes();

      await login(req, res);

      expect(res.status.calledWith(401)).to.be.true;
    });
  });

  describe("getProfile", () => {
    it("should return 200 with the user's profile", async () => {
      const getUserProfileStub = sinon
        .stub()
        .resolves({ id: 1, email: "test@test.com" });
      const { getProfile } = await esmock(
        "../../src/controllers/authController.js",
        {
          "../../src/services/authService.js": {
            getUserProfile: getUserProfileStub,
          },
        },
      );
      const req = { user: { id: 1 } };
      const res = createRes();

      await getProfile(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.firstCall.args[0].data.email).to.equal("test@test.com");
      expect(getUserProfileStub.calledWith(1)).to.be.true;
    });

    it("should return 404 if the user is not found", async () => {
      const err = new Error("User not found");
      err.statusCode = 404;
      const { getProfile } = await esmock(
        "../../src/controllers/authController.js",
        {
          "../../src/services/authService.js": {
            getUserProfile: sinon.stub().rejects(err),
          },
        },
      );
      const req = { user: { id: 999 } };
      const res = createRes();

      await getProfile(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
