const DeleteNoteModal = ({
  deleteNoteTarget,
  deletingNoteId,
  handleDeleteNote,
  onClose,
  cancelDeleteButtonRef,
}) => {
  if (!deleteNoteTarget) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
    >
      <div
        aria-modal="true"
        aria-labelledby="delete-note-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171d25] p-6 shadow-2xl"
      >
        <h3 id="delete-note-title" className="text-lg font-semibold text-white">
          Delete note?
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Are you sure you want to delete{" "}
          <span className="font-medium text-white">
            "{deleteNoteTarget.title}"{" "}
          </span>{" "}
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelDeleteButtonRef}
            type="button"
            onClick={onClose}
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
            {deletingNoteId === deleteNoteTarget.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNoteModal;
