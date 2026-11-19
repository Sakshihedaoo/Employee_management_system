import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { AuthCard } from "./ForgotPassword";
import api from "../services/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Maximum 128 characters",
      valid: password.length <= 128,
    },
    {
      label: "One uppercase letter (A-Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter (a-z)",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number (0-9)",
      valid: /[0-9]/.test(password),
    },
    {
      label: "One special character (@, #, $, !)",
      valid: /[^A-Za-z0-9\s]/.test(password),
    },
    {
      label: "No spaces",
      valid: password.length > 0 && !/\s/.test(password),
    },
  ];

  const isPasswordValid = passwordRules.every(
    (rule) => rule.valid
  );

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  async function submit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is missing. Please request a new reset link.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please fulfill all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage(data.message || "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Reset link is invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Choose a new password for your account."
    >
      <form onSubmit={submit}>

        {!token && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Your reset link is missing its token. Please request a new reset link.
          </p>
        )}

        {message && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

       
        <label className="text-sm font-medium">
          New password
        </label>

        <div className="relative mt-2">
          <input
            required
            maxLength={128}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-indigo-500"
            placeholder="Enter new password"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        
        <label className="mt-5 block text-sm font-medium">
          Confirm new password
        </label>

        <div className="relative mt-2">
          <input
            required
            maxLength={128}
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-indigo-500"
            placeholder="Confirm new password"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
            aria-label={
              showConfirmPassword ? "Hide password" : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        {confirmPassword.length > 0 && (
          <p
            className={`mt-2 flex items-center gap-2 text-xs ${
              passwordsMatch ? "text-green-600" : "text-red-600"
            }`}
          >
            {passwordsMatch ? (
              <Check size={15} />
            ) : (
              <X size={15} />
            )}

            {passwordsMatch
              ? "Passwords match."
              : "Passwords do not match."}
          </p>
        )}

        
        <button
          type="submit"
         
          className="mt-5 w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 "
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>

        <Link
          to="/login"
          className="mt-5 block text-center text-sm font-semibold text-indigo-600"
        >
          Back to login
        </Link>

      </form>
    </AuthCard>
  );
}
