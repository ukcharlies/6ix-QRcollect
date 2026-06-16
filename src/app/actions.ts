"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createFormSchema, normalizeFields, parseStoredFields, validateResponseData } from "@/lib/form-schema";
import { createManageToken, createSlug } from "@/lib/tokens";

export type ActionState = {
  ok: boolean;
  message?: string;
};

export async function createFormAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const fieldsJson = String(formData.get("fields") ?? "[]");
  let fields: unknown;

  try {
    fields = JSON.parse(fieldsJson);
  } catch {
    return { ok: false, message: "Fields could not be parsed." };
  }

  const parsed = createFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    fields,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form details." };
  }

  let savedManageToken = "";

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = createSlug(parsed.data.title);
    const manageToken = createManageToken();

    try {
      const form = await prisma.form.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description || null,
          slug,
          manageToken,
          fields: normalizeFields(parsed.data.fields),
        },
        select: { manageToken: true },
      });
      savedManageToken = form.manageToken;
      break;
    } catch (error) {
      if (attempt === 4) {
        console.error(error);
        return { ok: false, message: "Could not create a unique form. Try again." };
      }
    }
  }

  redirect(`/manage/${savedManageToken}`);
}

export async function submitResponseAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const slug = String(formData.get("slug") ?? "");
  const form = await prisma.form.findUnique({ where: { slug } });

  if (!form) {
    return { ok: false, message: "This form could not be found." };
  }

  if (!form.isActive) {
    return { ok: false, message: "This form is not accepting responses." };
  }

  const fields = parseStoredFields(form.fields);
  const rawData = Object.fromEntries(fields.map((field) => [field.id, formData.get(field.id) ?? undefined]));
  const result = validateResponseData(fields, rawData);

  if (!result.success) {
    return { ok: false, message: Object.values(result.errors)[0] ?? "Check your response." };
  }

  await prisma.formResponse.create({
    data: {
      formId: form.id,
      data: result.data,
    },
  });

  redirect(`/f/${form.slug}?submitted=1`);
}

export async function toggleFormActiveAction(formData: FormData): Promise<void> {
  const manageToken = String(formData.get("manageToken") ?? "");
  const isActive = String(formData.get("isActive")) === "true";

  const form = await prisma.form.update({
    where: { manageToken },
    data: { isActive },
    select: { manageToken: true, slug: true },
  });

  revalidatePath(`/manage/${form.manageToken}`);
  revalidatePath(`/f/${form.slug}`);
}
