import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";
import pool from "../../src/config/db.js";
import logger from "../../src/config/logger.js";
import { getFoldersByUserId } from "../../src/repositories/folderRepository.js";

describe("folderService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("createUserFolder", () => {
    it("should return the created folder on success", async () => {
      const { createUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            createFolder: sinon
              .stub()
              .resolves({ id: 1, name: "Work", user_id: 5 }),
          },
        },
      );

      const result = await createUserFolder("Work", 5);

      expect(result).to.deep.equal({ id: 1, name: "Work", user_id: 5 });
    });

    it("should wrap an unknown repository error as 'Failed to create folder' (500)", async () => {
      const { createUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            createFolder: sinon.stub().rejects(new Error("DB connection lost")),
          },
        },
      );

      try {
        await createUserFolder("Work", 5);
        throw new Error("Expected createUserFolder to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Failed to create folder");
        expect(err.statusCode).to.equal(500);
      }
    });
  });

  describe("getUserFolders", () => {
    it("should return the folders for the requested user", async () => {
      const { getUserFolders } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFoldersByUserId: sinon
              .stub()
              .resolves([{ id: 1, name: "Work", user_id: 5 }]),
          },
        },
      );

      const result = await getUserFolders(5);

      expect(result).to.deep.equal([{ id: 1, name: "Work", user_id: 5 }]);
    });

    it("should propagate repository retrieval errors", async () => {
      const dbError = new Error("DB connection lost");
      const { getUserFolders } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            getFoldersByUserId: sinon.stub().rejects(dbError),
          },
        },
      );

      try {
        await getUserFolders(5);
        throw new Error("Expected getUserFolders to throw, but it did not");
      } catch (err) {
        expect(err).to.equal(dbError);
      }
    });

    it("should query folders for a user through the repository", async () => {
      const fakeFolders = [{ id: 1, name: "Work", user_id: 5 }];
      const queryStub = sinon.stub(pool, "query").resolves({ rows: fakeFolders });
      const loggerStub = sinon.stub(logger, "error");

      const result = await getFoldersByUserId(5);

      expect(queryStub.firstCall.args[0]).to.match(/WHERE user_id = \$1/);
      expect(queryStub.firstCall.args[0]).to.match(/ORDER BY created_at ASC, id ASC/);
      expect(queryStub.firstCall.args[1]).to.deep.equal([5]);
      expect(result).to.deep.equal(fakeFolders);
      expect(loggerStub.called).to.be.false;
    });

    it("should log and rethrow repository query errors", async () => {
      const dbError = new Error("connection refused");
      sinon.stub(pool, "query").rejects(dbError);
      const loggerStub = sinon.stub(logger, "error");

      try {
        await getFoldersByUserId(5);
        throw new Error("Expected getFoldersByUserId to throw, but it did not");
      } catch (err) {
        expect(err).to.equal(dbError);
      }

      expect(loggerStub.calledOnce).to.be.true;
      expect(loggerStub.firstCall.args[1]).to.equal("Error fetching user folders");
    });
  });

  describe("updateUserFolder", () => {
    it("should return the updated folder on success", async () => {
      const { updateUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            updateFolder: sinon
              .stub()
              .resolves({ id: 1, name: "Renamed", user_id: 5 }),
          },
        },
      );

      const result = await updateUserFolder(1, "Renamed", 5);

      expect(result.name).to.equal("Renamed");
    });

    it("should throw 'Folder not found' (404) if repository returns nothing", async () => {
      const { updateUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            updateFolder: sinon.stub().resolves(undefined),
          },
        },
      );

      try {
        await updateUserFolder(1, "Renamed", 5);
        throw new Error("Expected updateUserFolder to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Folder not found");
        expect(err.statusCode).to.equal(404);
      }
    });

    it("should wrap an unknown repository error as 'Failed to update folder' (500)", async () => {
      const { updateUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            updateFolder: sinon.stub().rejects(new Error("DB connection lost")),
          },
        },
      );

      try {
        await updateUserFolder(1, "Renamed", 5);
        throw new Error("Expected updateUserFolder to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Failed to update folder");
        expect(err.statusCode).to.equal(500);
      }
    });
  });

  describe("deleteUserFolder", () => {
    it("should return the deleted folder on success", async () => {
      const { deleteUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            deleteFolder: sinon
              .stub()
              .resolves({ id: 1, name: "Work", user_id: 5 }),
          },
        },
      );

      const result = await deleteUserFolder(1, 5);

      expect(result).to.deep.equal({ id: 1, name: "Work", user_id: 5 });
    });

    it("should throw 'Folder not found' (404) if repository returns nothing", async () => {
      const { deleteUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            deleteFolder: sinon.stub().resolves(undefined),
          },
        },
      );

      try {
        await deleteUserFolder(1, 5);
        throw new Error("Expected deleteUserFolder to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("Folder not found");
        expect(err.statusCode).to.equal(404);
      }
    });

    it("should convert a Postgres 23503 error into 'Cannot delete folder because it contains notes' (409)", async () => {
      const pgError = new Error("foreign key violation");
      pgError.code = "23503";

      const { deleteUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            deleteFolder: sinon.stub().rejects(pgError),
          },
        },
      );

      try {
        await deleteUserFolder(1, 5);
        throw new Error("Expected deleteUserFolder to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal(
          "Cannot delete folder because it contains notes",
        );
        expect(err.statusCode).to.equal(409);
      }
    });

    it("should rethrow an unrelated repository error unchanged (not wrapped as 500)", async () => {
      const dbError = new Error("DB connection lost");

      const { deleteUserFolder } = await esmock(
        "../../src/services/folderService.js",
        {
          "../../src/repositories/folderRepository.js": {
            deleteFolder: sinon.stub().rejects(dbError),
          },
        },
      );

      try {
        await deleteUserFolder(1, 5);
        throw new Error("Expected deleteUserFolder to throw, but it did not");
      } catch (err) {
        expect(err.message).to.equal("DB connection lost");
        expect(err.statusCode).to.be.undefined; // confirms it was NOT converted into an appError
      }
    });
  });
});
