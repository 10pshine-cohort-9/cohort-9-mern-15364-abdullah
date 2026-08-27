import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login.jsx";
import { useAuth } from "../context/authContext.jsx";

jest.mock("../context/authContext.jsx", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function renderLogin() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe("Login", () => {
  let mockLogin;

  beforeEach(() => {
    mockLogin = jest.fn();
    useAuth.mockReturnValue({ login: mockLogin });
    mockNavigate.mockClear();
  });

  it("should render email and password fields", () => {
    renderLogin();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("should show a validation error for an empty email on submit", async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should call login and navigate to /dashboard on successful submit", async () => {
    mockLogin.mockResolvedValue();
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should show the server's error message when login rejects", async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));
    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should show a fallback error message when login rejects without a server message", async () => {
    mockLogin.mockRejectedValue(new Error("network down"));
    renderLogin();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));
    expect(
      await screen.findByText("Email or password is invalid"),
    ).toBeInTheDocument();
  });

  it("should clear a field's validation error once the user edits it", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  it("should toggle password visibility when the show/hide button is clicked", () => {
    renderLogin();
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByLabelText("Show password"));
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
