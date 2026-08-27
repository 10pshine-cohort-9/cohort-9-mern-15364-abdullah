import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

function createRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe("notesController", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createNote", () => {
    it("should return 201 with the created note on success", async () => {
        const createUserNoteStub = sinon.stub().resolves({ id: 1, title: "Test" });
      const { createNote } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            createUserNote: createUserNoteStub,
          },
        },
      );
      const req = {
        body: { title: "Test", content: "Body", folder_id: "1" },
        user: { id: 5 },
      };
      const res = createRes();

      await createNote(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(createUserNoteStub.calledWith("Test", "Body", 5, 1)).to.be.true;
    });

    it("should return 400 if title/content are missing", async () => {
      const { createNote } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            createUserNote: sinon.stub(),
          },
        },
      );
      const req = {
        body: { title: "", content: "", folder_id: "1" },
        user: { id: 5 },
      };
      const res = createRes();

      await createNote(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe("getAllNotes", () => {
    it("should return 200 with the users notes", async () => {
        const getUserNotesStub = sinon.stub().resolves([{ id: 1 }, { id: 2 }]);
      const { getAllNotes } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            getUserNotes: getUserNotesStub,
          },
        },
      );
      const req = { user: { id: 5 } };
      const res = createRes();

      await getAllNotes(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.firstCall.args[0].data).to.have.lengthOf(2);
       expect(getUserNotesStub.calledWith(5)).to.be.true; 
    });
  });

  describe("getSingleNote", () => {
    it("should return 200 with the note on success", async () => {
         const getUserNoteByIdStub = sinon.stub().resolves({ id: 1, title: "Test" });
      const { getSingleNote } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            getUserNoteById: getUserNoteByIdStub,
          },
        },
      );
      const req = { params: { id: "1" }, user: { id: 5 } };
      const res = createRes();

      await getSingleNote(req, res);

      expect(res.status.calledWith(200)).to.be.true;
       expect(getUserNoteByIdStub.calledWith("1", 5)).to.be.true;
    });

    it("should return 404 if the note is not found", async () => {
      const err = new Error("Note not found");
      err.statusCode = 404;
      const { getSingleNote } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            getUserNoteById: sinon.stub().rejects(err),
          },
        },
      );
      const req = { params: { id: "999" }, user: { id: 5 } };
      const res = createRes();

      await getSingleNote(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe("updateNote", () => {
    it("should return 200 with the updated note on success", async () => {
         const updateUserNoteStub = sinon.stub().resolves({ id: 1, title: "Updated" });
      const { updateNote } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            updateUserNote: updateUserNoteStub,
          },
        },
      );
      const req = {
        params: { id: "1" },
        body: { title: "Updated", content: "Body", folder_id: "1" },
        user: { id: 5 },
      };
      const res = createRes();

      await updateNote(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(updateUserNoteStub.calledWith("1", "Updated", "Body", 5, 1)).to.be.true;
    });
  });

  describe("deleteNote", () => {
    it("should return 200 on successful deletion", async () => {
        const deleteUserNoteStub = sinon.stub().resolves({ id: 1 });
      const { deleteNote } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            deleteUserNote: deleteUserNoteStub,
          },
        },
      );
      const req = { params: { id: "1" }, user: { id: 5 } };
      const res = createRes();

      await deleteNote(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(deleteUserNoteStub.calledWith("1", 5)).to.be.true;
    });

    it("should return 404 if the note is not found", async () => {
      const err = new Error("Note not found");
      err.statusCode = 404;
      const { deleteNote } = await esmock(
        "../../src/controllers/notesController.js",
        {
          "../../src/services/notesService.js": {
            deleteUserNote: sinon.stub().rejects(err),
          },
        },
      );
      const req = { params: { id: "999" }, user: { id: 5 } };
      const res = createRes();

      await deleteNote(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
