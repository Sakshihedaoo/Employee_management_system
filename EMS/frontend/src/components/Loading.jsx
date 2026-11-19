export default function Loading({ label = "Loading..." }) {
  return <div className="p-8 text-center text-slate-500" role="status">{label}</div>;
}
