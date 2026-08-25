import NoteCard from "./NoteCard.jsx";

const NotesGrid = ({
  notesLoading,
  filteredNotes,
  setSelectedNote,
  handleEditNote,
  setDeleteNoteTarget,
  setDeleteTriggerRef,
  deletingNoteId,
}) => {
  return notesLoading ? (
    <p className="py-16 text-center text-sm text-gray-500">
      Loading notes...
    </p>
  ) : filteredNotes.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredNotes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          setSelectedNote={setSelectedNote}
          handleEditNote={handleEditNote}
          setDeleteNoteTarget={setDeleteNoteTarget}
          setDeleteTriggerRef={setDeleteTriggerRef}
          deletingNoteId={deletingNoteId}
        />
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#11161d] px-6 py-16 text-center">
      <h3 className="text-lg font-medium">No notes found</h3>

      <p className="mt-2 text-sm text-gray-500">
        Try another search or create a new note.
      </p>
    </div>
  );
};

export default NotesGrid;
