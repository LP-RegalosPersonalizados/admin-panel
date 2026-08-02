import Layout from '../../components/layout/Layout';

export default function DashboardSkeleton() {
  return (
    <Layout>
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-6 dark:bg-slate-700" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-slate-200 rounded-lg dark:bg-slate-700" />
                <div className="h-4 bg-slate-200 rounded w-20 dark:bg-slate-700" />
              </div>
              <div className="h-9 bg-slate-200 rounded w-16 dark:bg-slate-700" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="h-4 bg-slate-200 rounded w-48 mb-6 dark:bg-slate-700" />
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="mb-4">
                  <div className="h-3 bg-slate-200 rounded w-16 mb-2 dark:bg-slate-700" />
                  <div className="h-3 bg-slate-200 rounded-full dark:bg-slate-700" style={{ width: `${40 + j * 12}%` }} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="h-4 bg-slate-200 rounded w-32 mb-6 dark:bg-slate-700" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between mb-3">
                  <div className="h-3 bg-slate-200 rounded w-24 dark:bg-slate-700" />
                  <div className="h-3 bg-slate-200 rounded w-10 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
