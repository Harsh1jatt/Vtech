import { WHATSAPP_NUMBER } from "@/config/site";

export function createWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppMessage(message) {
  const url = createWhatsAppUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
  return url;
}
