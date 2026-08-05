import {
  createUserNote,
  getUserNotes,
  getUserNoteById,
  updateUserNote,
  deleteUserNote,
} from "../services/notesService.js";
import logger from "../config/logger.js";

function validateNotePayload(title, content) {
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

  return null;
}

async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const validationError = validateNotePayload(title, content);

    if (validationError) {
      return res.status(400).json(validationError);
    }
    const note = await createUserNote(title, content, req.user.id);

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
    const { title, content } = req.body;
    const validationError = validateNotePayload(title, content);

    if (validationError) {
      return res.status(400).json(validationError);
    }
    const note = await updateUserNote(
      req.params.id,
      title,
      content,
      req.user.id,
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
