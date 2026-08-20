import { CONTACT_PHONE } from "@/config/site";

export const WHATSAPP_NUMBER = `91${CONTACT_PHONE}`;

export function createWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppMessage(message) {
  const url = createWhatsAppUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
