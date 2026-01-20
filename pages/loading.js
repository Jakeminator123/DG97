/**
 * Global loading component for Next.js
 * This will be shown during page transitions and data fetching
 */
export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#1f2b73] via-[#2a3985] to-[#1f2b73]">
      <div
        className="flex flex-col items-center gap-3 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="h-10 w-10 rounded-full border-2 border-white/30 border-t-white/90 animate-spin" />
        <p className="text-white text-sm tracking-wide opacity-80">
          Laddar...
        </p>
      </div>
    </div>
  );
}

