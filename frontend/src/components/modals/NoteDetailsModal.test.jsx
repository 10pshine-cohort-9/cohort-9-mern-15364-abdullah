import { render, screen, fireEvent } from "@testing-library/react";
import NoteDetailsModal from "./NoteDetailsModal.jsx";

function renderModal(overrides = {}) {
  const props = {
    selectedNote: {
      id: 1,
      title: "My Note",
      content: "<p>Body</p>",
      folder: null,
    },
    onClose: jest.fn(),
    ...overrides,
  };
  render(<NoteDetailsModal {...props} />);
  return props;
}

describe("NoteDetailsModal", () => {
  it("should render nothing when selectedNote is null", () => {
    const { container } = render(
      <NoteDetailsModal selectedNote={null} onClose={jest.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the note title and sanitized content", () => {
    renderModal({
      selectedNote: {
        id: 1,
        title: "My Note",
        content: "<p>Hello</p>",
        folder: null,
      },
    });
    expect(screen.getByText("My Note")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should strip a <script> tag from the content", () => {
    renderModal({
      selectedNote: {
        id: 1,
        title: "T",
        content: "<p>Safe</p><script>alert(1)</script>",
        folder: null,
      },
    });
    expect(document.querySelector("script")).not.toBeInTheDocument();
    expect(screen.getByText("Safe")).toBeInTheDocument();
  });

  it("should show the folder badge when the note has a folder", () => {
    renderModal({
      selectedNote: { id: 1, title: "T", content: "<p>x</p>", folder: "Work" },
    });
    expect(screen.getByText("#Work")).toBeInTheDocument();
  });

  it("should call onClose when the overlay is clicked", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole("dialog").parentElement);
    expect(onClose).toHaveBeenCalled();
  });

  it("should NOT call onClose when the inner dialog card is clicked", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onClose when the ✕ button is clicked", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByLabelText("Close note"));
    expect(onClose).toHaveBeenCalled();
  });
});
