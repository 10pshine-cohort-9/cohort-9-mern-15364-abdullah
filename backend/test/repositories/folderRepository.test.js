// test/repositories/folderRepository.test.js
import { expect } from "chai";
import sinon from "sinon";
import pool from "../../src/config/db.js";
import logger from "../../src/config/logger.js";
import {
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderById,
} from "../../src/repositories/folderRepository.js";

describe("folderRepository", () => {
  let loggerStub;

  beforeEach(() => {
    loggerStub = sinon.stub(logger, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createFolder", () => {
    it("should insert a folder and return the created row", async () => {
      const fakeFolder = { id: 1, name: "Work", user_id: 5 };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeFolder] });

      const result = await createFolder("Work", 5);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/INSERT INTO folders/);
      expect(queryText).to.match(/RETURNING \*/);
      expect(values).to.deep.equal(["Work", 5]);
      expect(result).to.deep.equal(fakeFolder);
      expect(loggerStub.called).to.be.false;
    });

    it("should log the error and rethrow it unchanged on failure", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await createFolder("Work", 5);
        throw new Error("Expected createFolder to throw, but it did not");
      } catch (err) {
        expect(err).to.equal(dbError); // same error object, not wrapped/replaced
        expect(err.message).to.equal("connection refused");
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[0]).to.deep.equal({ err: dbError });
      expect(loggerStub.firstCall.args[1]).to.equal("Error creating folder");
    });
  });

  describe("updateFolder", () => {
    it("should update a folder and return the updated row", async () => {
      const fakeFolder = { id: 1, name: "Renamed", user_id: 5 };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeFolder] });

      const result = await updateFolder(1, "Renamed", 5);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/UPDATE folders/);
      expect(queryText).to.match(/SET name = \$1/);
      expect(values).to.deep.equal(["Renamed", 1, 5]);
      expect(result).to.deep.equal(fakeFolder);
    });

    it("should return undefined if no matching folder is found", async () => {
      sinon.stub(pool, "query").resolves({ rows: [] });

      const result = await updateFolder(999, "Renamed", 5);

      expect(result).to.be.undefined;
    });

    it("should log the error and rethrow it unchanged on failure", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await updateFolder(1, "Renamed", 5);
        throw new Error("Expected updateFolder to throw, but it did not");
      } catch (err) {
        expect(err).to.equal(dbError);
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error updating folder");
    });
  });

  describe("deleteFolder", () => {
    it("should delete a folder and return the deleted row", async () => {
      const fakeFolder = { id: 1, name: "Work", user_id: 5 };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeFolder] });

      const result = await deleteFolder(1, 5);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/DELETE FROM folders/);
      expect(values).to.deep.equal([1, 5]);
      expect(result).to.deep.equal(fakeFolder);
    });

    it("should log the error and rethrow it unchanged on failure (e.g. Postgres 23503)", async () => {
      const pgError = new Error("foreign key violation");
      pgError.code = "23503";
      sinon.stub(pool, "query").rejects(pgError);

      try {
        await deleteFolder(1, 5);
        throw new Error("Expected deleteFolder to throw, but it did not");
      } catch (err) {
        expect(err).to.equal(pgError);
        expect(err.code).to.equal("23503"); // confirms the original error, including its .code, survives
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error deleting folder");
    });
  });

  describe("getFolderById", () => {
    it("should query a folder by id and user, and return the first row", async () => {
      const fakeFolder = { id: 1, name: "Work", user_id: 5 };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeFolder] });

      const result = await getFolderById(1, 5);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/SELECT \*/);
      expect(queryText).to.match(/FROM folders/);
      expect(values).to.deep.equal([1, 5]);
      expect(result).to.deep.equal(fakeFolder);
    });

    it("should return undefined if no matching folder is found", async () => {
      sinon.stub(pool, "query").resolves({ rows: [] });

      const result = await getFolderById(999, 5);

      expect(result).to.be.undefined;
    });

    it("should log the error and rethrow it unchanged on failure", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await getFolderById(1, 5);
        throw new Error("Expected getFolderById to throw, but it did not");
      } catch (err) {
        expect(err).to.equal(dbError);
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error fetching folder");
    });
  });
});
