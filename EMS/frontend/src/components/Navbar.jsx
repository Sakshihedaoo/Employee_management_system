import { Bell, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("emsUser") || "null");
  function logout() {
    localStorage.removeItem("emsToken");
    localStorage.removeItem("emsUser");
    navigate("/login", { replace: true });
  }
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      <div>
        <p className="text-2xl text-slate-500">Welcome back,</p>
        <h2 className="font-semibold text-2xl text-slate-800">{user?.name || "User"}</h2>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="Notifications (coming soon)"><Bell size={22} /></button>
        <div className="hidden items-center gap-2 sm:flex">
          <UserCircle size={30} className="text-indigo-600" />
          <div><p className="text-xl font-medium">{user?.role}</p><p className="text-sm text-slate-500">{user?.email}</p></div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"><LogOut size={16} /><span className="hidden sm:inline">Logout</span></button>
      </div>
    </header>
  );
}
