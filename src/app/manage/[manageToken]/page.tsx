import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { toggleFormActiveAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";
import { ResponseTable } from "@/components/ResponseTable";
import { Button } from "@/components/Button";
import { prisma } from "@/lib/prisma";
import { parseStoredFields } from "@/lib/form-schema";
import { getBaseUrl } from "@/lib/tokens";

export default async function ManagePage({ params }: { params: Promise<{ manageToken: string }> }) {
  const { manageToken } = await params;
  const form = await prisma.form.findUnique({
    where: { manageToken },
    include: {
      responses: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!form) notFound();

  const publicUrl = `${getBaseUrl()}/f/${form.slug}`;
  const manageUrl = `${getBaseUrl()}/manage/${form.manageToken}`;
  const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
    margin: 1,
    width: 320,
    color: {
      dark: "#020617",
      light: "#ffffff",
    },
  });
  const fields = parseStoredFields(form.fields);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Manage form</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-950">{form.title}</h1>
                {form.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{form.description}</p> : null}
              </div>
              <span
                className={`inline-flex w-fit rounded-md px-3 py-1 text-sm font-semibold ${
                  form.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {form.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Public link</p>
                <p className="mt-2 break-all text-sm text-slate-900">{publicUrl}</p>
                <CopyButton value={publicUrl} />
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Private manage link</p>
                <p className="mt-2 break-all text-sm text-slate-900">{manageUrl}</p>
                <CopyButton value={manageUrl} label="Copy manage link" />
              </div>
            </div>

            <form action={toggleFormActiveAction} className="mt-5">
              <input type="hidden" name="manageToken" value={form.manageToken} />
              <input type="hidden" name="isActive" value={String(!form.isActive)} />
              <Button type="submit" variant={form.isActive ? "danger" : "primary"}>
                {form.isActive ? "Deactivate form" : "Activate form"}
              </Button>
            </form>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Responses</h2>
                <p className="mt-1 text-sm text-slate-600">{form.responses.length} total submissions</p>
              </div>
            </div>
            {form.responses.length > 0 ? (
              <ResponseTable fields={fields} responses={form.responses} />
            ) : (
              <EmptyState
                title="No responses yet"
                message="Share the public link or QR code. New submissions will appear here."
              />
            )}
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">QR code</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">The QR code contains only the public form URL.</p>
          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeDataUrl} alt={`QR code for ${form.title}`} className="mx-auto size-64" />
          </div>
          <a
            href={qrCodeDataUrl}
            download={`${form.slug}-qr.png`}
            className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          >
            Download QR code
          </a>
        </aside>
      </div>
    </AppShell>
  );
}
