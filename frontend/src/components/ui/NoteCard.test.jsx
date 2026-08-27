import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "./NoteCard.jsx";

function buildNote(overrides = {}) {
  return {
    id: 1,
    title: "Test Note",
    content: "<p>Some content</p>",
    folder: null,
    created_at: "2026-01-15T00:00:00.000Z",
    ...overrides,
  };
}

function renderNoteCard(overrides = {}, propOverrides = {}) {
  const note = buildNote(overrides);
  const props = {
    note,
    setSelectedNote: jest.fn(),
    handleEditNote: jest.fn(),
    setDeleteNoteTarget: jest.fn(),
    setDeleteTriggerRef: { current: null },
    deletingNoteId: null,
    ...propOverrides,
  };
  render(<NoteCard {...props} />);
  return props;
}

describe("NoteCard", () => {
  it("should render the note title and sanitized content", () => {
    renderNoteCard({ title: "My Note", content: "<p>Hello world</p>" });
    expect(screen.getByText("My Note")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("should strip a <script> tag from the content before rendering", () => {
    renderNoteCard({ content: '<p>Safe</p><script>alert("x")</script>' });
    expect(document.querySelector("script")).not.toBeInTheDocument();
    expect(screen.getByText("Safe")).toBeInTheDocument();
  });

  it("should show the folder badge when the note has a folder", () => {
    renderNoteCard({ folder: "Work" });
    expect(screen.getByText("#Work")).toBeInTheDocument();
  });

  it("should call setSelectedNote with the note when the card is clicked", () => {
    const note = buildNote();
    const { setSelectedNote } = renderNoteCard(note);
    fireEvent.click(screen.getByRole("button", { name: /test note/i }));
    expect(setSelectedNote).toHaveBeenCalledWith(
      expect.objectContaining({ id: note.id }),
    );
  });

  it("should call handleEditNote (and not setSelectedNote) when Edit is clicked", () => {
    const note = buildNote();
    const { handleEditNote, setSelectedNote } = renderNoteCard(note);
    fireEvent.click(screen.getByTitle("Edit note"));
    expect(handleEditNote).toHaveBeenCalledWith(
      expect.objectContaining({ id: note.id }),
    );
    expect(setSelectedNote).not.toHaveBeenCalled();
  });

  it("should call setDeleteNoteTarget (and not setSelectedNote) when Delete is clicked", () => {
    const note = buildNote();
    const { setDeleteNoteTarget, setSelectedNote } = renderNoteCard(note);
    fireEvent.click(screen.getByTitle("Delete note"));
    expect(setDeleteNoteTarget).toHaveBeenCalledWith(
      expect.objectContaining({ id: note.id }),
    );
    expect(setSelectedNote).not.toHaveBeenCalled();
  });

  it("should show 'Deleting...' and disable the delete button when deletingNoteId matches", () => {
    const note = buildNote({ id: 7 });
    renderNoteCard(note, { deletingNoteId: 7 });
    const deleteButton = screen.getByTitle("Delete note");
    expect(deleteButton).toBeDisabled();
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });
});
