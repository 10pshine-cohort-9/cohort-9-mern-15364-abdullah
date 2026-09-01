import sanitizeHtml from "../../utils/sanitizeHtml.js";

const NoteDetailsModal = ({ selectedNote, onClose }) => {
  if (!selectedNote) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
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
            onClick={onClose}
            className="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
            aria-label="Close note"
          >
            ✕
          </button>
        </div>

        <div
          className="text-sm leading-7 text-gray-300 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(selectedNote.content),
          }}
        />
      </div>
    </div>
  );
};

export default NoteDetailsModal;