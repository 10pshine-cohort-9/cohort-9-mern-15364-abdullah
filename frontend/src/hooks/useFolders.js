import { useEffect, useRef, useState } from "react";
import {
  getFolders,
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
  const loadedUserIdRef = useRef(userId);
  const pendingUserIdRef = useRef(null);

  useEffect(() => {
    if (loadedUserIdRef.current === userId) return;

    loadedUserIdRef.current = userId;
    pendingUserIdRef.current = userId;
    setFolders(getStoredFolders(userId));
  }, [userId]);

  useEffect(() => {
    if (!userId || pendingUserIdRef.current === userId) {
      pendingUserIdRef.current = null;
      return;
    }

    localStorage.setItem(
      getFoldersStorageKey(userId),
      JSON.stringify(folders),
    );
  }, [folders, userId]);

  useEffect(() => {
    if (!userId) return;

    async function fetchFolders() {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await getFolders(token);
        const fetchedFolders = Array.isArray(response?.data)
          ? response.data
          : [];

        setFolders(
          fetchedFolders
            .map((folder) => ({ id: Number(folder.id), name: folder.name }))
            .filter(
              (folder) =>
                Number.isSafeInteger(folder.id) && Boolean(folder.name),
            ),
        );
      } catch {
        // Keep the user-scoped cached folders when the server is unavailable.
      }
    }

    fetchFolders();
  }, [userId]);

  return {
    folders,
    setFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  };
};
