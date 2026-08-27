import { render, screen, fireEvent } from "@testing-library/react";
import ProfileModal from "./ProfileModal.jsx";

function renderModal(overrides = {}) {
  const props = {
    user: { full_name: "Jane Doe", email: "jane@test.com" },
    onClose: jest.fn(),
    ...overrides,
  };
  render(<ProfileModal {...props} />);
  return props;
}

describe("ProfileModal", () => {
  it("should render nothing when user is null", () => {
    const { container } = render(
      <ProfileModal user={null} onClose={jest.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should display the user's full name and email", () => {
    renderModal({ user: { full_name: "Jane Doe", email: "jane@test.com" } });

    const nameOccurrences = screen.getAllByText("Jane Doe");
    expect(nameOccurrences.length).toBe(2);
    expect(screen.getByText("jane@test.com")).toBeInTheDocument();
  });

  it("should show fallback text when name or email is missing", () => {
    renderModal({ user: { full_name: "", email: "" } });
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getAllByText("Not available").length).toBeGreaterThan(0);
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

  it("should call onClose when the close button is clicked", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByLabelText("Close profile"));
    expect(onClose).toHaveBeenCalled();
  });
});
