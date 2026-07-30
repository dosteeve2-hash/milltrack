export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-2 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl h-24 bg-white/5 border border-white/10"
          />
        ))}
      </div>

      <div className="rounded-xl h-56 bg-white/5 border border-white/10" />

      <div className="rounded-xl p-4 flex flex-col gap-3 bg-white/5 border border-white/10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <div className="flex-1 h-4 rounded bg-white/10" />
            <div className="w-20 h-4 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
