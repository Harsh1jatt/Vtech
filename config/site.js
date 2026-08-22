export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "VTech Computer & Educational Institute";
export const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "VTECH";
export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Practical computer education and career-focused training at VTech Institute.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "9855260786";
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || CONTACT_PHONE).replace(/\D/g, "");
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Vtech4186@gmail.com";
export const ADDRESS = process.env.NEXT_PUBLIC_ADDRESS || "#1326, Prem Vihar, Main Road, Subhash Nagar, Ludhiana";
export const CITY = process.env.NEXT_PUBLIC_CITY || "Ludhiana";
export const STATE = process.env.NEXT_PUBLIC_STATE || "Punjab";
export const BUSINESS_HOURS = process.env.NEXT_PUBLIC_BUSINESS_HOURS || "Mon – Sat, 9:00 AM – 7:00 PM";
export const GOOGLE_MAPS_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "";
export const SOCIAL_LINKS = {
	facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
	instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
	youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
	linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
};
