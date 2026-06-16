import { LinkButton } from "./Button";

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
      {actionHref && actionLabel ? (
        <LinkButton href={actionHref} className="mt-5">
          {actionLabel}
        </LinkButton>
      ) : null}
    </div>
  );
}
