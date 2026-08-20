import styles from "./StatusBadge.module.css";

const statusClasses = {
  Active: "active", Completed: "completed", Inactive: "inactive", VALID: "valid", REVOKED: "revoked", New: "new", Contacted: "contacted", "In Progress": "progress", Converted: "converted", Closed: "closed",
};

export default function StatusBadge({ status }) {
  return <span className={`${styles.badge} ${styles[statusClasses[status] || "default"]}`}>{status}</span>;
}