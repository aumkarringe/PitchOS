export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
          Workspace Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Personalization and notification controls are being wired in. This panel
          will support feed preferences, query defaults, and alert thresholds.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Preferences</p>
            <p className="mt-2 text-sm text-zinc-200">Default leagues, pinned matches, density</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Alerts</p>
            <p className="mt-2 text-sm text-zinc-200">Goals, cards, substitutions, momentum spikes</p>
          </div>
        </div>
      </div>
    </div>
  )
} 