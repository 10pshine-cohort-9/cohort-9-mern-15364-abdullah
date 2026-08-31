import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar.jsx";

function buildFolder(id, name) {
  return { id, name };
}

function renderSidebar(overrides = {}) {
  const props = {
    selectedFolder: "All Notes",
    setSelectedFolder: jest.fn(),
    folders: [buildFolder(1, "Work"), buildFolder(2, "Personal")],
    setShowFolderInput: jest.fn(),
    handleEditFolder: jest.fn(),
    notes: [],
    setDeleteFolderTarget: jest.fn(),
    setDeleteFolderError: jest.fn(),
    ...overrides,
  };
  render(<Sidebar {...props} />);
  return props;
}

describe("Sidebar", () => {
  it("should render 'All Notes' and each folder name", () => {
    renderSidebar();
    expect(screen.getByText("All Notes")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("should call setSelectedFolder('All Notes') when 'All Notes' is clicked", () => {
    const { setSelectedFolder } = renderSidebar();
    fireEvent.click(screen.getByText("All Notes"));
    expect(setSelectedFolder).toHaveBeenCalledWith("All Notes");
  });

  it("should call setSelectedFolder with the folder name when a folder is clicked", () => {
    const { setSelectedFolder } = renderSidebar();
    fireEvent.click(screen.getByText("Work"));
    expect(setSelectedFolder).toHaveBeenCalledWith("Work");
  });

  it("should call setShowFolderInput(true) when the '+' button is clicked", () => {
    const { setShowFolderInput } = renderSidebar();
    fireEvent.click(screen.getByTitle("Create category"));
    expect(setShowFolderInput).toHaveBeenCalledWith(true);
  });

  it("should call handleEditFolder with the folder when Edit is clicked", () => {
    const { handleEditFolder } = renderSidebar();
    const editButtons = screen.getAllByTitle("Edit folder");
    fireEvent.click(editButtons[0]);
    expect(handleEditFolder).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: "Work" }),
    );
  });

  it("should call setDeleteFolderTarget with just the folder when it has no notes", () => {
    const { setDeleteFolderTarget, setDeleteFolderError } = renderSidebar({
      folders: [buildFolder(1, "Work")],
      notes: [],
    });
    fireEvent.click(screen.getByTitle("Delete folder"));
    expect(setDeleteFolderTarget).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: "Work" }),
    );
    expect(setDeleteFolderError).toHaveBeenCalledWith("");
  });

  it("should call setDeleteFolderTarget with attached notes when the folder contains notes", () => {
    const { setDeleteFolderTarget } = renderSidebar({
      folders: [buildFolder(1, "Work")],
      notes: [
        { id: 100, folder_id: 1, title: "Note A" },
        { id: 101, folder_id: 2, title: "Note B" },
      ],
    });
    fireEvent.click(screen.getByTitle("Delete folder"));
    expect(setDeleteFolderTarget).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: "Work",
        notes: [expect.objectContaining({ id: 100, title: "Note A" })],
      }),
    );
  });
});
