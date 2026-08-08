import Skeleton from "../ui/Skeleton";

export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden shadow-sm border border-gray-100">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function MenuItemCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="mt-auto flex items-center justify-between pt-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PromoCardSkeleton() {
  return (
    <div className="relative overflow-hidden min-h-[180px] bg-gray-100">
      <Skeleton className="absolute inset-0 w-full h-full" />
    </div>
  );
}

export function CategoryChipsSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-9 w-20 shrink-0" />
      <Skeleton className="h-9 w-20 shrink-0" />
      <Skeleton className="h-9 w-24 shrink-0" />
      <Skeleton className="h-9 w-20 shrink-0" />
      <Skeleton className="h-9 w-24 shrink-0" />
      <Skeleton className="h-9 w-20 shrink-0" />
    </div>
  );
}

export function RestaurantPageSkeleton() {
  return (
    <div className="pb-32">
      <div className="relative overflow-hidden mb-6 h-64 md:h-80">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="space-y-2 mb-6">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-44" />
      </div>

      <section className="mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <MenuItemCardSkeleton key={i} />
          ))}
        </div>
      </section>

      <section>
        <CategoryChipsSkeleton />
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <MenuItemCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
