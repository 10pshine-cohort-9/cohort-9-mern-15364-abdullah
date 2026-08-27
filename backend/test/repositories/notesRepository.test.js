// test/repositories/notesRepository.test.js
import { expect } from "chai";
import sinon from "sinon";
import pool from "../../src/config/db.js";
import logger from "../../src/config/logger.js";
import {
  createNote,
  getNotesByUserId,
  getNoteById,
  updateNote,
  deleteNote,
} from "../../src/repositories/notesRepository.js";

describe("notesRepository", () => {
  let loggerStub;

  beforeEach(() => {
    loggerStub = sinon.stub(logger, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createNote", () => {
    it("should insert a note and return the created row", async () => {
      const fakeNote = {
        id: 1,
        title: "Test",
        content: "Body",
        user_id: 5,
        folder_id: 2,
      };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeNote] });

      const result = await createNote("Test", "Body", 5, 2);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/INSERT INTO notes/);
      expect(queryText).to.match(/RETURNING \*/);
      expect(values).to.deep.equal(["Test", "Body", 5, 2]);
      expect(result).to.deep.equal(fakeNote);
    });

    it("should log the original error but throw a new generic error, discarding the original", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await createNote("Test", "Body", 5, 2);
        throw new Error("Expected createNote to throw, but it did not");
      } catch (err) {
        expect(err).to.not.equal(dbError); // NOT the same error object
        expect(err.message).to.equal("Error creating note"); // generic replacement message
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[0]).to.deep.equal({ err: dbError }); // original error was logged
      expect(loggerStub.firstCall.args[1]).to.equal("Error creating note");
    });
  });

  describe("getNotesByUserId", () => {
    it("should query notes by user id, ordered by created_at, and return all rows", async () => {
      const fakeNotes = [{ id: 1 }, { id: 2 }];
      const queryStub = sinon.stub(pool, "query").resolves({ rows: fakeNotes });

      const result = await getNotesByUserId(5);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/SELECT \*/);
      expect(queryText).to.match(/FROM notes/);
      expect(queryText).to.match(/WHERE user_id = \$1/);
      expect(queryText).to.match(/ORDER BY created_at DESC/);
      expect(values).to.deep.equal([5]);
      expect(result).to.deep.equal(fakeNotes);
    });

    it("should return an empty array if the user has no notes", async () => {
      sinon.stub(pool, "query").resolves({ rows: [] });

      const result = await getNotesByUserId(5);

      expect(result).to.deep.equal([]);
    });

    it("should log the original error but throw a new generic error, discarding the original", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await getNotesByUserId(5);
        throw new Error("Expected getNotesByUserId to throw, but it did not");
      } catch (err) {
        expect(err).to.not.equal(dbError);
        expect(err.message).to.equal("Error fetching notes");
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error fetching notes");
    });
  });

  describe("getNoteById", () => {
    it("should query a note by id and user, and return the first row", async () => {
      const fakeNote = { id: 1, title: "Test" };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeNote] });

      const result = await getNoteById(1, 5);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/SELECT \*/);
      expect(queryText).to.match(/FROM notes/);
      expect(values).to.deep.equal([1, 5]);
      expect(result).to.deep.equal(fakeNote);
    });

    it("should return undefined if no matching note is found", async () => {
      sinon.stub(pool, "query").resolves({ rows: [] });

      const result = await getNoteById(999, 5);

      expect(result).to.be.undefined;
    });

    it("should log the original error but throw a new generic error, discarding the original", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await getNoteById(1, 5);
        throw new Error("Expected getNoteById to throw, but it did not");
      } catch (err) {
        expect(err).to.not.equal(dbError);
        expect(err.message).to.equal("Error fetching note");
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error fetching note");
    });
  });

  describe("updateNote", () => {
    it("should update a note and return the updated row", async () => {
      const fakeNote = { id: 1, title: "Updated", content: "New body" };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeNote] });

      const result = await updateNote(1, "Updated", "New body", 5, 2);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/UPDATE notes/);
      expect(queryText).to.match(/RETURNING \*/);
      // repo builds values as [title, content, folder_id, noteId, userId]
      expect(values).to.deep.equal(["Updated", "New body", 2, 1, 5]);
      expect(result).to.deep.equal(fakeNote);
    });

    it("should log the original error but throw a new generic error, discarding the original", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await updateNote(1, "Updated", "New body", 5, 2);
        throw new Error("Expected updateNote to throw, but it did not");
      } catch (err) {
        expect(err).to.not.equal(dbError);
        expect(err.message).to.equal("Error updating note");
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error updating note");
    });
  });

  describe("deleteNote", () => {
    it("should delete a note and return the deleted row", async () => {
      const fakeNote = { id: 1, title: "Deleted Note" };
      const queryStub = sinon
        .stub(pool, "query")
        .resolves({ rows: [fakeNote] });

      const result = await deleteNote(1, 5);

      const [queryText, values] = queryStub.firstCall.args;
      expect(queryText).to.match(/DELETE FROM notes/);
      expect(values).to.deep.equal([1, 5]);
      expect(result).to.deep.equal(fakeNote);
    });

    it("should return undefined if no matching note is found", async () => {
      sinon.stub(pool, "query").resolves({ rows: [] });

      const result = await deleteNote(999, 5);

      expect(result).to.be.undefined;
    });

    it("should log the original error but throw a new generic error, discarding the original", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);

      try {
        await deleteNote(1, 5);
        throw new Error("Expected deleteNote to throw, but it did not");
      } catch (err) {
        expect(err).to.not.equal(dbError);
        expect(err.message).to.equal("Error deleting note");
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error deleting note");
    });
  });
});
