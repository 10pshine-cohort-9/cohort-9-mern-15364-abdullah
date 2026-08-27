import { render, screen, fireEvent } from "@testing-library/react";
import DeleteFolderModal from "./DeleteFolderModal.jsx";

function renderModal(overrides = {}) {
  const props = {
    deleteFolderTarget: { id: 1, name: "Work", notes: [] },
    deleteFolderError: "",
    handleConfirmDeleteFolder: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  render(<DeleteFolderModal {...props} />);
  return props;
}

describe("DeleteFolderModal", () => {
  it("should show the confirm-delete view when the folder has no notes", () => {
    renderModal({ deleteFolderTarget: { id: 1, name: "Work", notes: [] } });
    expect(screen.getByText("Delete category?")).toBeInTheDocument();
    expect(screen.getByText(/"Work"/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("should show the blocked-delete view when the folder contains notes", () => {
    renderModal({
      deleteFolderTarget: {
        id: 1,
        name: "Work",
        notes: [
          { id: 10, title: "Note A" },
          { id: 11, title: "Note B" },
        ],
      },
    });
    expect(screen.getByText(/Notes exist inside/)).toBeInTheDocument();
    expect(screen.getByText("Note A")).toBeInTheDocument();
    expect(screen.getByText("Note B")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("should call handleConfirmDeleteFolder when Delete is clicked (no notes)", () => {
    const { handleConfirmDeleteFolder } = renderModal({
      deleteFolderTarget: { id: 1, name: "Work", notes: [] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(handleConfirmDeleteFolder).toHaveBeenCalled();
  });

  it("should call onClose when Cancel is clicked", () => {
    const { onClose } = renderModal({
      deleteFolderTarget: { id: 1, name: "Work", notes: [] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("should display an error message when deleteFolderError is set", () => {
    renderModal({
      deleteFolderTarget: { id: 1, name: "Work", notes: [] },
      deleteFolderError: "Something went wrong",
    });
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
