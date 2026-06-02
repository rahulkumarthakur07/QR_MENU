import styles from "./StatCard.module.css";

function StatCard({ label, value, description, icon: Icon, variant = "default" }) {
  return (
    <div className={`${styles.statCard} ${styles[variant]}`}>
      {Icon && (
        <div className={styles.iconContainer}>
          <Icon size={24} />
        </div>
      )}
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}

export default StatCard;
