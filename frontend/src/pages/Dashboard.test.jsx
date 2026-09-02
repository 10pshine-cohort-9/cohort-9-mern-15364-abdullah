// src/pages/Dashboard.test.jsx
import { useState } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import { useAuth } from "../context/authContext.jsx";
import { useNotes } from "../hooks/useNotes.js";
import { useFolders } from "../hooks/useFolders.js";

jest.mock("../context/authContext.jsx", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../hooks/useNotes.js", () => ({
  useNotes: jest.fn(),
}));

jest.mock("../hooks/useFolders.js", () => ({
  useFolders: jest.fn(),
}));

jest.mock("../components/richTextEditor.jsx", () => {
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

function buildNote(id, title, folder_id, content = "Some content") {
  return { id, title, content, folder_id };
}

function buildFolder(id, name) {
  return { id, name };
}

function setupMocks({
  user = { id: 1, full_name: "Jane Doe", email: "jane@test.com" },
  initialNotes = [],
  initialFolders = [],
  createNote = jest.fn(),
  updateNote = jest.fn(),
  deleteNote = jest.fn(),
  createFolder = jest.fn(),
  updateFolder = jest.fn(),
  deleteFolder = jest.fn(),
  logout = jest.fn(),
} = {}) {
  useAuth.mockReturnValue({ user, logout });

  useNotes.mockImplementation(() => {
    const [notes, setNotes] = useState(initialNotes);
    return {
      notes,
      setNotes,
      notesLoading: false,
      notesError: "",
      createNote,
      updateNote,
      deleteNote,
    };
  });

  useFolders.mockImplementation(() => {
    const [folders, setFolders] = useState(initialFolders);
    return { folders, setFolders, createFolder, updateFolder, deleteFolder };
  });

  return {
    logout,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    updateFolder,
    deleteFolder,
  };
}

function renderDashboard() {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  it("should render with 'All Notes' selected by default and show all notes", () => {
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      initialNotes: [buildNote(1, "Note A", 1), buildNote(2, "Note B", 1)],
    });

    renderDashboard();

    expect(
      screen.getByRole("heading", { name: "All Notes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 notes")).toBeInTheDocument();
    expect(screen.getByText("Note A")).toBeInTheDocument();
    expect(screen.getByText("Note B")).toBeInTheDocument();
  });

  it("should filter notes by folder when a folder is selected from the sidebar", () => {
    setupMocks({
      initialFolders: [buildFolder(1, "Work"), buildFolder(2, "Personal")],
      initialNotes: [
        buildNote(1, "Work Note", 1),
        buildNote(2, "Personal Note", 2),
      ],
    });

    renderDashboard();

    const sidebar = document.querySelector("aside");
    fireEvent.click(within(sidebar).getByText("Work"));

    expect(screen.getByRole("heading", { name: "Work" })).toBeInTheDocument();
    expect(screen.getByText("Work Note")).toBeInTheDocument();
    expect(screen.queryByText("Personal Note")).not.toBeInTheDocument();
  });

  it("should render mobile category actions and a visible create button", () => {
    setupMocks({ initialFolders: [buildFolder(1, "Work")] });

    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: "Open categories" }));

    expect(screen.getByTitle("Edit folder")).toBeInTheDocument();
    expect(screen.getByTitle("Delete folder")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create category" }),
    ).toBeInTheDocument();
  });

  it("should execute the rich-text toolbar actions", () => {
    const { default: ActualRichTextEditor } = jest.requireActual(
      "../components/richTextEditor.jsx",
    );
    render(<ActualRichTextEditor content="<p>Hello</p>" onChange={jest.fn()} />);

    [
      "Bold",
      "Italic",
      "Underline",
      "Strikethrough",
      "Bullet list",
      "Numbered list",
      "Align left",
      "Align center",
      "Align right",
      "Justify",
      "Undo",
      "Redo",
    ].forEach((title) => {
      fireEvent.click(screen.getByTitle(title));
    });

    expect(screen.getByTitle("Bold")).toBeInTheDocument();
    expect(screen.getByTitle("Redo")).toBeInTheDocument();
  });

  it("should open category modals from the mobile sidebar", () => {
    setupMocks({ initialFolders: [buildFolder(1, "Work")] });
    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: "Open categories" }));
    fireEvent.click(screen.getByTitle("Create category"));
    expect(screen.getByText("Create New Category")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close create folder form"));
    fireEvent.click(screen.getByRole("button", { name: "Open categories" }));
    fireEvent.click(screen.getByTitle("Edit folder"));
    expect(screen.getByText("Edit Category")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close edit folder form"));
    fireEvent.click(screen.getByRole("button", { name: "Open categories" }));
    fireEvent.click(screen.getByTitle("Delete folder"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should open note modals without leaving the mobile sidebar visible", () => {
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      initialNotes: [buildNote(1, "My Note", 1)],
    });
    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: "Open categories" }));
    fireEvent.click(screen.getByRole("button", { name: "Create note" }));
    expect(screen.getByText("Create New Note")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close create note form"));
    fireEvent.click(screen.getByTitle("Edit note"));
    expect(screen.getByText("Edit Note")).toBeInTheDocument();
  });

  it("should filter notes by search text", () => {
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      initialNotes: [
        buildNote(1, "Meeting Notes", 1),
        buildNote(2, "Shopping List", 1),
      ],
    });

    renderDashboard();

    const searchInputs = screen.getAllByPlaceholderText("Search notes...");
    fireEvent.change(searchInputs[0], { target: { value: "meeting" } });

    expect(screen.getAllByText("Meeting Notes").length).toBeGreaterThan(0);
    expect(screen.queryByText("Shopping List")).not.toBeInTheDocument();
  });

  it("should show a validation error when creating a note while 'All Notes' is selected", async () => {
    setupMocks({ initialFolders: [], initialNotes: [] });

    renderDashboard();

    fireEvent.click(screen.getByText("+ New Note"));
    fireEvent.submit(screen.getByPlaceholderText("Note title").closest("form"));

    expect(
      await screen.findByText(
        "Please create and select a category before creating a note.",
      ),
    ).toBeInTheDocument();
  });

  it("should create a note successfully when a folder is selected", async () => {
    const createNote = jest.fn().mockResolvedValue({
      data: buildNote(99, "New Note", 1, "Body text"),
    });
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      initialNotes: [],
      createNote,
    });
    localStorage.setItem("token", "fake-token");

    renderDashboard();

    const sidebar = document.querySelector("aside");
    fireEvent.click(within(sidebar).getByText("Work"));
    fireEvent.click(screen.getByText("+ New Note"));

    fireEvent.change(screen.getByPlaceholderText("Note title"), {
      target: { name: "title", value: "New Note" },
    });
    fireEvent.change(screen.getByTestId("rich-text-editor"), {
      target: { value: "Body text" },
    });
    fireEvent.submit(screen.getByPlaceholderText("Note title").closest("form"));

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith("fake-token", {
        title: "New Note",
        content: "Body text",
        folder_id: 1,
      });
    });
    expect(await screen.findByText("New Note")).toBeInTheDocument();
  });

  it("should create a category from the mobile sidebar", async () => {
    const createFolder = jest.fn().mockResolvedValue({
      data: { id: 2, name: "Personal" },
    });
    setupMocks({ createFolder });
    localStorage.setItem("token", "fake-token");

    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: "Open categories" }));
    fireEvent.click(screen.getByTitle("Create category"));
    fireEvent.change(screen.getByPlaceholderText("Category name"), {
      target: { value: " Personal " },
    });
    fireEvent.submit(screen.getByPlaceholderText("Category name").closest("form"));

    await waitFor(() => {
      expect(createFolder).toHaveBeenCalledWith("fake-token", "Personal");
    });
    expect(await screen.findByText("Personal")).toBeInTheDocument();
  });

  it("should update a category and keep it selected after renaming", async () => {
    const updateFolder = jest.fn().mockResolvedValue({
      data: { id: 1, name: "Renamed" },
    });
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      updateFolder,
    });
    localStorage.setItem("token", "fake-token");

    renderDashboard();

    fireEvent.click(screen.getByTitle("Edit folder"));
    fireEvent.change(screen.getByDisplayValue("Work"), {
      target: { value: "Renamed" },
    });
    fireEvent.submit(screen.getByDisplayValue("Renamed").closest("form"));

    await waitFor(() => {
      expect(updateFolder).toHaveBeenCalledWith("fake-token", 1, "Renamed");
    });
    expect(await screen.findByText("Renamed")).toBeInTheDocument();
  });

  it("should delete a note from its confirmation modal", async () => {
    const deleteNote = jest.fn().mockResolvedValue({});
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      initialNotes: [buildNote(1, "Old Note", 1)],
      deleteNote,
    });
    localStorage.setItem("token", "fake-token");

    renderDashboard();

    fireEvent.click(screen.getByTitle("Delete note"));
    expect(await screen.findByText("Delete note?")).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith("fake-token", 1);
    });
    expect(screen.queryByText("Old Note")).not.toBeInTheDocument();
  });

  it("should delete a folder and reset to 'All Notes' when the selected folder is deleted", async () => {
    const deleteFolder = jest.fn().mockResolvedValue({});
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      initialNotes: [],
      deleteFolder,
    });
    localStorage.setItem("token", "fake-token");

    renderDashboard();

    const sidebar = document.querySelector("aside");
    fireEvent.click(within(sidebar).getByText("Work"));
    expect(screen.getByRole("heading", { name: "Work" })).toBeInTheDocument();

    fireEvent.click(within(sidebar).getByTitle("Delete folder"));

    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(deleteFolder).toHaveBeenCalledWith("fake-token", 1);
    });
    expect(
      await screen.findByRole("heading", { name: "All Notes" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Work")).not.toBeInTheDocument();
  });

  it("should open the note details modal when a note card is clicked", () => {
    setupMocks({
      initialFolders: [buildFolder(1, "Work")],
      initialNotes: [buildNote(1, "My Note", 1, "Note body")],
    });

    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: /my note/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      within(screen.getByRole("dialog")).getByText("My Note"),
    ).toBeInTheDocument();
  });

  it("should call logout and navigate to /login when Logout is clicked", () => {
    const logout = jest.fn();
    setupMocks({ logout });

    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: "J" }));
    fireEvent.click(screen.getByText("Logout"));

    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
