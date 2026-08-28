import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/folders`;

export async function getFolders(token) {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createFolder(token, name) {
  try {
    const response = await axios.post(
      BASE_URL,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateFolder(token, folderId, name) {
  try {
    const response = await axios.put(
      `${BASE_URL}/${folderId}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteFolder(token, folderId) {
  try {
    const response = await axios.delete(`${BASE_URL}/${folderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}