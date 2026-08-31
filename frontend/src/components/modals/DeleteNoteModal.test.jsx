import { render, screen, fireEvent } from "@testing-library/react";
import DeleteNoteModal from "./DeleteNoteModal.jsx";

function renderModal(overrides = {}) {
  const props = {
    deleteNoteTarget: { id: 5, title: "My Note" },
    deletingNoteId: null,
    handleDeleteNote: jest.fn(),
    onClose: jest.fn(),
    cancelDeleteButtonRef: { current: null },
    ...overrides,
  };
  render(<DeleteNoteModal {...props} />);
  return props;
}

describe("DeleteNoteModal", () => {
  it("should render nothing when deleteNoteTarget is null", () => {
    const { container } = render(
      <DeleteNoteModal
        deleteNoteTarget={null}
        deletingNoteId={null}
        handleDeleteNote={jest.fn()}
        onClose={jest.fn()}
        cancelDeleteButtonRef={{ current: null }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should show the note title in the confirmation message", () => {
    renderModal({ deleteNoteTarget: { id: 5, title: "My Note" } });
    expect(screen.getByText(/"My Note"/)).toBeInTheDocument();
  });

  it("should call handleDeleteNote with the note id when Delete is clicked", () => {
    const { handleDeleteNote } = renderModal({
      deleteNoteTarget: { id: 5, title: "My Note" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(handleDeleteNote).toHaveBeenCalledWith(5);
  });

  it("should call onClose when Cancel is clicked", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("should disable the delete button and show 'Deleting...' when deletingNoteId matches", () => {
    renderModal({
      deleteNoteTarget: { id: 5, title: "My Note" },
      deletingNoteId: 5,
    });
    const deleteButton = screen.getByRole("button", { name: "Deleting..." });
    expect(deleteButton).toBeDisabled();
  });
});
