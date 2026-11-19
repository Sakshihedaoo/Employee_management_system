import { ArrowUpRight } from "lucide-react";

export function PageHeading({ title, subtitle }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-indigo-600">OVERVIEW</p><h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1><p className="mt-2 text-sm text-slate-500">{subtitle}</p></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">{new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div></div>;
}
export function StatCard({ label, value, detail, icon: Icon, tone = "indigo" }) {
  const tones = { indigo: "bg-indigo-50 text-indigo-600", green: "bg-green-50 text-green-600", amber: "bg-amber-50 text-amber-600", rose: "bg-rose-50 text-rose-600", blue: "bg-blue-50 text-blue-600" };
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone] || tones.indigo}`}><Icon size={20} /></span></div><p className="mt-4 text-3xl font-bold text-slate-900">{value}</p><p className="mt-2 text-xs text-slate-500">{detail}</p></div>;
}
export function Panel({ title, action, children }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold text-slate-900">{title}</h2>{action && <span className="text-xs font-semibold text-indigo-600">{action}</span>}</div>{children}</section>;
}
export function QuickAction({ title, description }) {
  return <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"><div><p className="font-medium text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div><ArrowUpRight size={18} className="text-slate-400" /></button>;
}
export function EmptyNote({ children }) {
  return <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">{children}</div>;
}
