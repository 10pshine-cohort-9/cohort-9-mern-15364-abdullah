import { render, screen, fireEvent } from "@testing-library/react";
import EditNoteModal from "./EditNoteModal.jsx";

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
    editTitle: "Old Title",
    editContent: "Old content",
    setEditTitle: jest.fn(),
    setEditContent: jest.fn(),
    handleUpdateNote: jest.fn((e) => e.preventDefault()),
    onClose: jest.fn(),
    ...overrides,
  };
  render(<EditNoteModal {...props} />);
  return props;
}

describe("EditNoteModal", () => {
  it("should render the form with the current title and content", () => {
    renderModal({ editTitle: "My Note", editContent: "Body text" });
    expect(screen.getByDisplayValue("My Note")).toBeInTheDocument();
    expect(screen.getByTestId("rich-text-editor")).toHaveValue("Body text");
  });

  it("should call setEditTitle as the user types in the title field", () => {
    const { setEditTitle } = renderModal({ editTitle: "Old Title" });
    fireEvent.change(screen.getByDisplayValue("Old Title"), {
      target: { value: "New Title" },
    });
    expect(setEditTitle).toHaveBeenCalledWith("New Title");
  });

  it("should call setEditContent when the editor changes", () => {
    const { setEditContent } = renderModal();
    fireEvent.change(screen.getByTestId("rich-text-editor"), {
      target: { value: "updated content" },
    });
    expect(setEditContent).toHaveBeenCalledWith("updated content");
  });

  it("should call handleUpdateNote when the form is submitted", () => {
    const { handleUpdateNote } = renderModal();
    fireEvent.submit(screen.getByDisplayValue("Old Title").closest("form"));
    expect(handleUpdateNote).toHaveBeenCalled();
  });

  it("should call onClose when Cancel is clicked", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });
});
