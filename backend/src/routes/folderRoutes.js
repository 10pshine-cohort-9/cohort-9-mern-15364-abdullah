import express from "express";
import {
  createFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createFolder);
router.put("/:id", authenticate, updateFolder);
router.delete("/:id", authenticate, deleteFolder);

export default router;
