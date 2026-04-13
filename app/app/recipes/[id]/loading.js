export default function LoadingRecipeDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/60 to-sky-100/60 pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-10 w-36 bg-white rounded-xl mb-6" />
        <div className="rounded-3xl border border-emerald-100 bg-white p-3">
          <div className="h-64 md:h-96 bg-slate-200 rounded-2xl" />
          <div className="mt-4 h-6 w-40 bg-slate-200 rounded" />
          <div className="mt-3 h-10 w-2/3 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 space-y-3">
            <div className="h-6 w-40 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-4 w-4/6 bg-slate-200 rounded" />
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 space-y-3">
            <div className="h-6 w-52 bg-slate-200 rounded" />
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
            <div className="h-4 w-4/6 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
