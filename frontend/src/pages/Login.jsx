import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Email or password is invalid";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    setError("");

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-[#090d11] text-white">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE — BRANDING */}

        <section className="relative hidden h-full overflow-hidden px-10 py-8 lg:flex lg:flex-col xl:px-16">
          {/* Background glow */}
          <div className="pointer-events-none absolute -left-30 top-1/2 h-125 w-125 -translate-y-1/2 rounded-full bg-orange-500/5 blur-[120px]" />

          {/* Logo */}
          <Link
            to="/login"
            className="relative z-10 flex w-fit items-center gap-2 mb-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
              <span className="text-sm font-bold text-white">FN</span>
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Focus<span className="text-orange-400">Note</span>
            </span>
          </Link>

          {/* Main branding content */}
          <div className="relative z-10 flex flex-1 flex-col justify-center">
            <div className="max-w-lg">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-orange-400">
                Your personal workspace
              </p>

              <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                Turn your thoughts
                <br />
                into <span className="text-orange-400">organized notes.</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-gray-400 xl:text-base">
                Capture your ideas, organize your notes, and keep everything you
                need in one focused workspace.
              </p>
            </div>

            {/* Illustration */}
            <div className="mt-8 flex h-40 items-center justify-center xl:mt-10 xl:h-48">
              <div className="relative h-32 w-56 rotate-[-5deg] rounded-2xl border border-white/10 bg-linear-to-br from-[#242a31] to-[#101419] shadow-2xl shadow-black/50 xl:h-36 xl:w-64">
                {/* Notebook lines */}
                <div className="absolute left-7 right-7 top-7 space-y-3">
                  <div className="h-1 rounded-full bg-white/10" />
                  <div className="h-1 w-4/5 rounded-full bg-white/10" />
                  <div className="h-1 w-3/5 rounded-full bg-white/10" />
                </div>

                {/* Pencil */}
                <div className="absolute -right-7 -bottom-3 h-36 w-2 rotate-25 rounded-full bg-gray-500">
                  <div className="absolute -bottom-2 left-0.5 border-x-2 border-t-8 border-x-transparent border-t-gray-400" />
                </div>

                {/* Orange accent */}
                <div className="absolute bottom-5 left-7 h-8 w-8 rotate-[-15deg] rounded-md border-2 border-orange-400/80" />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE — LOGIN FORM */}

        <section className="flex flex-col h-full items-center justify-center px-5 py-6 sm:px-8 lg:px-12">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-lg font-bold text-white">
              FN
            </div>

            <span className="text-xl font-semibold tracking-tight text-white">
              Focus<span className="text-orange-500">Note</span>
            </span>
          </div>

          <div className="w-full max-w-md">
            {/* Form card */}
            <div className="rounded-2xl border border-white/8 bg-[#151a20]/90 p-6 shadow-2xl shadow-black/30 sm:p-8">
              {/* Heading */}
              <div className="mb-7">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Sign in to continue capturing your ideas and notes.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-gray-300"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </div>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className="h-11 w-full rounded-lg border border-white/8 bg-[#101419] pl-10 pr-4 text-sm text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/10"
                    />

                  </div>

                  {errors.email && (
                    <p id="email-error" className="mt-2 text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-gray-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <rect x="4" y="10" width="16" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      className="h-11 w-full rounded-lg border border-white/8 bg-[#101419] pl-10 pr-12 text-sm text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-gray-300"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M2 2l20 20" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 8.5 4 10 8-0.5 1.3-1.2 2.4-2.1 3.4" />
                          <path d="M6.2 6.2C4.1 7.6 2.7 9.6 2 12c1.5 4 5 8 10 8 1.4 0 2.7-.3 3.9-.8" />
                        </svg>
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-2 text-xs text-red-400"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  className="mt-8 h-11 w-full rounded-lg bg-orange-500 text-sm font-semibold text-black shadow-lg shadow-orange-500/10 transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 active:scale-[0.99]"
                >
                  Log In
                </button>
              </form>

              {/* Register */}
              <p className="mt-6 text-center text-xs text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-orange-400 transition hover:text-orange-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
