import { render, screen, fireEvent } from "@testing-library/react";
import CreateNoteModal from "./CreateNoteModal.jsx";

jest.mock("../richTextEditor.jsx", () => {
  return function MockRichTextEditor({ content, onChange }) {
    return (
      <textarea
        data-testid="rich-text-editor"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

function renderModal(overrides = {}) {
  const props = {
    showNoteForm: true,
    newNote: { title: "", content: "" },
    creatingNote: false,
    createNoteError: "",
    handleCreateNote: jest.fn((e) => e.preventDefault()),
    handleNoteChange: jest.fn(),
    setNewNote: jest.fn(),
    setShowNoteForm: jest.fn(),
    setCreateNoteError: jest.fn(),
    ...overrides,
  };
  render(<CreateNoteModal {...props} />);
  return props;
}

describe("CreateNoteModal", () => {
  it("should render nothing when showNoteForm is false", () => {
    const { container } = render(
      <CreateNoteModal
        showNoteForm={false}
        newNote={{ title: "", content: "" }}
        creatingNote={false}
        createNoteError=""
        handleCreateNote={jest.fn()}
        handleNoteChange={jest.fn()}
        setNewNote={jest.fn()}
        setShowNoteForm={jest.fn()}
        setCreateNoteError={jest.fn()}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the form when showNoteForm is true", () => {
    renderModal();
    expect(screen.getByText("Create New Note")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Note title")).toBeInTheDocument();
    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
  });

  it("should call handleNoteChange when the title input changes", () => {
    const { handleNoteChange } = renderModal();
    fireEvent.change(screen.getByPlaceholderText("Note title"), {
      target: { name: "title", value: "New Title" },
    });
    expect(handleNoteChange).toHaveBeenCalled();
  });

  it("should call setNewNote with updated content when the editor changes", () => {
    const setNewNote = jest.fn();
    renderModal({ newNote: { title: "T", content: "old" }, setNewNote });
    fireEvent.change(screen.getByTestId("rich-text-editor"), {
      target: { value: "new content" },
    });
    const updaterFn = setNewNote.mock.calls[0][0];
    expect(updaterFn({ title: "T", content: "old" })).toEqual({
      title: "T",
      content: "new content",
    });
  });

  it("should call handleCreateNote when the form is submitted", () => {
    const { handleCreateNote } = renderModal();
    fireEvent.submit(screen.getByPlaceholderText("Note title").closest("form"));
    expect(handleCreateNote).toHaveBeenCalled();
  });

  it("should show 'Creating...' and disable the submit button when creatingNote is true", () => {
    renderModal({ creatingNote: true });
    const submitButton = screen.getByRole("button", { name: "Creating..." });
    expect(submitButton).toBeDisabled();
  });

  it("should display an error message when createNoteError is set", () => {
    renderModal({ createNoteError: "Something went wrong" });
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should reset form visibility and error when Cancel is clicked", () => {
    const { setShowNoteForm, setCreateNoteError } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(setShowNoteForm).toHaveBeenCalledWith(false);
    expect(setCreateNoteError).toHaveBeenCalledWith("");
  });
});
