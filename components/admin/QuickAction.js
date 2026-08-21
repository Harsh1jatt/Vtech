import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./AdminDashboard.module.css";

export default function QuickAction({
  href,
  title,
  description,
  icon: Icon,
}) {
  return (
    <Link href={href} className={styles.quickAction}>
      <span className={styles.quickIcon}>
        <Icon size={18} />
      </span>

      <span className={styles.quickContent}>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <ArrowRight
        size={16}
        className={styles.quickArrow}
        aria-hidden="true"
      />
    </Link>
  );
}