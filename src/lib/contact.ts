// Contact form submission. Posts to the Laravel API when configured, otherwise
// simulates a successful send so the storefront works standalone (mock path).
// NOTE: the backend route POST /api/contact is not yet implemented — add a
// ContactController + `Route::post('contact', ...)` to wire the live path.
import { apiSend, useApi } from "./http";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<string> {
  if (!useApi) {
    // Simulate network latency on the mock path.
    await new Promise((r) => setTimeout(r, 700));
    return "Thanks for reaching out — we'll reply within 24 hours.";
  }
  const res = await apiSend<{ message: string }>("POST", "/contact", payload);
  return res.message ?? "Thanks for reaching out — we'll reply within 24 hours.";
}
