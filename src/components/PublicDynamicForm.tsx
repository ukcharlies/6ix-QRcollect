"use client";

import { useActionState } from "react";
import { submitResponseAction, type ActionState } from "@/app/actions";
import type { FormField } from "@/lib/form-schema";
import { Button } from "./Button";

export function PublicDynamicForm({ slug, fields }: { slug: string; fields: FormField[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitResponseAction, { ok: true });

  return (
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="slug" value={slug} />
      {fields.map((field) => (
        <label key={field.id} className="grid gap-2 text-sm font-semibold text-slate-800">
          <span>
            {field.label}
            {field.required ? <span className="text-red-600"> *</span> : null}
          </span>
          {field.type === "textarea" ? (
            <textarea
              name={field.id}
              required={field.required}
              placeholder={field.placeholder}
              rows={4}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />
          ) : field.type === "select" ? (
            <select
              name={field.id}
              required={field.required}
              className="h-11 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Select an option</option>
              {(field.options ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <span className="flex items-center gap-3 rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-normal">
              <input name={field.id} type="checkbox" className="size-4 rounded border-slate-300" />
              {field.placeholder || "Yes"}
            </span>
          ) : (
            <input
              name={field.id}
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              className="h-11 rounded-md border border-slate-300 px-3 text-sm font-normal outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />
          )}
        </label>
      ))}
      {state.message ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.message}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit response"}
      </Button>
    </form>
  );
}
