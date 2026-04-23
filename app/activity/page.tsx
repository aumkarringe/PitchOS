export default function ActivityPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
          Activity Timeline
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Event-level monitoring and operator notes will appear here, including
          flagged incidents, match momentum swings, and alert acknowledgements.
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Live feed</p>
            <p className="mt-2 text-sm text-zinc-200">Incident chronology with smart grouping</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Annotations</p>
            <p className="mt-2 text-sm text-zinc-200">Manual notes tied to match minute and event type</p>
          </div>
        </div>
      </div>
    </div>
  )
}