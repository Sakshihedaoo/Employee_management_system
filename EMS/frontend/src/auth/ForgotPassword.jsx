import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message || "If this email exists, reset instructions will be available shortly.");
      if (data.developmentResetUrl) setMessage(`${data.message} Development reset link: ${data.developmentResetUrl}`);
    } catch (err) { setError(err.response?.data?.message || "Could not process your request."); }
    finally { setBusy(false); }
  }

  return <AuthCard title="Forgot password?" subtitle="Enter your account email to request a password reset.">
    <form onSubmit={submit}>
      {message && <p className="mb-4 break-words rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="text-sm font-medium">Email address</label>
      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" placeholder="you@company.com" />
      <button disabled={busy} className="mt-5 w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white disabled:opacity-60">{busy ? "Sending..." : "Request reset link"}</button>
      <Link to="/login" className="mt-5 block text-center text-sm font-semibold text-indigo-600">Back to login</Link>
    </form>
  </AuthCard>;
}


import { UsersRound } from "lucide-react";

export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm sm:p-9">

        <div className="mb-7 grid h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <UsersRound size={26} />
        </div>

        <h1 className="text-2xl font-bold">{title}</h1>

        <p className="mt-2 mb-7 text-sm leading-6 text-slate-500">
          {subtitle}
        </p>

        {children}

      </div>
    </div>
  );
}
