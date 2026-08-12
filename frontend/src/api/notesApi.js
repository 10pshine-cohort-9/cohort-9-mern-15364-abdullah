import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/notes`;

export async function getNotes(token) {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createNote(token, noteData) {
  try {
    const response = await axios.post(`${BASE_URL}`, noteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateNote(token, noteId, noteData) {
  try {
    const response = await axios.put(`${BASE_URL}/${noteId}`, noteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteNote(token, noteId) {
  try {
    const response = await axios.delete(`${BASE_URL}/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
