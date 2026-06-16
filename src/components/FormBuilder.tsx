"use client";

import { useMemo, useState, useActionState } from "react";
import { createFormAction, type ActionState } from "@/app/actions";
import type { FieldType, FormField } from "@/lib/form-schema";
import { Button } from "./Button";

const fieldTypeOptions: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "textarea", label: "Long text" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
];

function newField(index: number): FormField {
  return {
    id: `field_${index}`,
    label: "New field",
    type: "text",
    required: false,
  };
}

export function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([
    { id: "name", label: "Full name", type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
  ]);
  const [state, action, pending] = useActionState<ActionState, FormData>(createFormAction, { ok: true });

  const fieldsJson = useMemo(() => JSON.stringify(fields), [fields]);

  function updateField(index: number, updates: Partial<FormField>) {
    setFields((current) =>
      current.map((field, fieldIndex) => {
        if (fieldIndex !== index) return field;
        const next = { ...field, ...updates };
        if (updates.type && updates.type !== "select") {
          delete next.options;
        }
        if (updates.type === "select" && !next.options) {
          next.options = ["Option 1", "Option 2"];
        }
        return next;
      }),
    );
  }

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <input type="hidden" name="fields" value={fieldsJson} />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Form title
            <input
              name="title"
              required
              placeholder="Customer feedback"
              className="h-11 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Description
            <input
              name="description"
              placeholder="A short note for respondents"
              className="h-11 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Fields</h2>
            <p className="mt-1 text-sm text-slate-600">Add the inputs respondents will see after scanning the QR code.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setFields((current) => [...current, newField(current.length + 1)])}
          >
            Add field
          </Button>
        </div>

        <div className="mt-5 grid gap-4">
          {fields.map((field, index) => (
            <div key={`${field.id}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Label
                  <input
                    value={field.label}
                    onChange={(event) => updateField(index, { label: event.target.value })}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                  <select
                    value={field.type}
                    onChange={(event) => updateField(index, { type: event.target.value as FieldType })}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  >
                    {fieldTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Field ID
                  <input
                    value={field.id}
                    onChange={(event) => updateField(index, { id: event.target.value })}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Placeholder
                  <input
                    value={field.placeholder ?? ""}
                    onChange={(event) => updateField(index, { placeholder: event.target.value })}
                    disabled={field.type === "checkbox"}
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                  />
                </label>
                <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(event) => updateField(index, { required: event.target.checked })}
                    className="size-4 rounded border-slate-300"
                  />
                  Required
                </label>
              </div>

              {field.type === "select" ? (
                <label className="mt-3 grid gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Options, comma separated
                  <input
                    value={(field.options ?? []).join(", ")}
                    onChange={(event) =>
                      updateField(index, {
                        options: event.target.value.split(",").map((option) => option.trim()),
                      })
                    }
                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              ) : null}

              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="danger"
                  disabled={fields.length === 1}
                  onClick={() => setFields((current) => current.filter((_, fieldIndex) => fieldIndex !== index))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Launch form</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Creating the form generates a public URL, a QR code, and a private manage link.
        </p>
        {state.message ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.message}</p>
        ) : null}
        <Button type="submit" disabled={pending} className="mt-5 w-full">
          {pending ? "Creating..." : "Create form"}
        </Button>
      </aside>
    </form>
  );
}
