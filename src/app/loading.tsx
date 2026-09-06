export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[50vh]">
      <div className="w-8 h-8 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mb-4"></div>
      <p className="text-[var(--foreground-secondary)] font-medium text-sm tracking-widest uppercase">Loading...</p>
    </div>
  );
}
