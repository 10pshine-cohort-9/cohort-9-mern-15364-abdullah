import { expect } from "chai";
import sinon from "sinon";
import pool from "../../src/config/db.js";
import {
  findUserByEmail,
  findUserById,
  createUser,
} from "../../src/repositories/authRepository.js";

describe("authRepository", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("findUserByEmail", () => {
    it("should query users by email and return the first row", async () => {
      const fakeUser = { id: 1, email: "test@test.com" };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeUser] });

      const result = await findUserByEmail("test@test.com");

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/SELECT \* FROM users/);
      expect(queryText).to.match(/WHERE email = \$1/);
      expect(values).to.deep.equal(["test@test.com"]);
      expect(result).to.deep.equal(fakeUser);
    });

    it("should propagate a database error unchanged", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await findUserByEmail("test@test.com");
        throw new Error("Expected findUserByEmail to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("connection refused");
      }
    });
  });

  describe("findUserById", () => {
    it("should query users by id and return the first row (without password)", async () => {
      const fakeUser = {
        id: 1,
        full_name: "Test User",
        email: "test@test.com",
        created_at: "2026-01-01",
      };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeUser] });

      const result = await findUserById(1);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/SELECT id, full_name, email, created_at/);
      expect(queryText).to.match(/FROM users/);
      expect(queryText).to.match(/WHERE id = \$1/);
      expect(values).to.deep.equal([1]);
      expect(result).to.deep.equal(fakeUser);
    });

    it("should return undefined if no user matches", async () => {
      sinon.stub(pool, "query").resolves({ rows: [] });

      const result = await findUserById(999);

      expect(result).to.be.undefined;
    });
  });

  describe("createUser", () => {
    it("should insert a new user and return the created row", async () => {
      const fakeCreatedUser = {
        id: 1,
        full_name: "Test User",
        email: "test@test.com",
        created_at: "2026-01-01",
      };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeCreatedUser] });

      const result = await createUser(
        "Test User",
        "test@test.com",
        "hashedPassword123",
      );

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/INSERT INTO users/);
      expect(queryText).to.match(/RETURNING id, full_name, email, created_at/);
      expect(values).to.deep.equal([
        "Test User",
        "test@test.com",
        "hashedPassword123",
      ]);
      expect(result).to.deep.equal(fakeCreatedUser);
    });

    it("should propagate a database error unchanged", async () => {
      const dbError = new Error(
        "duplicate key value violates unique constraint",
      );
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await createUser("Test User", "test@test.com", "hashedPassword123");
        throw new Error("Expected createUser to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal(
          "duplicate key value violates unique constraint",
        );
      }
    });
  });
});
