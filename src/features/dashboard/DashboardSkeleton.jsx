import Layout from '../../components/layout/Layout';

export default function DashboardSkeleton() {
  return (
    <Layout>
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="h-8 bg-[#e8e8ed] rounded-xl w-48 mb-6 dark:bg-[#38383a]" />

        {/* Bento grid skeleton */}
        <div className="bento-dashboard">
          {/* Stat cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bento-cell !p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-[#e8e8ed] rounded-xl dark:bg-[#38383a]" />
                <div className="h-4 bg-[#e8e8ed] rounded w-20 dark:bg-[#38383a]" />
              </div>
              <div className="h-9 bg-[#e8e8ed] rounded w-16 dark:bg-[#38383a]" />
            </div>
          ))}

          {/* Hero skeleton */}
          <div className="bento-cell lg:col-span-2 lg:row-span-2">
            <div className="h-4 bg-[#e8e8ed] rounded w-40 mb-6 dark:bg-[#38383a]" />
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-[#e8e8ed] rounded-xl dark:bg-[#38383a]" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-[#e8e8ed] rounded w-32 dark:bg-[#38383a]" />
                <div className="h-3 bg-[#e8e8ed] rounded w-20 dark:bg-[#38383a]" />
                <div className="h-4 bg-[#e8e8ed] rounded w-16 dark:bg-[#38383a]" />
              </div>
            </div>
          </div>

          {/* QuickActions skeleton */}
          <div className="bento-cell flex items-center justify-center">
            <div className="flex gap-2">
              <div className="h-8 bg-[#e8e8ed] rounded-lg w-28 dark:bg-[#38383a]" />
              <div className="h-8 bg-[#e8e8ed] rounded-lg w-28 dark:bg-[#38383a]" />
            </div>
          </div>

          {/* Wide cells skeleton */}
          <div className="bento-cell lg:col-span-2">
            <div className="h-4 bg-[#e8e8ed] rounded w-48 mb-6 dark:bg-[#38383a]" />
            <div className="grid grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="h-3 bg-[#e8e8ed] rounded w-16 mb-2 dark:bg-[#38383a]" />
                      <div className="h-3 bg-[#e8e8ed] rounded-full dark:bg-[#38383a]" style={{ width: `${40 + j * 12}%` }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bento-cell lg:col-span-2">
            <div className="h-4 bg-[#e8e8ed] rounded w-32 mb-6 dark:bg-[#38383a]" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex justify-between mb-3">
                <div className="h-3 bg-[#e8e8ed] rounded w-24 dark:bg-[#38383a]" />
                <div className="h-3 bg-[#e8e8ed] rounded w-10 dark:bg-[#38383a]" />
              </div>
            ))}
          </div>

          {/* Three 1x1 cells */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bento-cell">
              <div className="h-4 bg-[#e8e8ed] rounded w-32 mb-6 dark:bg-[#38383a]" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between mb-3">
                  <div className="h-3 bg-[#e8e8ed] rounded w-24 dark:bg-[#38383a]" />
                  <div className="h-3 bg-[#e8e8ed] rounded w-10 dark:bg-[#38383a]" />
                </div>
              ))}
            </div>
          ))}

          {/* Full width ActivityFeed skeleton */}
          <div className="bento-cell lg:col-span-4">
            <div className="h-4 bg-[#e8e8ed] rounded w-40 mb-6 dark:bg-[#38383a]" />
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 bg-[#e8e8ed] rounded-full dark:bg-[#38383a]" />
                <div className="h-3 bg-[#e8e8ed] rounded flex-1 dark:bg-[#38383a]" />
                <div className="h-3 bg-[#e8e8ed] rounded w-16 dark:bg-[#38383a]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
