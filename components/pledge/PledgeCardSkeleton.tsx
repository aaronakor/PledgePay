export function PledgeCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-16 bg-border rounded" />
          <div className="h-4 w-32 bg-border rounded" />
          <div className="h-3 w-48 bg-border rounded" />
        </div>
        <div className="h-5 w-16 bg-border rounded-full" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-border rounded" />
          <div className="h-8 w-28 bg-border rounded" />
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="h-3 w-12 bg-border rounded" />
          <div className="h-4 w-20 bg-border rounded" />
        </div>
      </div>
    </div>
  )
}
