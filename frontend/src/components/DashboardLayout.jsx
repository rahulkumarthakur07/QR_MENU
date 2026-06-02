import Sidebar from "./Sidebar";
import styles from "./DashboardLayout.module.css";

function DashboardLayout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.pageWrapper}>{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
