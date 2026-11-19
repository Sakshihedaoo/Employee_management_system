import { useEffect, useState } from "react";
import { Users, UserCheck, CalendarDays, ClipboardList, UserPlus, Wallet, Megaphone } from "lucide-react";
import api from "../../services/api";
import { PageHeading, StatCard, Panel, QuickAction, EmptyNote } from "./shared";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/dashboard/admin").then(r => setStats(r.data)).catch(() => setStats({ totalEmployees: 0, presentToday: 0, onLeaveToday: 0, pendingRequests: 0, newJoiners: [] })); }, []);
  const s = stats || { totalEmployees: "—", presentToday: "—", onLeaveToday: "—", pendingRequests: "—", newJoiners: [] };
  return <>
    <PageHeading title="Admin Dashboard" subtitle="Your company at a glance. Review workforce activity and common actions." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total employees" value={s.totalEmployees} detail="Active employee records" icon={Users} />
      <StatCard label="Present today" value={s.presentToday} detail="Attendance module not connected yet" icon={UserCheck} tone="green" />
      <StatCard label="On leave today" value={s.onLeaveToday} detail="Leave module not connected yet" icon={CalendarDays} tone="amber" />
      <StatCard label="Pending requests" value={s.pendingRequests} detail="Approval module not connected yet" icon={ClipboardList} tone="rose" />
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-5">
      <div className="space-y-6 xl:col-span-3">
        <Panel title="Quick actions" action="SHORTCUTS"><div className="grid gap-3 sm:grid-cols-2"><QuickAction title="Add employee" description="Create a new employee record" /><QuickAction title="Run payroll" description="Payroll module will be added later" /><QuickAction title="Post announcement" description="Share an update with the company" /><QuickAction title="View reports" description="Review workforce summaries" /></div></Panel>
        <Panel title="New joiners"><EmptyNote>{s.newJoiners?.length ? s.newJoiners.map(x => `${x.name} — ${x.department || "Department not set"}`).join(" · ") : "No employee joiner records to display yet. Add employees when Module 4 is implemented."}</EmptyNote></Panel>
      </div>
      
    </div>
  </>;
}
function Row({ icon: Icon, title, text }) { return <div className="flex gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon size={17}/></div><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>; }
function Status({ label }) { return <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500"></span><span>{label}</span><span className="ml-auto text-xs text-green-600">Ready</span></div>; }
