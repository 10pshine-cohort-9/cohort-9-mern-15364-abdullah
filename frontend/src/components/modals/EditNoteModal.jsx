import RichTextEditor from "../richTextEditor.jsx";

const EditNoteModal = ({
  editTitle,
  editContent,
  setEditTitle,
  setEditContent,
  handleUpdateNote,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
          className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#151b23] p-3 shadow-2xl sm:p-5"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Note</h3>

          <button
            type="button"
            onClick={onClose}
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
              onClick={onClose}
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
  );
};

export default EditNoteModal;