import express from "express";
import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getFolders);
router.post("/", authenticate, createFolder);
router.put("/:id", authenticate, updateFolder);
router.delete("/:id", authenticate, deleteFolder);

export default router;
