import { render, screen, fireEvent } from "@testing-library/react";
import CreateFolderModal from "./CreateFolderModal.jsx";

function renderModal(overrides = {}) {
  const props = {
    showFolderInput: true,
    newFolder: "",
    setNewFolder: jest.fn(),
    setShowFolderInput: jest.fn(),
    handleCreateFolder: jest.fn((e) => e.preventDefault()),
    ...overrides,
  };
  const utils = render(<CreateFolderModal {...props} />);
  return { ...props, ...utils };
}

describe("CreateFolderModal", () => {
  it("should render nothing when showFolderInput is false", () => {
    const { container } = renderModal({ showFolderInput: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the form when showFolderInput is true", () => {
    renderModal({ showFolderInput: true });
    expect(screen.getByText("Create New Category")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Category name")).toBeInTheDocument();
  });

  it("should display the current newFolder value in the input", () => {
    renderModal({ newFolder: "My Folder" });
    expect(screen.getByPlaceholderText("Category name")).toHaveValue(
      "My Folder",
    );
  });

  it("should call setNewFolder as the user types", () => {
    const { setNewFolder } = renderModal();
    fireEvent.change(screen.getByPlaceholderText("Category name"), {
      target: { value: "New Name" },
    });
    expect(setNewFolder).toHaveBeenCalledWith("New Name");
  });

  it("should call handleCreateFolder when the form is submitted", () => {
    const { handleCreateFolder } = renderModal({ newFolder: "Work" });
    fireEvent.submit(
      screen.getByPlaceholderText("Category name").closest("form"),
    );
    expect(handleCreateFolder).toHaveBeenCalled();
  });

  it("should clear the input and close when Cancel is clicked", () => {
    const { setNewFolder, setShowFolderInput } = renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(setNewFolder).toHaveBeenCalledWith("");
    expect(setShowFolderInput).toHaveBeenCalledWith(false);
  });
});
