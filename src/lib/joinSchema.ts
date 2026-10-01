import { z } from "zod";

/**
 * Validation rules for the "Join the Next Hash" form.
 *
 * There is no backend, so this guards what the visitor types before their own
 * mail client opens. Kept in its own module so the form component file exports
 * only a component.
 */
/** Yes/No choices offered for the first-time Hasher question. */
export const FIRST_TIME_OPTIONS = [
  { value: "yes", label: "Yes, this would be my first Hash" },
  { value: "no", label: "No, I have run with a Hash before" },
] as const;

export const joinSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Please keep your name under 80 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter your valid email address."),
  telephone: z
    .string()
    .trim()
    .min(1, "Please enter your telephone number.")
    .regex(/^[+()\-\s\d]{7,20}$/, "Please enter a valid telephone number."),
  experience: z
    .string()
    .trim()
    .min(1, "Please tell us how you take part.")
    .max(120, "Please keep this under 120 characters."),
  /* Required, but either answer is valid: returning Hashers are welcome and
     may be exempted from the three-run requirement. */
  isFirstTime: z.enum(["yes", "no"], {
    error: "Please choose yes or no.",
  }),
  message: z
    .string()
    .trim()
    .max(1000, "Please keep your message under 1000 characters.")
    .optional(),
});

export type JoinFormValues = z.infer<typeof joinSchema>;

/**
 * Builds the pre-filled email body handed to the visitor's mail client.
 *
 * The site transmits nothing, so this is the only delivery mechanism available.
 */
export function buildEmailBody(values: JoinFormValues): string {
  return [
    `Name: ${values.fullName}`,
    `Email: ${values.email}`,
    `Telephone: ${values.telephone}`,
    `Experience: ${values.experience}`,
    `First-time Hasher: ${
      values.isFirstTime === "yes" ? "Yes" : "No"
    }`,
    "",
    "Message:",
    values.message?.trim() || "(no message)",
    "",
    "--",
    "Sent from the West West Hash House Harriers website.",
  ].join("\n");
}

/** Composes the `mailto:` URL, with subject and body percent-encoded. */
export function buildMailtoUrl(values: JoinFormValues, to: string): string {
  const subject = `Join the Next Hash — ${values.fullName}`;
  return (
    `${to}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(buildEmailBody(values))}`
  );
}
