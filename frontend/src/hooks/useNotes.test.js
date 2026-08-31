import { renderHook, waitFor } from "@testing-library/react";
import { useNotes } from "./useNotes.js";
import { getNotes } from "../api/notesApi.js";

jest.mock("../api/notesApi.js", () => ({
  getNotes: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
}));

describe("useNotes", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should set an auth error and stop loading if no token is present", async () => {
    const { result } = renderHook(() => useNotes());

    await waitFor(() => {
      expect(result.current.notesLoading).toBe(false);
    });

    expect(result.current.notesError).toBe("Authentication token not found.");
    expect(getNotes).not.toHaveBeenCalled();
  });

  it("should fetch and set notes on success", async () => {
    localStorage.setItem("token", "fake-token");
    getNotes.mockResolvedValue({ data: [{ id: 1, title: "Test Note" }] });

    const { result } = renderHook(() => useNotes());

    await waitFor(() => {
      expect(result.current.notesLoading).toBe(false);
    });

    expect(result.current.notes).toEqual([{ id: 1, title: "Test Note" }]);
    expect(result.current.notesError).toBe("");
    expect(getNotes).toHaveBeenCalledWith("fake-token");
  });

  it("should set the server's error message on failure", async () => {
    localStorage.setItem("token", "fake-token");
    getNotes.mockRejectedValue({
      response: { data: { message: "Notes service unavailable" } },
    });

    const { result } = renderHook(() => useNotes());

    await waitFor(() => {
      expect(result.current.notesLoading).toBe(false);
    });

    expect(result.current.notesError).toBe("Notes service unavailable");
  });

  it("should set a fallback error message when no server message is available", async () => {
    localStorage.setItem("token", "fake-token");
    getNotes.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useNotes());

    await waitFor(() => {
      expect(result.current.notesLoading).toBe(false);
    });

    expect(result.current.notesError).toBe(
      "Failed to load notes. Please try again.",
    );
  });
});
