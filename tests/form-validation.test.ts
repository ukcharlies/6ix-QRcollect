import { describe, expect, it } from "vitest";
import {
  fieldInputSchema,
  normalizeFields,
  validateResponseData,
} from "../src/lib/form-schema";

describe("form schema", () => {
  it("normalizes valid fields and removes blank select options", () => {
    const fields = normalizeFields([
      {
        id: "name",
        label: "Full name",
        type: "text",
        required: true,
        placeholder: "Jane Doe",
      },
      {
        id: "role",
        label: "Role",
        type: "select",
        required: false,
        options: ["Designer", "", "Engineer"],
      },
    ]);

    expect(fields).toEqual([
      {
        id: "name",
        label: "Full name",
        type: "text",
        required: true,
        placeholder: "Jane Doe",
      },
      {
        id: "role",
        label: "Role",
        type: "select",
        required: false,
        options: ["Designer", "Engineer"],
      },
    ]);
  });

  it("rejects fields without labels", () => {
    expect(() =>
      fieldInputSchema.parse({
        id: "bad",
        label: "",
        type: "email",
        required: false,
      }),
    ).toThrow();
  });

  it("validates required fields and email format before response save", () => {
    const fields = normalizeFields([
      { id: "email", label: "Email", type: "email", required: true },
      { id: "notes", label: "Notes", type: "textarea", required: false },
    ]);

    const result = validateResponseData(fields, {
      email: "not-an-email",
      notes: "Hello",
    });

    expect(result.success).toBe(false);
    expect(result.errors).toEqual({ email: "Enter a valid email address." });
  });

  it("returns clean response data for valid submissions", () => {
    const fields = normalizeFields([
      { id: "email", label: "Email", type: "email", required: true },
      { id: "subscribe", label: "Subscribe", type: "checkbox", required: false },
    ]);

    const result = validateResponseData(fields, {
      email: "person@example.com",
      subscribe: "on",
    });

    expect(result).toEqual({
      success: true,
      data: {
        email: "person@example.com",
        subscribe: true,
      },
      errors: {},
    });
  });
});
