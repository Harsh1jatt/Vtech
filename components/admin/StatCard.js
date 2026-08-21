import styles from "./AdminDashboard.module.css";

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "green",
}) {
  return (
    <article className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[tone]}`}>
        <Icon size={19} />
      </div>

      <div className={styles.statContent}>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}