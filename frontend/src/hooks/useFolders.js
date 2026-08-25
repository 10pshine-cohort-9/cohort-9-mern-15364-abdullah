import { useEffect, useState } from "react";
import {
  createFolder,
  updateFolder,
  deleteFolder,
} from "../api/foldersApi.js";

const FOLDERS_STORAGE_KEY = "focusnote-folders";

function getFoldersStorageKey(userId) {
  return `${FOLDERS_STORAGE_KEY}-${userId}`;
}

function getStoredFolders(userId) {
  if (!userId) return [];

  try {
    const storedFolders = JSON.parse(
      localStorage.getItem(getFoldersStorageKey(userId)) || "[]",
    );

    if (!Array.isArray(storedFolders)) return [];

    const uniqueFolders = new Map();

    storedFolders.forEach((folder) => {
      const folderId = Number(folder.id);

      if (Number.isSafeInteger(folderId) && folder.name) {
        uniqueFolders.set(folderId, {
          id: folderId,
          name: folder.name,
        });
      }
    });

    return Array.from(uniqueFolders.values());
  } catch {
    return [];
  }
}

export const useFolders = (userId) => {
  const [folders, setFolders] = useState(() => getStoredFolders(userId));

  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        getFoldersStorageKey(userId),
        JSON.stringify(folders),
      );
    }
  }, [folders, userId]);

  return {
    folders,
    setFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  };
};
