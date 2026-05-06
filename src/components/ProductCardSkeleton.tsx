export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-white border border-black/8 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 flex flex-col gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-5 w-20 rounded mt-1" />
      </div>
    </div>
  );
}
