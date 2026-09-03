import RichTextEditor from "../richTextEditor.jsx";

const CreateNoteModal = ({
  showNoteForm,
  newNote,
  creatingNote,
  createNoteError,
  handleCreateNote,
  handleNoteChange,
  setNewNote,
  setShowNoteForm,
  setCreateNoteError,
}) => {
  return (
    showNoteForm && (
      <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
        <div
          className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#151b23] p-3 shadow-2xl sm:p-5"
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
    )
  );
};

export default CreateNoteModal;