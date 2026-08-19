import {
  createFolder,
  updateFolder,
  deleteFolder,
} from "../repositories/folderRepository.js";

import appError from "../utils/appError.js";

async function createUserFolder(name, userId) {
  const folder = await createFolder(name, userId);

  return folder;
}

async function updateUserFolder(folderId, name, userId) {
  const folder = await updateFolder(folderId, name, userId);

  if (!folder) {
    throw new appError("Folder not found", 404);
  }

  return folder;
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
      throw new appError(
        "Cannot delete folder because it contains notes",
        409,
      );
    }

    throw error;
  }
}

export {
  createUserFolder,
  updateUserFolder,
  deleteUserFolder,
};