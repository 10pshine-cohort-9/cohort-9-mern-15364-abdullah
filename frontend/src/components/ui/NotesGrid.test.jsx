import { render, screen } from "@testing-library/react";
import NotesGrid from "./NotesGrid.jsx";

function buildNote(id, title) {
  return { id, title, content: "<p>Body</p>", folder: null, created_at: null };
}

function renderGrid(overrides = {}) {
  const props = {
    notesLoading: false,
    filteredNotes: [],
    setSelectedNote: jest.fn(),
    handleEditNote: jest.fn(),
    setDeleteNoteTarget: jest.fn(),
    setDeleteTriggerRef: { current: null },
    deletingNoteId: null,
    ...overrides,
  };
  render(<NotesGrid {...props} />);
  return props;
}

describe("NotesGrid", () => {
  it("should show a loading message when notesLoading is true", () => {
    renderGrid({ notesLoading: true });
    expect(screen.getByText("Loading notes...")).toBeInTheDocument();
  });

  it("should show an empty state when there are no notes and not loading", () => {
    renderGrid({ notesLoading: false, filteredNotes: [] });
    expect(screen.getByText("No notes found")).toBeInTheDocument();
    expect(screen.getByText(/try another search/i)).toBeInTheDocument();
  });

  it("should render a NoteCard for each note when notes are present", () => {
    const notes = [buildNote(1, "First Note"), buildNote(2, "Second Note")];
    renderGrid({ notesLoading: false, filteredNotes: notes });
    expect(screen.getByText("First Note")).toBeInTheDocument();
    expect(screen.getByText("Second Note")).toBeInTheDocument();
  });
});
