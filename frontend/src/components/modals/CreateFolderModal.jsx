const CreateFolderModal = ({
  showFolderInput,
  newFolder,
  setNewFolder,
  setShowFolderInput,
  handleCreateFolder,
}) => {
  return (
    showFolderInput && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
        <div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151b23] p-5 shadow-2xl"
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
    )
  );
};

export default CreateFolderModal;