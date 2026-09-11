export default function PortalSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-6 h-20 border-b border-gray-100">
          <div className="h-5 w-24 skeleton rounded" />
        </div>
        <div className="flex-1 py-4 space-y-1 px-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-5 h-5 skeleton rounded" />
              <div className="h-4 w-20 skeleton rounded" />
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden lg:flex items-center justify-between px-8 h-16 border-b border-gray-100 bg-white">
          <div className="h-5 w-28 skeleton rounded" />
          <div className="flex items-center gap-3">
            <div className="space-y-1 text-right">
              <div className="h-3.5 w-24 skeleton rounded ml-auto" />
              <div className="h-3 w-32 skeleton rounded ml-auto" />
            </div>
            <div className="w-9 h-9 skeleton rounded-full" />
          </div>
        </div>

        <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
          <div className="bg-white border border-gray-100 p-5 md:p-6 flex items-center gap-5">
            <div className="w-20 h-20 skeleton rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 skeleton rounded" />
              <div className="h-4 w-32 skeleton rounded" />
              <div className="h-5 w-20 skeleton rounded" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-16 skeleton rounded" />
                  <div className="w-5 h-5 skeleton rounded" />
                </div>
                <div className="h-7 w-12 skeleton rounded" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-gray-100">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="h-5 w-28 skeleton rounded" />
                  <div className="h-4 w-16 skeleton rounded" />
                </div>
                <div className="p-5 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-10 h-10 skeleton rounded shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-4 w-3/4 skeleton rounded" />
                        <div className="h-3 w-1/2 skeleton rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
