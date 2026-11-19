// import { LayoutDashboard, Users, CalendarCheck, Wallet, Building2 } from "lucide-react";

// export default function Sidebar() {
//   const user = JSON.parse(localStorage.getItem("emsUser") || "null");
//   const role = user?.role || "EMPLOYEE";
//   const items = [
//     { label: "Dashboard", icon: LayoutDashboard, active: true },
//     ...(role === "ADMIN" ? [{ label: "Employees", icon: Users }, { label: "Organization", icon: Building2 }] : []),
//     ...(role !== "EMPLOYEE" ? [{ label: "Team Attendance", icon: CalendarCheck }] : [{ label: "My Attendance", icon: CalendarCheck }]),
//     { label: "Payroll", icon: Wallet }
//   ];
//   return (
//     <aside className="w-full shrink-0 bg-slate-950 text-white md:min-h-screen md:w-64">
//       <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
//         <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 font-bold">E</div>
//         <div><h1 className="font-bold">PeopleDesk</h1><p className="text-xs text-slate-400">Employee Management</p></div>
//       </div>
//       <nav className="flex gap-2 overflow-x-auto p-3 md:block md:space-y-1">
//         {items.map(({ label, icon: Icon, active }) => (
//           <div key={label} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm ${active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/10"}`}>
//             <Icon size={18} />{label}
//           </div>
//         ))}
//       </nav>
//       <div className="hidden px-6 pt-8 text-xs leading-5 text-slate-500 md:block">Module 1: Login & Access<br />Module 2: Dashboard</div>
//     </aside>
//   );
// }



import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  Building2
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("emsUser") || "null");
  const role = user?.role || "EMPLOYEE";

  const items = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },

    ...(role === "ADMIN"
      ? [
          { label: "Employees", path: "/employees", icon: Users },
          { label: "Organization", path: "/organization", icon: Building2 }
        ]
      : []),

    ...(role !== "EMPLOYEE"
      ? [{ label: "Team Attendance", path: "/team-attendance", icon: CalendarCheck }]
      : [{ label: "My Attendance", path: "/attendance", icon: CalendarCheck }]),

    { label: "Payroll", path: "/payroll", icon: Wallet }
  ];

  return (
    <aside className="w-full shrink-0 bg-slate-950 text-white md:min-h-screen md:w-64">

      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 font-bold">
          E
        </div>

        <div>
          <h1 className="font-bold">PeopleDesk</h1>
          <p className="text-xs text-slate-400">
            Employee Management
          </p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 md:block md:space-y-1">

        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-white/10"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

      </nav>


    </aside>
  );
}
