import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <EmptyState title="Page not found" message="The form or manage link does not exist." actionHref="/" actionLabel="Create a form" />
      </div>
    </main>
  );
}
