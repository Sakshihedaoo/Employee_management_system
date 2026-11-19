import { CalendarCheck, Wallet, Palmtree, Megaphone, Clock3 } from "lucide-react";
import { PageHeading, StatCard, Panel, EmptyNote } from "./shared";

export default function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("emsUser") || "null");
  return <>
    <PageHeading title="My Dashboard" subtitle={`Hello ${user?.name || "there"} — here is your personal workspace.`} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Attendance today" value="Not started" detail="Check-in will be enabled in Module 5" icon={CalendarCheck} tone="green" />
      <StatCard label="Leave balance" value="— days" detail="Leave module not connected yet" icon={Palmtree} tone="amber" />
      <StatCard label="Latest payslip" value="—" detail="Payroll module not connected yet" icon={Wallet} tone="blue" />
      <StatCard label="Upcoming holidays" value="—" detail="Holiday calendar not connected yet" icon={Megaphone} />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <Panel title="Attendance"><div className="flex items-center gap-4 rounded-xl bg-indigo-50 p-4"><div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-indigo-600"><Clock3 /></div><div><p className="font-medium">Good day to get started</p><p className="mt-1 text-sm text-slate-600">Check-in and check-out controls will be added with the Attendance module.</p></div></div></Panel>
      <Panel title="My leave"><EmptyNote>Your leave balance and leave request history will appear here after Module 6 is connected.</EmptyNote></Panel>
      <Panel title="My payslips"><EmptyNote>Published monthly payslips will be listed here when the Payroll module is available.</EmptyNote></Panel>
      <Panel title="Announcements"><EmptyNote>Company announcements and holiday updates will appear here when Module 9 is implemented.</EmptyNote></Panel>
    </div>
  </>;
}
