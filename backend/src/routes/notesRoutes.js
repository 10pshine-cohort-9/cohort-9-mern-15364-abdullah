import {
  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createNote);
router.get("/", authenticate, getAllNotes);
router.get("/:id", authenticate, getSingleNote);
router.put("/:id", authenticate, updateNote);
router.delete("/:id", authenticate, deleteNote);

export default router;
