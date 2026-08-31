import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header.jsx";

function renderHeader(overrides = {}) {
  const props = {
    search: "",
    setSearch: jest.fn(),
    showProfile: false,
    setShowProfile: jest.fn(),
    user: { full_name: "Jane Doe", email: "jane@test.com" },
    handleLogout: jest.fn(),
    handleOpenProfile: jest.fn(),
    ...overrides,
  };
  render(<Header {...props} />);
  return props;
}

describe("Header", () => {
  it("should render the search input with the current value", () => {
    renderHeader({ search: "meeting notes" });
    expect(screen.getByPlaceholderText("Search notes...")).toHaveValue("meeting notes");
  });

  it("should call setSearch as the user types", () => {
    const { setSearch } = renderHeader();
    fireEvent.change(screen.getByPlaceholderText("Search notes..."), {
      target: { value: "todo" },
    });
    expect(setSearch).toHaveBeenCalledWith("todo");
  });

  it("should show the user's initial on the avatar button", () => {
    renderHeader({ user: { full_name: "Jane Doe", email: "jane@test.com" } });
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should show the profile dropdown when showProfile is true", () => {
    renderHeader({ showProfile: true });
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("should toggle showProfile when the avatar button is clicked", () => {
    const setShowProfile = jest.fn();
    renderHeader({ showProfile: false, setShowProfile });
    fireEvent.click(screen.getByRole("button", { name: "J" }));
    const updaterFn = setShowProfile.mock.calls[0][0];
    expect(updaterFn(false)).toBe(true);
    expect(updaterFn(true)).toBe(false);
  });

  it("should call handleLogout when 'Logout' is clicked", () => {
    const { handleLogout } = renderHeader({ showProfile: true });
    fireEvent.click(screen.getByText("Logout"));
    expect(handleLogout).toHaveBeenCalled();
  });

  it("should display the user's name and email in the dropdown", () => {
    renderHeader({ showProfile: true, user: { full_name: "Jane Doe", email: "jane@test.com" } });
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
  });
});
