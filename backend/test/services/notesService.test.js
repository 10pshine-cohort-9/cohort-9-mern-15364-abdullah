import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("notesService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createUserNote", () => {
    it("should create and return a note when the folder is valid", async () => {
      const { createUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().resolves({ id: 1, user_id: 5 }),
          },
          "../../src/repositories/notesRepository.js": {
            createNote: sinon
              .stub()
              .resolves({ id: 10, title: "Test", content: "Body" }),
          },
        },
      );

      const result = await createUserNote("Test", "Body", 5, 1);

      expect(result).to.deep.equal({ id: 10, title: "Test", content: "Body" });
    });

    it("should propagate 'Folder not found' (404) unchanged if folder does not exist", async () => {
      const { createUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().resolves(undefined),
          },
          "../../src/repositories/notesRepository.js": {
            createNote: sinon.stub().resolves({ id: 10 }),
          },
        },
      );

      try {
        await createUserNote("Test", "Body", 5, 1);
        throw new Error("Expected createUserNote to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Folder not found");
        expect(err.statusCode).to.equal(404);
      }
    });

    it("should propagate 'Failed to validate folder' (500) unchanged if folder lookup errors unexpectedly", async () => {
      const { createUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().rejects(new Error("DB down")),
          },
          "../../src/repositories/notesRepository.js": {
            createNote: sinon.stub().resolves({ id: 10 }),
          },
        },
      );

      try {
        await createUserNote("Test", "Body", 5, 1);
        throw new Error("Expected createUserNote to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Failed to validate folder");
        expect(err.statusCode).to.equal(500);
      }
    });

    it("should wrap a note-creation repository failure as 'Failed to create note' (500)", async () => {
      const { createUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().resolves({ id: 1, user_id: 5 }),
          },
          "../../src/repositories/notesRepository.js": {
            createNote: sinon.stub().rejects(new Error("Error creating note")),
          },
        },
      );

      try {
        await createUserNote("Test", "Body", 5, 1);
        throw new Error("Expected createUserNote to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Failed to create note");
        expect(err.statusCode).to.equal(500);
      }
    });
  });

  describe("getUserNotes", () => {
    it("should return the user's notes", async () => {
      const { getUserNotes } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/notesRepository.js": {
            getNotesByUserId: sinon.stub().resolves([{ id: 1 }, { id: 2 }]),
          },
        },
      );

      const result = await getUserNotes(5);

      expect(result).to.have.lengthOf(2);
    });

    it("should return an empty array if the user has no notes", async () => {
      const { getUserNotes } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/notesRepository.js": {
            getNotesByUserId: sinon.stub().resolves([]),
          },
        },
      );

      const result = await getUserNotes(5);

      expect(result).to.deep.equal([]);
    });

    it("should propagate a repository error unchanged (no wrapping)", async () => {
      const { getUserNotes } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/notesRepository.js": {
            getNotesByUserId: sinon
              .stub()
              .rejects(new Error("Error fetching notes")),
          },
        },
      );

      try {
        await getUserNotes(5);
        throw new Error("Expected getUserNotes to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Error fetching notes");
        expect(err.statusCode).to.be.undefined; // confirms it was NOT converted into an appError
      }
    });
  });

  describe("getUserNoteById", () => {
    it("should return the note if found", async () => {
      const { getUserNoteById } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/notesRepository.js": {
            getNoteById: sinon.stub().resolves({ id: 1, title: "Test" }),
          },
        },
      );

      const result = await getUserNoteById(1, 5);

      expect(result.title).to.equal("Test");
    });

    it("should throw 'Note not found' (404) if repository returns nothing", async () => {
      const { getUserNoteById } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/notesRepository.js": {
            getNoteById: sinon.stub().resolves(undefined),
          },
        },
      );

      try {
        await getUserNoteById(1, 5);
        throw new Error("Expected getUserNoteById to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Note not found");
        expect(err.statusCode).to.equal(404);
      }
    });
  });

  describe("updateUserNote", () => {
    it("should return the updated note when folder and note are valid", async () => {
      const { updateUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().resolves({ id: 1, user_id: 5 }),
          },
          "../../src/repositories/notesRepository.js": {
            updateNote: sinon.stub().resolves({ id: 10, title: "Updated" }),
          },
        },
      );

      const result = await updateUserNote(10, "Updated", "Body", 5, 1);

      expect(result.title).to.equal("Updated");
    });

    it("should propagate 'Folder not found' (404) unchanged if folder is invalid", async () => {
      const { updateUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().resolves(undefined),
          },
          "../../src/repositories/notesRepository.js": {
            updateNote: sinon.stub().resolves({ id: 10 }),
          },
        },
      );

      try {
        await updateUserNote(10, "Updated", "Body", 5, 1);
        throw new Error("Expected updateUserNote to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Folder not found");
        expect(err.statusCode).to.equal(404);
      }
    });

    it("should throw 'Note not found' (404) if repository returns nothing", async () => {
      const { updateUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().resolves({ id: 1, user_id: 5 }),
          },
          "../../src/repositories/notesRepository.js": {
            updateNote: sinon.stub().resolves(undefined),
          },
        },
      );

      try {
        await updateUserNote(10, "Updated", "Body", 5, 1);
        throw new Error("Expected updateUserNote to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Note not found");
        expect(err.statusCode).to.equal(404);
      }
    });

    it("should wrap an unknown update failure as 'Failed to update note' (500)", async () => {
      const { updateUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFolderById: sinon.stub().resolves({ id: 1, user_id: 5 }),
          },
          "../../src/repositories/notesRepository.js": {
            updateNote: sinon.stub().rejects(new Error("Error updating note")),
          },
        },
      );

      try {
        await updateUserNote(10, "Updated", "Body", 5, 1);
        throw new Error("Expected updateUserNote to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Failed to update note");
        expect(err.statusCode).to.equal(500);
      }
    });
  });

  describe("deleteUserNote", () => {
    it("should return the deleted note on success", async () => {
      const { deleteUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/notesRepository.js": {
            deleteNote: sinon
              .stub()
              .resolves({ id: 10, title: "Deleted Note" }),
          },
        },
      );

      const result = await deleteUserNote(10, 5);

      expect(result.title).to.equal("Deleted Note");
    });

    it("should throw 'Note not found' (404) if repository returns nothing", async () => {
      const { deleteUserNote } = await esmock(
        "../../src/services/notesService.js",
        {
          "../../src/repositories/notesRepository.js": {
            deleteNote: sinon.stub().resolves(undefined),
          },
        },
      );

      try {
        await deleteUserNote(10, 5);
        throw new Error("Expected deleteUserNote to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Note not found");
        expect(err.statusCode).to.equal(404);
      }
    });
  });
});
