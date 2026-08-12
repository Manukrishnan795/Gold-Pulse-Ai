function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-card ${className}`} />;
}

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-8 sm:py-10">
      <div className="space-y-3">
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-9 w-64" />
        <SkeletonBlock className="h-4 w-40" />
      </div>
      <SkeletonBlock className="h-28 w-full" />
      <SkeletonBlock className="h-14 w-full" />
      <div className="space-y-2">
        <SkeletonBlock className="h-6 w-56" />
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    </main>
  );
}
