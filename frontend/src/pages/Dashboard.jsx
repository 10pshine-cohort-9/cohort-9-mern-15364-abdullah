import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/notesApi.js";
import { createFolder, updateFolder, deleteFolder } from "../api/foldersApi.js";
import RichTextEditor from "../components/richTextEditor.jsx";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [selectedFolder, setSelectedFolder] = useState("All Notes");
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [notesError, setNotesError] = useState("");

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
  });
  const [creatingNote, setCreatingNote] = useState(false);
  const [createNoteError, setCreateNoteError] = useState("");

  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [deleteFolderError, setDeleteFolderError] = useState("");

  const [deleteNoteTarget, setDeleteNoteTarget] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const cancelDeleteButtonRef = useRef(null);
  const deleteTriggerRef = useRef(null);

  useEffect(() => {
    if (deleteNoteTarget) {
      cancelDeleteButtonRef.current?.focus();
    } else {
      deleteTriggerRef.current?.focus();
    }
  }, [deleteNoteTarget]);

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

  const [folders, setFolders] = useState(() => getStoredFolders(user?.id));

  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");

  const [deleteFolderTarget, setDeleteFolderTarget] = useState(null);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(
        getFoldersStorageKey(user.id),
        JSON.stringify(folders),
      );
    }
  }, [folders, user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;

    setNewNote((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();

    const folderName = newFolder.trim();

    if (!folderName) return;

    const alreadyExists = folders.some(
      (folder) => folder.name.toLowerCase() === folderName.toLowerCase(),
    );

    if (alreadyExists) {
      setNewFolder("");
      setShowFolderInput(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    try {
      const response = await createFolder(token, folderName);

      const createdFolder = response.data;

      setFolders((currentFolders) => [
        ...currentFolders.filter((folder) => folder.id !== createdFolder.id),
        { id: createdFolder.id, name: createdFolder.name },
      ]);

      setNewFolder("");
      setShowFolderInput(false);
    } catch (error) {
      console.error("Failed to create folder:", error.response?.data || error);
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setEditFolderName(folder.name);
  };

  const handleUpdateFolder = async (e) => {
    e.preventDefault();

    const updatedName = editFolderName.trim();

    if (!updatedName) return;

    const alreadyExists = folders.some(
      (folder) =>
        folder.name.toLowerCase() === updatedName.toLowerCase() &&
        folder.id !== editingFolder.id,
    );

    if (alreadyExists) return;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    try {
      const response = await updateFolder(token, editingFolder.id, updatedName);

      const updatedFolder = response.data;

      setFolders((currentFolders) =>
        currentFolders.map((folder) =>
          folder.id === editingFolder.id
            ? {
                ...folder,
                name: updatedFolder.name,
              }
            : folder,
        ),
      );

      // Keep the currently selected folder working after rename
      if (selectedFolder === editingFolder.name) {
        setSelectedFolder(updatedFolder.name);
      }

      setEditingFolder(null);
      setEditFolderName("");
    } catch (error) {
      console.error("Failed to update folder:", error.response?.data || error);
    }
  };

  const selectedFolderData = folders.find(
    (folder) => folder.name === selectedFolder,
  );

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesFolder =
        selectedFolder === "All Notes" ||
        Number(note.folder_id) === Number(selectedFolderData?.id);

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        note.title.toLowerCase().includes(searchText) ||
        note.content.toLowerCase().includes(searchText);

      return matchesFolder && matchesSearch;
    });
  }, [notes, selectedFolder, selectedFolderData, search]);

  const handleConfirmDeleteFolder = async () => {
    const token = localStorage.getItem("token");

    if (!token || !deleteFolderTarget) return;

    try {
      setDeleteFolderError("");
      setActionError("");
      await deleteFolder(token, deleteFolderTarget.id);

      if (selectedFolder === deleteFolderTarget.name) {
        setSelectedFolder("All Notes");
      }

      setFolders((currentFolders) =>
        currentFolders.filter((folder) => folder.id !== deleteFolderTarget.id),
      );
      setNotes((currentNotes) =>
        currentNotes.filter(
          (note) => Number(note.folder_id) !== Number(deleteFolderTarget.id),
        ),
      );
      setDeleteFolderTarget(null);
    } catch {
      setDeleteFolderError("Unable to delete this folder. Please try again.");
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();

    if (selectedFolder === "All Notes") {
      setCreateNoteError("Please create and select a category before creating a note.");
      return;
    }

    const title = newNote.title.trim();
    const content = newNote.content.trim();

    if (!title || !content) {
      setCreateNoteError("Title and content are required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setCreateNoteError("Authentication token not found.");
      return;
    }

    try {
      setCreatingNote(true);
      setCreateNoteError("");

      const selectedFolderData = folders.find(
        (folder) => folder.name === selectedFolder,
      );

      if (!selectedFolderData) {
        setCreateNoteError("Please create and select a category before creating a note.");
        return;
      }

      const response = await createNote(token, {
        title,
        content,
        folder_id: selectedFolderData.id,
      });

      // Add the newly created note to the current list
      setNotes((currentNotes) => [response.data, ...currentNotes]);

      // Reset form
      setNewNote({
        title: "",
        content: "",
      });

      setShowNoteForm(false);
    } catch (error) {
      setCreateNoteError(
        error.response?.data?.message ||
          "Failed to create note. Please try again.",
      );
    } finally {
      setCreatingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      setDeletingNoteId(noteId);
      setActionError("");

      await deleteNote(token, noteId);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== noteId),
      );

      setDeleteNoteTarget(null);
    } catch (error) {
      setActionError(error.response?.data?.message || "Failed to delete note.");
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setActionError("");
  };

  const closeEditNoteModal = () => {
    setEditingNote(null);
    setEditTitle("");
    setEditContent("");
    setActionError("");
  };

  const closeEditFolderModal = () => {
    setEditingFolder(null);
    setEditFolderName("");
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      setActionError("");

      const response = await updateNote(token, editingNote.id, {
        title: editTitle,
        content: editContent,
        folder_id: editingNote.folder_id,
      });

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingNote.id ? response.data : note,
        ),
      );

      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      setActionError(error.response?.data?.message || "Failed to update note.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      {/*  DESKTOP SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-white/10 bg-[#0d1218] lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <span className="text-xl font-bold tracking-tight text-white">
            Focus<span className="text-orange-500">Note</span>
          </span>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* All Notes */}
          <button
            onClick={() => setSelectedFolder("All Notes")}
            className={`mb-6 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
              selectedFolder === "All Notes"
                ? "bg-orange-500 font-medium text-black"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <span>▤</span>
              All Notes
            </span>
          </button>

          {/* Categories heading */}
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Categories
            </p>

            <button
              onClick={() => setShowFolderInput(true)}
              className="text-lg text-gray-500 transition hover:text-orange-500"
              title="Create category"
            >
              +
            </button>
          </div>

          {/* Folder list */}
          <div className="space-y-1">
            {folders.map((folder) => (
              <div key={folder.id}>
                <div
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
                    selectedFolder === folder.name
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {/* Folder name */}
                  <button
                    onClick={() => setSelectedFolder(folder.name)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="truncate">{folder.name}</span>
                  </button>

                  {/* Count / Actions */}
                  <div className="flex items-center gap-1">
                    <div className="hidden items-center gap-1 group-hover:flex">
                      <button
                        type="button"
                        onClick={() => handleEditFolder(folder)}
                        className="rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-white/10 hover:text-white"
                        title="Edit folder"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          const notesInFolder = notes.filter(
                            (note) => Number(note.folder_id) === Number(folder.id),
                          );

                          if (notesInFolder.length > 0) {
                            setDeleteFolderTarget({
                              ...folder,
                              notes: notesInFolder,
                            });
                            setDeleteFolderError("");
                            return;
                          }

                          setDeleteFolderTarget(folder);
                          setDeleteFolderError("");
                        }}
                        className="rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                        title="Delete folder"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/*  MAIN CONTENT */}

      <main className="min-h-screen lg:ml-64">
        {/*  TOP HEADER */}

        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b0f14]/95 backdrop-blur m-auto ">
          <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
            {/* Mobile logo */}
            <div className="flex items-center lg:hidden">
              <span className="font-bold text-white">
                Focus<span className="text-orange-500">Note</span>
              </span>
            </div>

            {/* Search */}
            <div className="relative left-10 mx-auto w-full max-w-2xl lg:mx-0">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full rounded-xl border border-white/10 bg-[#151b23] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#f5a623]/60 focus:ring-2 focus:ring-[#f5a623]/10"
              />
            </div>

            {/* Profile */}
            <div
              className="relative ml-auto flex items-center gap-3"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              

              <button
                type="button"
                onClick={() => setShowProfile((current) => !current)}
                aria-expanded={showProfile}
                aria-haspopup="menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-semibold text-white transition hover:scale-105"
              >
                {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </button>

              {showProfile && (
                <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-white/10 bg-[#171d25] p-2 shadow-2xl">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="text-sm font-medium text-white">
                      {user?.full_name || "User"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user?.email || ""}
                    </p>
                  </div>

                  <button className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5">
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-red-400 hover:bg-red-400/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/*  PAGE CONTENT */}

        <div className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {/* Welcome */}
          <div className="mb-7">
            <p className="text-sm text-gray-500">Welcome back</p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {user?.full_name || "Your Notes"}
            </h1>
          </div>

          {/*  MOBILE FOLDER CHIPS */}

          <div className="mb-7 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <button
              onClick={() => setSelectedFolder("All Notes")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                selectedFolder === "All Notes"
                  ? "bg-orange-500 text-black"
                  : "bg-[#1b212a] text-gray-300 hover:bg-white/10"
              }`}
            >
              All Notes
            </button>

            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.name)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                  selectedFolder === folder.name
                    ? "bg-orange-500 text-black"
                    : "bg-[#1b212a] text-gray-300 hover:bg-white/10"
                }`}
              >
                {folder.name}
              </button>
            ))}

            <button
              onClick={() => setShowFolderInput(true)}
              className="shrink-0 rounded-full bg-[#1b212a] px-4 py-2 text-lg text-orange-500 hover:bg-white/10"
            >
              +
            </button>
          </div>

          {/*  FOLDER CREATION MODAL */}

          {showFolderInput && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
              <div
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151b23] p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Create New Category
                  </h3>

                  <button
                    type="button"
                    onClick={() => {
                      setNewFolder("");
                      setShowFolderInput(false);
                    }}
                    className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    aria-label="Close create folder form"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateFolder} className="space-y-4">
                  <input
                    autoFocus
                    type="text"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    placeholder="Category name"
                    className="w-full rounded-xl bg-[#0d1218] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-orange-500"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNewFolder("");
                        setShowFolderInput(false);
                      }}
                      className="rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-black"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/*  NOTE CREATION MODAL */}

          {showNoteForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
              <div
                className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#151b23] p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Create New Note
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Add a title and content for your note.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowNoteForm(false);
                      setCreateNoteError("");
                    }}
                    className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    aria-label="Close create note form"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateNote} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={newNote.title}
                    onChange={handleNoteChange}
                    placeholder="Note title"
                    className="w-full rounded-xl border border-white/10 bg-[#0d1218] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-orange-500/60"
                  />

                  <RichTextEditor
                    content={newNote.content}
                    onChange={(content) =>
                      setNewNote((current) => ({
                        ...current,
                        content,
                      }))
                    }
                  />

                  {createNoteError && (
                    <p className="text-sm text-red-400">{createNoteError}</p>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNoteForm(false);
                        setCreateNoteError("");
                      }}
                      className="rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={creatingNote}
                      className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {creatingNote ? "Creating..." : "Create Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {editingFolder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
              <div
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151b23] p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Edit Category
                  </h3>

                  <button
                    type="button"
                    onClick={closeEditFolderModal}
                    className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    aria-label="Close edit folder form"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdateFolder} className="space-y-4">
                  <input
                    autoFocus
                    type="text"
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    className="w-full rounded-xl bg-[#0d1218] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-orange-500"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeEditFolderModal}
                      className="rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-black"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editingNote && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
              <div
                className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#151b23] p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Edit Note</h3>

                  <button
                    type="button"
                    onClick={closeEditNoteModal}
                    className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    aria-label="Close edit note form"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdateNote} className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl bg-[#0d1218] px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-orange-500"
                    placeholder="Note title"
                  />

                  <RichTextEditor content={editContent} onChange={setEditContent} />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeEditNoteModal}
                      className="rounded-xl bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-black"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/*  NOTES HEADER  */}

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selectedFolder}</h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"}
              </p>
            </div>

            <button
              onClick={() => {
                setCreateNoteError("");
                setShowNoteForm(true);
              }}
              className="hidden rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-orange-500 sm:block"
            >
              + New Note
            </button>
          </div>

          {/* NOTES GRID*/}

          {notesLoading ? (
            <p className="py-16 text-center text-sm text-gray-500">
              Loading notes...
            </p>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredNotes.map((note) => (
                <article
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedNote(note);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="group flex h-full min-h-45 cursor-pointer flex-col rounded-2xl border border-white/10 bg-[#171d25] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#f5a623]/30 hover:bg-[#1b222c]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-base font-semibold text-white">
                      {note.title}
                    </h3>

                    {note.folder && (
                      <span className="shrink-0 rounded-full bg-[#f5a623]/10 px-2.5 py-1 text-[11px] font-medium text-orange-500">
                        #{note.folder}
                      </span>
                    )}
                  </div>

                  <div
                    className="mt-4 line-clamp-4 flex-1 overflow-hidden text-sm leading-6 text-gray-400"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />

                  <div className="mt-auto flex shrink-0 items-center justify-between pt-6">
                    <span className="text-xs text-gray-600">
                      {note.created_at
                        ? new Date(note.created_at).toLocaleDateString()
                        : ""}
                    </span>

                    <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditNote(note);
                        }}
                        className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-gray-400 hover:bg-white/10 hover:text-white"
                        title="Edit note"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteTriggerRef.current = event.currentTarget;
                          setDeleteNoteTarget(note);
                        }}
                        disabled={deletingNoteId === note.id}
                        className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-gray-400 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete note"
                      >
                        {deletingNoteId === note.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#11161d] px-6 py-16 text-center">
              <h3 className="text-lg font-medium">No notes found</h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another search or create a new note.
              </p>
            </div>
          )}
        </div>

        {deleteFolderTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171d25] p-6 shadow-2xl"
            >
              {deleteFolderTarget.notes?.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Notes exist inside "{deleteFolderTarget.name}"
                    </h3>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteFolderTarget(null);
                        setDeleteFolderError("");
                      }}
                      className="rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-4">
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
                      {deleteFolderTarget.notes.map((note) => (
                        <li key={note.id}>{note.title}</li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm leading-6 text-gray-400">
                    Deleting this folder will also delete all notes inside it. Do you want to continue?
                  </p>

                  {deleteFolderError && (
                    <p className="mt-3 text-sm text-red-400">{deleteFolderError}</p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteFolderTarget(null);
                        setDeleteFolderError("");
                      }}
                      className="rounded-xl bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmDeleteFolder}
                      className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Delete Folder
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white">
                    Delete category?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-white">
                      "{deleteFolderTarget.name}"
                    </span>
                    ?
                  </p>

                  {deleteFolderError && (
                    <p className="mt-3 text-sm text-red-400">{deleteFolderError}</p>
                  )}

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteFolderTarget(null);
                        setDeleteFolderError("");
                      }}
                      className="rounded-xl bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmDeleteFolder}
                      className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {deleteNoteTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setDeleteNoteTarget(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-note-title"
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171d25] p-6 shadow-2xl"
            >
              <h3
                id="delete-note-title"
                className="text-lg font-semibold text-white"
              >
                Delete note?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white">
                  "{deleteNoteTarget.title}"
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  ref={cancelDeleteButtonRef}
                  type="button"
                  onClick={() => setDeleteNoteTarget(null)}
                  className="rounded-xl bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteNote(deleteNoteTarget.id)}
                  disabled={deletingNoteId === deleteNoteTarget.id}
                  className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingNoteId === deleteNoteTarget.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedNote && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => setSelectedNote(null)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSelectedNote(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="note-details-title"
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#171d25] p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3
                    id="note-details-title"
                    className="text-xl font-semibold text-white"
                  >
                    {selectedNote.title}
                  </h3>

                  {selectedNote.folder && (
                    <span className="mt-2 inline-block rounded-full bg-[#f5a623]/10 px-2.5 py-1 text-[11px] font-medium text-orange-500">
                      #{selectedNote.folder}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                  aria-label="Close note"
                >
                  ✕
                </button>
              </div>

              <div
                className="text-sm leading-7 text-gray-300"
                dangerouslySetInnerHTML={{ __html: selectedNote.content }}
              />
            </div>
          </div>
        )}
        {notesError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {notesError}
          </div>
        )}

        {actionError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {actionError}
          </div>
        )}

        {/*  MOBILE FLOATING SEARCH */}

        <div className="fixed bottom-5 left-1/2 z-40 flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center gap-2 lg:hidden">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-2xl border border-white/10 bg-[#171d25]/95 py-3.5 pl-11 pr-4 text-sm text-white shadow-2xl backdrop-blur-xl outline-none placeholder:text-gray-600 focus:border-[#f5a623]/50"
            />
          </div>

          <button
            type="button"
            aria-label="Create note"
            onClick={() => {
              setCreateNoteError("");
              setShowNoteForm(true);
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-2xl font-light text-black shadow-xl transition hover:scale-105"
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
