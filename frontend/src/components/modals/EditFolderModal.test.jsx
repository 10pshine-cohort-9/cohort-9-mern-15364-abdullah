import { render, screen, fireEvent } from "@testing-library/react";
import EditFolderModal from "./EditFolderModal.jsx";

function renderModal(overrides = {}) {
  const props = {
    editFolderName: "Work",
    setEditFolderName: jest.fn(),
    handleUpdateFolder: jest.fn((e) => e.preventDefault()),
    onClose: jest.fn(),
    ...overrides,
  };
  render(<EditFolderModal {...props} />);
  return props;
}

describe("EditFolderModal", () => {
  it("should render the form with the current folder name", () => {
    renderModal({ editFolderName: "Work" });
    expect(screen.getByText("Edit Category")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Work")).toBeInTheDocument();
  });

  it("should call setEditFolderName as the user types", () => {
    const { setEditFolderName } = renderModal({ editFolderName: "Work" });
    fireEvent.change(screen.getByDisplayValue("Work"), {
      target: { value: "Personal" },
    });
    expect(setEditFolderName).toHaveBeenCalledWith("Personal");
  });

  it("should call handleUpdateFolder when the form is submitted", () => {
    const { handleUpdateFolder } = renderModal();
    fireEvent.submit(screen.getByDisplayValue("Work").closest("form"));
    expect(handleUpdateFolder).toHaveBeenCalled();
  });

  it("should call onClose when Cancel is clicked", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onClose).toHaveBeenCalled();
  });
});
