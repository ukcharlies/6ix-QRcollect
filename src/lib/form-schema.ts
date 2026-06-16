import { z } from "zod";

export const fieldTypes = [
  "text",
  "email",
  "textarea",
  "number",
  "select",
  "checkbox",
] as const;

export type FieldType = (typeof fieldTypes)[number];

export const fieldInputSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/, "Field IDs may only contain letters, numbers, underscores, and hyphens."),
  label: z.string().trim().min(1, "Field label is required.").max(120),
  type: z.enum(fieldTypes),
  required: z.coerce.boolean().default(false),
  placeholder: z.string().trim().max(160).optional().or(z.literal("")),
  options: z.array(z.string().trim().max(80)).optional(),
});

export const createFormSchema = z.object({
  title: z.string().trim().min(1, "Form title is required.").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  fields: z.array(fieldInputSchema).min(1, "Add at least one field.").max(30),
});

export type FormField = z.infer<typeof fieldInputSchema>;
export type CreateFormInput = z.infer<typeof createFormSchema>;

export type ResponseValidationResult =
  | { success: true; data: Record<string, string | number | boolean>; errors: Record<string, string> }
  | { success: false; data?: never; errors: Record<string, string> };

export function normalizeFields(fields: unknown): FormField[] {
  const parsed = z.array(fieldInputSchema).parse(fields);
  const seen = new Set<string>();

  return parsed.map((field) => {
    if (seen.has(field.id)) {
      throw new Error(`Duplicate field ID: ${field.id}`);
    }
    seen.add(field.id);

    const normalized: FormField = {
      id: field.id,
      label: field.label,
      type: field.type,
      required: field.required,
    };

    if (field.placeholder) {
      normalized.placeholder = field.placeholder;
    }

    if (field.type === "select") {
      const options = (field.options ?? []).map((option) => option.trim()).filter(Boolean);
      if (options.length === 0) {
        throw new Error(`Select field "${field.label}" needs at least one option.`);
      }
      normalized.options = options;
    }

    return normalized;
  });
}

export function parseStoredFields(fields: unknown): FormField[] {
  return normalizeFields(fields);
}

export function validateResponseData(
  fields: FormField[],
  rawData: Record<string, FormDataEntryValue | string | undefined>,
): ResponseValidationResult {
  const errors: Record<string, string> = {};
  const data: Record<string, string | number | boolean> = {};

  for (const field of fields) {
    const rawValue = rawData[field.id];
    const value = typeof rawValue === "string" ? rawValue.trim() : "";

    if (field.type === "checkbox") {
      data[field.id] = rawValue === "on" || rawValue === "true";
      if (field.required && !data[field.id]) {
        errors[field.id] = "This field is required.";
      }
      continue;
    }

    if (field.required && !value) {
      errors[field.id] = "This field is required.";
      continue;
    }

    if (!value) {
      data[field.id] = "";
      continue;
    }

    if (field.type === "email") {
      const email = z.string().email().safeParse(value);
      if (!email.success) {
        errors[field.id] = "Enter a valid email address.";
        continue;
      }
    }

    if (field.type === "number") {
      const numberValue = Number(value);
      if (!Number.isFinite(numberValue)) {
        errors[field.id] = "Enter a valid number.";
        continue;
      }
      data[field.id] = numberValue;
      continue;
    }

    if (field.type === "select" && field.options?.length && !field.options.includes(value)) {
      errors[field.id] = "Choose a valid option.";
      continue;
    }

    data[field.id] = value;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data, errors: {} };
}
