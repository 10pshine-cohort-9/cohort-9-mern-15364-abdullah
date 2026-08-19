import {
  createFolder,
  updateFolder,
  deleteFolder,
} from "../repositories/folderRepository.js";

import appError from "../utils/appError.js";

async function createUserFolder(name, userId) {
  try {
    const folder = await createFolder(name, userId);
    return folder;
  } catch (error) {
    if (error instanceof appError) {
      throw error;
    }
    throw new appError("Failed to create folder", 500);
  }
}

async function updateUserFolder(folderId, name, userId) {
  try {
    const folder = await updateFolder(folderId, name, userId);

    if (!folder) {
      throw new appError("Folder not found", 404);
    }
    return folder;
  } catch (error) {
    if (error instanceof appError) {
      throw error;
    }
    throw new appError("Failed to update folder", 500);
  }
}

async function deleteUserFolder(folderId, userId) {
  try {
    const folder = await deleteFolder(folderId, userId);

    if (!folder) {
      throw new appError("Folder not found", 404);
    }

    return folder;
  } catch (error) {
    if (error.code === "23503") {
      throw new appError("Cannot delete folder because it contains notes", 409);
    }

    throw error;
  }
}

export { createUserFolder, updateUserFolder, deleteUserFolder };
