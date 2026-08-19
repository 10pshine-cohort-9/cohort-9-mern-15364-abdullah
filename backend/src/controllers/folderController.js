import {
  createUserFolder,
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

async function updateFolder(req, res) {
  try {
    const { name } = req.body;

    const validationError = await validateFolderName(name);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const folder = await updateUserFolder(
      req.params.id,
      name.trim(),
      req.user.id,
    );

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
    await deleteUserFolder(req.params.id, req.user.id);

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

export { createFolder, updateFolder, deleteFolder };
