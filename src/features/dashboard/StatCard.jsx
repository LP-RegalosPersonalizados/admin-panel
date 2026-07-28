export default function StatCard({ title, value, pending }) {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-sm text-slate-500 mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <p className="text-4xl font-bold">{value}</p>
        {pending > 0 && (
          <span className="text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded font-medium">
            {pending} pendiente(s)
          </span>
        )}
      </div>
    </div>
  );
}
