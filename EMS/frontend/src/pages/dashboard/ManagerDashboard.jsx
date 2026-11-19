import { Users, UserCheck, ClipboardCheck, CalendarDays, Clock3 } from "lucide-react";
import { PageHeading, StatCard, Panel, EmptyNote } from "./shared";

export default function ManagerDashboard() {
  return <>
    <PageHeading title="Manager Dashboard" subtitle="Monitor your team, check pending approvals and plan the week." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Team members" value="—" detail="Connect employee management module" icon={Users} />
      <StatCard label="Present today" value="—" detail="Connect attendance module" icon={UserCheck} tone="green" />
      <StatCard label="Pending approvals" value="0" detail="Approval workflow not connected yet" icon={ClipboardCheck} tone="amber" />
      <StatCard label="On leave this week" value="—" detail="Connect leave management module" icon={CalendarDays} tone="blue" />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Panel title="Pending approvals"><EmptyNote>There are no approval records yet. Leave requests and attendance corrections will appear here when those modules are implemented.</EmptyNote></Panel>
      <Panel title="Team attendance"><EmptyNote><Clock3 className="mb-2" size={20} />Team attendance summaries will appear here after the Attendance module is connected.</EmptyNote></Panel>
      <Panel title="Team leave this week"><EmptyNote>The team leave calendar is planned for a later module.</EmptyNote></Panel>
      <Panel title="Manager actions"><div className="space-y-3"><Action title="Review leave requests" text="Approve or reject team leave when Module 6 is available."/><Action title="Review attendance corrections" text="Review submitted time corrections when Module 5 is available."/></div></Panel>
    </div>
  </>;
}
function Action({ title, text }) { return <div className="rounded-xl border border-slate-200 p-4"><p className="font-medium">{title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div>; }
