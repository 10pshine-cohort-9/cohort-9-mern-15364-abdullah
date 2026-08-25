const DeleteFolderModal = ({
  deleteFolderTarget,
  deleteFolderError,
  handleConfirmDeleteFolder,
  onClose,
}) => {
  return (
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
                onClick={onClose}
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
              Remove all notes inside this category to delete it.
            </p>

            {deleteFolderError && (
              <p className="mt-3 text-sm text-red-400">{deleteFolderError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-white/5 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10"
              >
                Cancel
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
                onClick={onClose}
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
  );
};

export default DeleteFolderModal;