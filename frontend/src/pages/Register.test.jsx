import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "./Register.jsx";
import { useAuth } from "../context/authContext.jsx";

jest.mock("../context/authContext.jsx", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function renderRegister() {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}

describe("Register", () => {
  let mockRegister;

  beforeEach(() => {
    mockRegister = jest.fn();
    useAuth.mockReturnValue({ register: mockRegister });
    mockNavigate.mockClear();
  });

  it("should render name, email, and password fields", () => {
    renderRegister();
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("should show a validation error for an empty full name on submit", async () => {
    renderRegister();

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByLabelText("Email").closest("form"));

    expect(
      await screen.findByText("Full name is required"),
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should call register and navigate to /login on successful submit", async () => {
    mockRegister.mockResolvedValue();
    renderRegister();
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        fullName: "Jane Doe",
        email: "test@test.com",
        password: "password123",
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should show the server's error message under the email field when registration fails", async () => {
    mockRegister.mockRejectedValue({
      response: { data: { message: "Email already in use" } },
    });
    renderRegister();
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
    expect(await screen.findByText("Email already in use")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should show a fallback error message when registration fails without a server message", async () => {
    mockRegister.mockRejectedValue(new Error("network down"));
    renderRegister();
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
    expect(
      await screen.findByText("Registration failed. Please try again."),
    ).toBeInTheDocument();
  });

  it("should clear a field's validation error once the user edits it", async () => {
    renderRegister();

    fireEvent.submit(screen.getByLabelText("Full Name").closest("form"));
    expect(
      await screen.findByText("Full name is required"),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Jane Doe" },
    });

    expect(screen.queryByText("Full name is required")).not.toBeInTheDocument();
  });

  it("should toggle password visibility when the show/hide button is clicked", () => {
    renderRegister();
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByLabelText("Show password"));
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
