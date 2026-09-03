import {
  createUserFolder,
  getUserFolders,
  updateUserFolder,
  deleteUserFolder,
} from "../services/folderService.js";

async function validateFolderName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    return {
      success: false,
      message: "Folder name is required",
    };
  }

  return null;
}

function parseFolderId(id) {
  const parsedId = Number(id);

  if (!/^\d+$/.test(id) || !Number.isSafeInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

async function createFolder(req, res) {
  try {
    const { name } = req.body;

    const validationError = await validateFolderName(name);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const folder = await createUserFolder(name.trim(), req.user.id);

    return res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: folder,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

async function getFolders(req, res) {
  try {
    const folders = await getUserFolders(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Folders fetched successfully",
      data: folders,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

async function updateFolder(req, res) {
  try {
    const { name } = req.body;

    const validationError = await validateFolderName(name);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const folderId = parseFolderId(req.params.id);

    if (folderId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid folder ID",
      });
    }

    const folder = await updateUserFolder(folderId, name.trim(), req.user.id);

    return res.status(200).json({
      success: true,
      message: "Folder updated successfully",
      data: folder,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

async function deleteFolder(req, res) {
  try {
    const folderId = parseFolderId(req.params.id);

    if (folderId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid folder ID",
      });
    }
    await deleteUserFolder(folderId, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

export { createFolder, getFolders, updateFolder, deleteFolder };
