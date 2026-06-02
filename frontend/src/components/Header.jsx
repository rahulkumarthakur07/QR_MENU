import styles from "./Header.module.css";

function Header({ title, subtitle, children }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </div>
  );
}

export default Header;
