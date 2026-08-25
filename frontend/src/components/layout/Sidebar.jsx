const Sidebar = ({
  selectedFolder,
  setSelectedFolder,
  folders,
  setShowFolderInput,
  handleEditFolder,
  notes,
  setDeleteFolderTarget,
  setDeleteFolderError,
}) => {
  return (
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
                  <div className="hidden items-center gap-1 group-hover:flex group-focus-within:flex">
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
  );
};

export default Sidebar;
