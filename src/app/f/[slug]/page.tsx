import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseStoredFields } from "@/lib/form-schema";
import { PublicDynamicForm } from "@/components/PublicDynamicForm";
import { LinkButton } from "@/components/Button";

export default async function PublicFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const form = await prisma.form.findUnique({ where: { slug } });

  if (!form) notFound();

  const fields = parseStoredFields(form.fields);
  const submitted = query.submitted === "1";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold text-slate-950">{form.title}</h1>
          {form.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{form.description}</p> : null}
        </div>

        {submitted ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-lg font-semibold text-emerald-950">Response submitted</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-800">Thank you. Your response has been saved.</p>
            <LinkButton href={`/f/${form.slug}`} variant="secondary" className="mt-4">
              Submit another response
            </LinkButton>
          </div>
        ) : form.isActive ? (
          <PublicDynamicForm slug={form.slug} fields={fields} />
        ) : (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-950">This form is closed</h2>
            <p className="mt-2 text-sm leading-6 text-amber-800">The owner is not accepting responses right now.</p>
          </div>
        )}
      </section>
    </main>
  );
}
