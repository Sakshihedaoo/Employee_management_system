import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCard } from "./ForgotPassword";
import api from "../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault(); setError(""); setMessage("");
    if (form.newPassword !== form.confirmPassword) return setError("New passwords do not match.");
    try {
      const { data } = await api.post("/auth/change-password", { oldPassword: form.oldPassword, newPassword: form.newPassword });
      const user = JSON.parse(localStorage.getItem("emsUser") || "null");
      localStorage.setItem("emsUser", JSON.stringify({ ...user, mustChangePassword: false }));
      setMessage(data.message || "Password changed.");
      setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    } catch (err) { setError(err.response?.data?.message || "Could not change password."); }
  }
  return <AuthCard title="Change password" subtitle="Use a new password with at least 8 characters.">
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}
    <form onSubmit={submit}>
      <label className="text-sm font-medium">Current password</label><input required type="password" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} className="mt-2 mb-4 w-full rounded-xl border border-slate-300 px-4 py-3" />
      <label className="text-sm font-medium">New password</label><input required minLength="8" type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} className="mt-2 mb-4 w-full rounded-xl border border-slate-300 px-4 py-3" />
      <label className="text-sm font-medium">Confirm new password</label><input required minLength="8" type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
      <button className="mt-5 w-full rounded-xl bg-indigo-600 p-3 font-semibold text-white">Update password</button>
    </form>
  </AuthCard>;
}
