export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-72 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
