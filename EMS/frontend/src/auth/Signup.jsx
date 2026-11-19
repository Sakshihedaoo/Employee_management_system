import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Mail, LockKeyhole, UsersRound, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
      ...(name === "password" ? { confirmPassword: "" } : {}),
    }));

    setError("");
    setSuccess("");
  }

  function validateForm() {
    const errors = {};

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[\p{L}][\p{L}\p{M}\s.'-]*$/u;

    if (!name) {
      errors.name = "Full name is required.";
    } else if (name.length < 2) {
      errors.name = "Name must contain at least 2 characters.";
    } else if (name.length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    } else if (!namePattern.test(name)) {
      errors.name = "Please enter a valid name.";
    }

    if (!email) {
      errors.email = "Email address is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must contain at least 8 characters.";
    } else if (password.length > 128) {
      errors.password = "Password cannot exceed 128 characters.";
    } else if (/\s/.test(password)) {
      errors.password = "Password cannot contain spaces.";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must contain at least one number.";
    } else if (!/[^A-Za-z0-9\s]/.test(password)) {
      errors.password = "Password must contain at least one special character.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setBusy(true);

    try {
      const response = await api.post("/auth/signup", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setSuccess(
        response.data?.message ||
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      if (!err.response) {
        setError(
          "Cannot connect to the server. Please check that the backend is running."
        );
      } else if (err.response.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError(
          err.response.data?.message ||
          err.response.data?.error ||
          "Unable to create your account. Please try again."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border py-3 pl-10 pr-4 outline-none transition focus:ring-2 ${fieldErrors[field]
      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  function FieldError({ field }) {
    if (!fieldErrors[field]) return null;

    return (
      <p
        id={`${field}-error`}
        role="alert"
        className="mt-1 text-sm text-red-600"
      >
        {fieldErrors[field]}
      </p>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 lg:flex lg:items-center lg:justify-center lg:p-6">
      <div className="grid min-h-screen w-full overflow-hidden bg-white shadow-xl lg:min-h-0 lg:max-w-6xl lg:grid-cols-2 lg:rounded-2xl">


        <section className="hidden flex-col justify-center bg-slate-950 p-10 text-white lg:flex xl:p-14">
          <div className="max-w-lg">
            <p className="mb-9 text-3xl font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Employee Management System
            </p>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Join your team.
              <br />
              Grow together.
            </h1>

            <p className="mt-5 max-w-md leading-7 text-slate-300">
              Create your account to access your employee dashboard,
              attendance, leave information, and workplace resources.
            </p>
          </div>
        </section>


        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-10 lg:py-12 xl:px-14">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto w-full max-w-md"
          >
            <div className="mb-7 lg:hidden">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-indigo-600 text-white">
                <UsersRound size={24} />
              </div>

            </div>

            <p className="text-sm font-semibold text-indigo-600">
              GET STARTED
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Create your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your details to register as an employee.
            </p>


            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}


            <label
              htmlFor="name"
              className="mt-6 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>

            <div className="relative mt-2">
              <UserRound
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={
                  fieldErrors.name ? "name-error" : undefined
                }
                placeholder="Enter your full name"
                className={inputClass("name")}
              />
            </div>
            <FieldError field="name" />


            <label
              htmlFor="email"
              className="mt-4 block text-sm font-medium text-slate-700"
            >
              Work email
            </label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? "email-error" : undefined
                }
                placeholder="Enter your email address"
                className={inputClass("email")}
              />
            </div>
            <FieldError field="email" />


            <label
              htmlFor="password"
              className="mt-4 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
                placeholder="Create a password"
                className={`w-full rounded-xl border py-3 pl-10 pr-12 outline-none transition focus:ring-2 ${fieldErrors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <FieldError field="password" />

            <label
              htmlFor="confirmPassword"
              className="mt-4 block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={
                  fieldErrors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
                placeholder="Confirm your password"
                className={`w-full rounded-xl border py-3 pl-10 pr-12 outline-none transition focus:ring-2 ${fieldErrors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={showConfirmPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            <FieldError field="confirmPassword" />

            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Creating account..." : "Create account"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              New registrations receive the Employee role.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
