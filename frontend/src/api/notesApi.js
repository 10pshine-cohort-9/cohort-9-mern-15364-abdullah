import axios from "axios";

const notesClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/notes`,
  timeout: 15000,
});

function authHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getNotes(token) {
  try {
    const response = await notesClient.get("/", authHeaders(token));
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createNote(token, noteData) {
  try {
    const response = await notesClient.post("/", noteData, authHeaders(token));

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateNote(token, noteId, noteData) {
  try {
    const response = await notesClient.put(
      `/${noteId}`,
      noteData,
      authHeaders(token),
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteNote(token, noteId) {
  try {
    const response = await notesClient.delete(`/${noteId}`, authHeaders(token));

    return response.data;
  } catch (error) {
    throw error;
  }
}
