import type { FormField } from "@/lib/form-schema";

export function ResponseTable({
  fields,
  responses,
}: {
  fields: FormField[];
  responses: { id: string; createdAt: Date; data: unknown }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Submitted</th>
              {fields.map((field) => (
                <th key={field.id} className="px-4 py-3">
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {responses.map((response) => {
              const data = response.data as Record<string, string | number | boolean | null | undefined>;
              return (
                <tr key={response.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(response.createdAt)}
                  </td>
                  {fields.map((field) => (
                    <td key={field.id} className="min-w-40 px-4 py-3 text-slate-900">
                      {formatValue(data[field.id])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatValue(value: string | number | boolean | null | undefined): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}
