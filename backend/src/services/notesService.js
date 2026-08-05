import {
  createNote,
  getNotesByUserId,
  getNoteById,
  updateNote,
  deleteNote,
} from "../repositories/notesRepository.js";
import appError from "../utils/appError.js";

async function createUserNote(title, content, userId) {
  const note = await createNote(title, content, userId);
  return note;
}

async function getUserNotes(userId) {
  const notes = await getNotesByUserId(userId);
  return notes;
}

async function getUserNoteById(noteId, userId) {
  const note = await getNoteById(noteId, userId);
  if (!note) {
    throw new appError("Note not found", 404);
  }
  return note;
}
 
async function updateUserNote(noteId, title, content, userId) {
  const note = await updateNote(noteId, title, content, userId);
  if (!note) {
    throw new appError("Note not found", 404);
  }
  return note;
}

async function deleteUserNote(noteId, userId) {
  const note = await deleteNote(noteId, userId);
  if (!note) {
    throw new appError("Note not found", 404);
  }
  return note;
}

export {
  createUserNote,
  getUserNotes,
  getUserNoteById,
  updateUserNote,
  deleteUserNote,
};
