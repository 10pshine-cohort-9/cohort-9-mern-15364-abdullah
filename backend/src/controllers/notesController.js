import {
  createUserNote,
  getUserNotes,
  getUserNoteById,
  updateUserNote,
  deleteUserNote,
} from "../services/notesService.js";
import logger from "../config/logger.js";

function validateNotePayload(title, content, folder_id) {
  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    title.trim() === "" ||
    content.trim() === ""
  ) {
    return {
      success: false,
      message: "Title and content are required",
    };
  }

  if (
    (typeof folder_id !== "number" &&
      (typeof folder_id !== "string" || !/^\d+$/.test(folder_id))) ||
    !Number.isSafeInteger(Number(folder_id)) ||
    Number(folder_id) <= 0
  ) {
    return {
      success: false,
      message: "Valid folder ID is required",
    };
  }

  return null;
}

async function createNote(req, res) {
  try {
    const { title, content, folder_id } = req.body;
    const validationError = validateNotePayload(title, content, folder_id);

    if (validationError) {
      return res.status(400).json(validationError);
    }
    const note = await createUserNote(
      title.trim(),
      content,
      req.user.id,
      Number(folder_id),
    );

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

async function getAllNotes(req, res) {
  try {
    const notes = await getUserNotes(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

async function getSingleNote(req, res) {
  try {
    const note = await getUserNoteById(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    logger.error({ err: error }, "Get note failed");
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

async function updateNote(req, res) {
  try {
    const { title, content, folder_id } = req.body;
    const validationError = validateNotePayload(title, content, folder_id);

    if (validationError) {
      return res.status(400).json(validationError);
    }
    const note = await updateUserNote(
      req.params.id,
      title,
      content,
      req.user.id,
      Number(folder_id),
    );

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

async function deleteNote(req, res) {
  try {
    await deleteUserNote(req.params.id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  }
}

export { createNote, getAllNotes, getSingleNote, updateNote, deleteNote };
