import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, UsersRound, Eye, EyeOff, Mail } from "lucide-react";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  function validateForm() {
    let isValid = true;

    setError("");
    setEmailError("");
    setPasswordError("");

    const email = form.email.trim();
    const password = form.password;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      isValid = false;
    }

    return isValid;
  }

  function selectRole(email) {
    const account = demoUsers[email];

    setForm({
      email,
      password: account.password,
    });

    setError("");
    setEmailError("");
    setPasswordError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const email = form.email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email,
        password: form.password,
      });

      const data = response.data;

      if (!data?.token || !data?.user) {
        setError("Invalid response from server. Please try again.");
        return;
      }

      localStorage.setItem("emsToken", data.token);
      localStorage.setItem("emsUser", JSON.stringify(data.user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login API error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        code: err.code
      });

      if (err.code === "ECONNABORTED") {
        setError("Login request timed out. Check your backend.");
      } else if (!err.response) {
        setError("Cannot connect to the backend.");
      } else {
        setError(
          err.response.data?.message ||
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 lg:flex lg:items-center lg:justify-center lg:p-6">
      <div className="grid min-h-screen w-full overflow-hidden bg-white shadow-xl lg:min-h-0 lg:max-w-6xl lg:grid-cols-2 lg:rounded-2xl">

        <section className="hidden flex-col justify-center bg-slate-950 p-10 text-white lg:flex xl:p-14">
          <div className="max-w-lg">
            <p className="mb-9 text-3xl font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Employee Management System
            </p>


            <p className="mt-5 max-w-md leading-7 text-slate-300">
              Streamline your workforce operations, track attendance, manage
              payroll, and empower your team securely.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-10 lg:py-12 xl:px-14">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-indigo-600 text-white">
                <UsersRound size={24} />
              </div>
            </div>

            <p className="text-3xl drop-shadow-lg italic text-indigo-900">
              WELCOME BACK!
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Sign in to your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Select your portal to securely access the system.
            </p>



            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <label
              htmlFor="email"
              className="mt-6 block text-sm font-medium text-slate-700"
            >
              Work email
            </label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={form.email}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "email-error" : undefined}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setEmailError("");
                  setError("");
                }}
                placeholder="Enter your email address"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 outline-none transition focus:ring-2 ${emailError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
              />
            </div>

            {emailError && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
                {emailError}
              </p>
            )}

            <label
              htmlFor="password"
              className="mt-6 block text-sm font-medium text-slate-700"
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
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={
                  passwordError ? "password-error" : undefined
                }
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setPasswordError("");
                  setError("");
                }}
                placeholder="Enter your password"
                className={`w-full rounded-xl border py-3 pl-10 pr-12 outline-none transition focus:ring-2 ${passwordError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-slate-400 transition hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {passwordError && (
              <p
                id="password-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {passwordError}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-indigo-600"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Sign up
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
