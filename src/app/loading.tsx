export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="space-y-4 w-full max-w-md">
        <div className="h-4 w-3/4 rounded bg-black/[0.06] animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-black/[0.06] animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-black/[0.06] animate-pulse" />
      </div>
    </div>
  );
}
