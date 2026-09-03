import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../hooks/useNotes.js";
import { useFolders } from "../hooks/useFolders.js";
import CreateFolderModal from "../components/modals/CreateFolderModal.jsx";
import CreateNoteModal from "../components/modals/CreateNoteModal.jsx";
import EditFolderModal from "../components/modals/EditFolderModal.jsx";
import EditNoteModal from "../components/modals/EditNoteModal.jsx";
import DeleteFolderModal from "../components/modals/DeleteFolderModal.jsx";
import DeleteNoteModal from "../components/modals/DeleteNoteModal.jsx";
import NoteDetailsModal from "../components/modals/NoteDetailsModal.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import Header from "../components/layout/Header.jsx";
import NotesGrid from "../components/ui/NotesGrid.jsx";
import ProfileModal from "../components/modals/ProfileModal.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [selectedFolder, setSelectedFolder] = useState("All Notes");
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolder, setNewFolder] = useState("");

  const {
    notes,
    setNotes,
    notesLoading,
    notesError,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

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

  const {
    folders,
    setFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useFolders(user?.id);

  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");

  const [deleteFolderTarget, setDeleteFolderTarget] = useState(null);

  const handleOpenCreateFolder = () => {
    setIsMobileSidebarOpen(false);
    setEditingFolder(null);
    setDeleteFolderTarget(null);
    setDeleteFolderError("");
    setShowFolderInput(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenProfile = () => {
    setShowProfile(false);
    setShowProfileModal(true);
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

  const handleOpenCreateNote = () => {
    setIsMobileSidebarOpen(false);
    setEditingFolder(null);
    setDeleteFolderTarget(null);
    setDeleteNoteTarget(null);
    setEditingNote(null);
    setCreateNoteError("");
    setShowNoteForm(true);
  };

  const handleEditFolder = (folder) => {
    setIsMobileSidebarOpen(false);
    setShowFolderInput(false);
    setDeleteFolderTarget(null);
    setDeleteFolderError("");
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

  const handleOpenDeleteFolder = (folder) => {
    const notesInFolder = notes.filter(
      (note) => Number(note.folder_id) === Number(folder.id),
    );

    setIsMobileSidebarOpen(false);
    setShowFolderInput(false);
    setEditingFolder(null);
    setEditFolderName("");
    setDeleteFolderTarget({ ...folder, notes: notesInFolder });
    setDeleteFolderError("");
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
    setIsMobileSidebarOpen(false);
    setShowNoteForm(false);
    setEditingFolder(null);
    setDeleteFolderTarget(null);
    setDeleteNoteTarget(null);
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setActionError("");
  };

  const handleOpenDeleteNote = (note) => {
    setIsMobileSidebarOpen(false);
    setShowNoteForm(false);
    setEditingFolder(null);
    setDeleteFolderTarget(null);
    setEditingNote(null);
    setDeleteNoteTarget(note);
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

  const handleOpenNoteDetails = (note) => {
    setIsMobileSidebarOpen(false);
    setShowNoteForm(false);
    setEditingFolder(null);
    setDeleteFolderTarget(null);
    setEditingNote(null);
    setDeleteNoteTarget(null);
    setSelectedNote(note);
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <Sidebar
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        folders={folders}
        setShowFolderInput={handleOpenCreateFolder}
        handleEditFolder={handleEditFolder}
        notes={notes}
        setDeleteFolderTarget={handleOpenDeleteFolder}
        setDeleteFolderError={setDeleteFolderError}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/*  MAIN CONTENT */}

      <main className="min-h-screen lg:ml-64">
        <Header
          search={search}
          setSearch={setSearch}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          user={user}
          handleLogout={handleLogout}
          handleOpenProfile={handleOpenProfile}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/*  PAGE CONTENT */}

        <div className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {/* Welcome */}
          <div className="mb-7">
            <p className="text-sm text-gray-500">Welcome back</p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {user?.full_name || "Your Notes"}
            </h1>
          </div>

          {/*  FOLDER CREATION MODAL */}

          <CreateFolderModal
            showFolderInput={showFolderInput}
            newFolder={newFolder}
            setNewFolder={setNewFolder}
            setShowFolderInput={setShowFolderInput}
            handleCreateFolder={handleCreateFolder}
          />

          {/*  NOTE CREATION MODAL */}

          <CreateNoteModal
            showNoteForm={showNoteForm}
            newNote={newNote}
            creatingNote={creatingNote}
            createNoteError={createNoteError}
            handleCreateNote={handleCreateNote}
            handleNoteChange={handleNoteChange}
            setNewNote={setNewNote}
            setShowNoteForm={setShowNoteForm}
            setCreateNoteError={setCreateNoteError}
          />
          {editingFolder && (
            <EditFolderModal
              editFolderName={editFolderName}
              setEditFolderName={setEditFolderName}
              handleUpdateFolder={handleUpdateFolder}
              onClose={closeEditFolderModal}
            />
          )}

          {editingNote && (
            <EditNoteModal
              editTitle={editTitle}
              editContent={editContent}
              setEditTitle={setEditTitle}
              setEditContent={setEditContent}
              handleUpdateNote={handleUpdateNote}
              onClose={closeEditNoteModal}
            />
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
            type="button"
              onClick={() => {
                setCreateNoteError("");
                handleOpenCreateNote();
              }}
              className="hidden rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-orange-500 sm:block"
            >
              + New Note
            </button>
          </div>

          {/* NOTES GRID*/}

          <NotesGrid
            notesLoading={notesLoading}
            filteredNotes={filteredNotes}
            setSelectedNote={handleOpenNoteDetails}
            handleEditNote={handleEditNote}
            setDeleteNoteTarget={handleOpenDeleteNote}
            setDeleteTriggerRef={deleteTriggerRef}
            deletingNoteId={deletingNoteId}
          />
        </div>

        {deleteFolderTarget && (
          <DeleteFolderModal
            deleteFolderTarget={deleteFolderTarget}
            deleteFolderError={deleteFolderError}
            handleConfirmDeleteFolder={handleConfirmDeleteFolder}
            onClose={() => {
              setDeleteFolderTarget(null);
              setDeleteFolderError("");
            }}
          />
        )}

        {deleteNoteTarget && (
          <DeleteNoteModal
            deleteNoteTarget={deleteNoteTarget}
            deletingNoteId={deletingNoteId}
            handleDeleteNote={handleDeleteNote}
            onClose={() => setDeleteNoteTarget(null)}
            cancelDeleteButtonRef={cancelDeleteButtonRef}
          />
        )}

        {selectedNote && (
          <NoteDetailsModal
            selectedNote={selectedNote}
            onClose={() => setSelectedNote(null)}
          />
        )}

        {showProfileModal && (
          <ProfileModal
            user={user}
            onClose={() => setShowProfileModal(false)}
          />
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
              handleOpenCreateNote();
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
