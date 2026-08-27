import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

function createRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
}

describe("folderController", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createFolder", () => {
    it("should return 201 with the created folder on success", async () => {
         const createUserFolderStub = sinon.stub().resolves({ id: 1, name: "Work" });
      const { createFolder } = await esmock("../../src/controllers/folderController.js", {
        "../../src/services/folderService.js": {
          createUserFolder: createUserFolderStub,
        },
      });
      const req = { body: { name: "  Work  " }, user: { id: 5 } };
      const res = createRes();

      await createFolder(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(createUserFolderStub.calledWith("Work", 5)).to.be.true;
    });

  });

  describe("updateFolder", () => {
    it("should return 400 for an invalid folder ID", async () => {
      const { updateFolder } = await esmock("../../src/controllers/folderController.js", {
        "../../src/services/folderService.js": { updateUserFolder: sinon.stub() },
      });
      const req = { body: { name: "Renamed" }, params: { id: "abc" }, user: { id: 5 } };
      const res = createRes();

      await updateFolder(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ success: false, message: "Invalid folder ID" })).to.be.true;
    });

    it("should return 200 with the updated folder on success", async () => {
          const updateUserFolderStub = sinon.stub().resolves({ id: 1, name: "Renamed" });
      const { updateFolder } = await esmock("../../src/controllers/folderController.js", {
        "../../src/services/folderService.js": {
          updateUserFolder: updateUserFolderStub,
        },
      });
      const req = { body: { name: "Renamed" }, params: { id: "1" }, user: { id: 5 } };
      const res = createRes();

      await updateFolder(req, res);

      expect(res.status.calledWith(200)).to.be.true;
       expect(updateUserFolderStub.calledWith(1, "Renamed", 5)).to.be.true; 
    });
  });

  describe("deleteFolder", () => {
    it("should return 200 on successful deletion", async () => {
        const deleteUserFolderStub = sinon.stub().resolves({ id: 1 });
      const { deleteFolder } = await esmock("../../src/controllers/folderController.js", {
        "../../src/services/folderService.js": {
          deleteUserFolder: deleteUserFolderStub,
        },
      });
      const req = { params: { id: "1" }, user: { id: 5 } };
      const res = createRes();

      await deleteFolder(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(deleteUserFolderStub.calledWith(1, 5)).to.be.true;
    });

    it("should return 409 when the service rejects due to notes in the folder", async () => {
      const err = new Error("Cannot delete folder because it contains notes");
      err.statusCode = 409;
      const { deleteFolder } = await esmock("../../src/controllers/folderController.js", {
        "../../src/services/folderService.js": {
          deleteUserFolder: sinon.stub().rejects(err),
        },
      });
      const req = { params: { id: "1" }, user: { id: 5 } };
      const res = createRes();

      await deleteFolder(req, res);

      expect(res.status.calledWith(409)).to.be.true;
    });
  });
});