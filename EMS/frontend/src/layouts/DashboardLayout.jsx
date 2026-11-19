// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// export default function DashboardLayout() {
//   return (
//     <div className="min-h-screen md:flex">
//       <Sidebar />
//       <div className="min-w-0 flex-1">
//         <Navbar />
//         <main className="p-4 sm:p-8"><Outlet /></main>
//         <footer className="px-8 pb-6 text-xs text-slate-400">Employee Management System · Modules 1 & 2</footer>
//       </div>
//     </div>
//   );
// }

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
