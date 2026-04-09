/** Formspree endpoint from https://formspree.io — set NEXT_PUBLIC_FORMSPREE_FORM_ID in env. */
export function getFormspreeFormAction(): string | null {
  const raw = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
  if (!raw) return null;
  const id = raw
    .replace(/^https?:\/\/formspree\.io\/f\//i, "")
    .replace(/^f\//, "")
    .replace(/\/$/, "");
  if (!id) return null;
  return `https://formspree.io/f/${id}`;
}
