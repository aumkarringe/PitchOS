export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 gap-4">
      <div className="text-3xl">⚽</div>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <p className="text-xs text-zinc-600">Connecting to live data...</p>
    </div>
  )
}