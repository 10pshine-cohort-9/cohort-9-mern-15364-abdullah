import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcrypt";
import esmock from "esmock";

describe("authService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("registerUser", () => {
    it("should throw if user already exists", async () => {
      const { registerUser } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserByEmail: sinon.stub().resolves({ id: 1, email: "test@test.com" }),
        },
      });

      try {
        await registerUser("Test User", "test@test.com", "password123");
        throw new Error("Expected registerUser to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("User already exists");
        expect(err.statusCode).to.equal(409);
      }
    });

    it("should hash the password and call createUser with it", async () => {
      const findStub = sinon.stub().resolves(null);
      const createStub = sinon.stub().resolves({
        id: 1,
        full_name: "Test User",
        email: "test@test.com",
      });
      const hashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword123");

      const { registerUser } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserByEmail: findStub,
          createUser: createStub,
        },
      });

      await registerUser("Test User", "test@test.com", "password123");

      expect(hashStub.calledWith("password123", 10)).to.be.true;
      expect(createStub.calledWith("Test User", "test@test.com", "hashedPassword123")).to.be.true;
    });

    it("should return the created user on success", async () => {
      const { registerUser } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserByEmail: sinon.stub().resolves(null),
          createUser: sinon.stub().resolves({
            id: 1,
            full_name: "Test User",
            email: "test@test.com",
          }),
        },
      });
      sinon.stub(bcrypt, "hash").resolves("hashedPassword123");

      const result = await registerUser("Test User", "test@test.com", "password123");

      expect(result).to.have.property("id", 1);
      expect(result.email).to.equal("test@test.com");
    });
  });

  describe("loginUser", () => {
    it("should throw 'Invalid email or password' if user does not exist", async () => {
      const { loginUser } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserByEmail: sinon.stub().resolves(null),
        },
      });

      try {
        await loginUser("nouser@test.com", "password123");
        throw new Error("Expected loginUser to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Invalid email or password");
        expect(err.statusCode).to.equal(401);
      }
    });

    it("should throw 'Invalid email or password' if password is incorrect", async () => {
      sinon.stub(bcrypt, "compare").resolves(false);

      const { loginUser } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserByEmail: sinon.stub().resolves({
            id: 1,
            email: "test@test.com",
            password: "hashedPassword123",
          }),
        },
      });

      try {
        await loginUser("test@test.com", "wrongpassword");
        throw new Error("Expected loginUser to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Invalid email or password");
        expect(err.statusCode).to.equal(401);
      }
    });

    it("should return a token and safe user info on success", async () => {
      sinon.stub(bcrypt, "compare").resolves(true);

      const { loginUser } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserByEmail: sinon.stub().resolves({
            id: 1,
            full_name: "Test User",
            email: "test@test.com",
            password: "hashedPassword123",
          }),
        },
        "../../src/utils/generateToken.js": {
          generateToken: sinon.stub().returns("fake.jwt.token"),
        },
      });

      const result = await loginUser("test@test.com", "password123");

      expect(result.token).to.equal("fake.jwt.token");
      expect(result.user).to.deep.equal({
        id: 1,
        full_name: "Test User",
        email: "test@test.com",
      });
    });

    it("should never include the password in the returned user object", async () => {
      sinon.stub(bcrypt, "compare").resolves(true);

      const { loginUser } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserByEmail: sinon.stub().resolves({
            id: 1,
            full_name: "Test User",
            email: "test@test.com",
            password: "hashedPassword123",
          }),
        },
        "../../src/utils/generateToken.js": {
          generateToken: sinon.stub().returns("fake.jwt.token"),
        },
      });

      const result = await loginUser("test@test.com", "password123");

      expect(result.user).to.not.have.property("password");
    });
  });

  describe("getUserProfile", () => {
    it("should throw 'User not found' if user does not exist", async () => {
      const { getUserProfile } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserById: sinon.stub().resolves(null),
        },
      });

      try {
        await getUserProfile(999);
        throw new Error("Expected getUserProfile to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("User not found");
        expect(err.statusCode).to.equal(404);
      }
    });

    it("should return the user if found", async () => {
      const { getUserProfile } = await esmock("../../src/services/authService.js", {
        "../../src/repositories/authRepository.js": {
          findUserById: sinon.stub().resolves({
            id: 1,
            full_name: "Test User",
            email: "test@test.com",
          }),
        },
      });

      const result = await getUserProfile(1);

      expect(result.email).to.equal("test@test.com");
    });
  });
});