import VerifyCertificate from "@/components/verify/VerifyCertificate";
import { SITE_NAME } from "@/config/site";

export const metadata = {
  title: `Verify Certificate | ${SITE_NAME}`,
  description:
    `Verify certificates issued by ${SITE_NAME}.`,
};

export default function VerifyCertificatePage() {
  return <VerifyCertificate />;
}