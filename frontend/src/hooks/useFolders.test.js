import { renderHook, act } from "@testing-library/react";
import { useFolders } from "./useFolders.js";

jest.mock("../api/foldersApi.js", () => ({
  createFolder: jest.fn(),
  updateFolder: jest.fn(),
  deleteFolder: jest.fn(),
}));

describe("useFolders", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return an empty array when no userId is provided", () => {
    const { result } = renderHook(() => useFolders(undefined));
    expect(result.current.folders).toEqual([]);
  });

  it("should load and normalize folders from localStorage for a given user", () => {
    localStorage.setItem(
      "focusnote-folders-5",
      JSON.stringify([
        { id: "1", name: "Work" },
        { id: 2, name: "Personal" },
      ]),
    );

    const { result } = renderHook(() => useFolders(5));

    expect(result.current.folders).toEqual([
      { id: 1, name: "Work" },
      { id: 2, name: "Personal" },
    ]);
  });

  it("should return an empty array if localStorage contains invalid JSON", () => {
    localStorage.setItem("focusnote-folders-5", "not-valid-json{{{");

    const { result } = renderHook(() => useFolders(5));

    expect(result.current.folders).toEqual([]);
  });

  it("should filter out entries with invalid ids or missing names", () => {
    localStorage.setItem(
      "focusnote-folders-5",
      JSON.stringify([
        { id: "abc", name: "Bad Id" },
        { id: 3, name: "" },
        { id: 4, name: "Valid Folder" },
      ]),
    );

    const { result } = renderHook(() => useFolders(5));

    expect(result.current.folders).toEqual([{ id: 4, name: "Valid Folder" }]);
  });

  it("should reload folders from localStorage when userId changes", () => {
    localStorage.setItem(
      "focusnote-folders-5",
      JSON.stringify([{ id: 1, name: "User5 Folder" }]),
    );
    localStorage.setItem(
      "focusnote-folders-9",
      JSON.stringify([{ id: 2, name: "User9 Folder" }]),
    );

    const { result, rerender } = renderHook(
      ({ userId }) => useFolders(userId),
      { initialProps: { userId: 5 } },
    );

    expect(result.current.folders).toEqual([{ id: 1, name: "User5 Folder" }]);

    rerender({ userId: 9 });

    expect(result.current.folders).toEqual([{ id: 2, name: "User9 Folder" }]);
  });

  it("should persist folder changes to localStorage under the current user's key", () => {
    const { result } = renderHook(() => useFolders(5));

    act(() => {
      result.current.setFolders([{ id: 1, name: "New Folder" }]);
    });

    const stored = JSON.parse(localStorage.getItem("focusnote-folders-5"));
    expect(stored).toEqual([{ id: 1, name: "New Folder" }]);
  });
});
