import { useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/notesApi.js";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      const token = localStorage.getItem("token");

      if (!token) {
        setNotesError("Authentication token not found.");
        setNotesLoading(false);
        return;
      }

      try {
        setNotesLoading(true);
        setNotesError("");

        const response = await getNotes(token);

        setNotes(response.data);
      } catch (error) {
        setNotesError(
          error.response?.data?.message ||
            "Failed to load notes. Please try again.",
        );
      } finally {
        setNotesLoading(false);
      }
    }

    fetchNotes();
  }, []);

  return {
    notes,
    setNotes,
    notesLoading,
    notesError,
    createNote,
    updateNote,
    deleteNote,
  };
};
