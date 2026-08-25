const NoteCard = ({
  note,
  setSelectedNote,
  handleEditNote,
  setDeleteNoteTarget,
  setDeleteTriggerRef,
  deletingNoteId,
}) => {
  return (
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
              setDeleteTriggerRef.current = event.currentTarget;
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
  );
};

export default NoteCard;
