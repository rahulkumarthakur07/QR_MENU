import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { Settings, ShoppingCart, Grid, Clock } from "lucide-react";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className={styles.content}>
        <Header
          title="Dashboard"
          subtitle={`Welcome back, ${user?.name || "User"}! Here's an overview of your business.`}
        />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Access</h2>
          <div className={styles.statsGrid}>
            <Link to="/dashboard/business" className={styles.statLink}>
              <StatCard
                icon={Settings}
                label="Business Settings"
                value="Configure"
                description="Manage your business details and preferences"
              />
            </Link>

            <Link to="/dashboard/products" className={styles.statLink}>
              <StatCard
                icon={ShoppingCart}
                label="Products"
                value="Manage"
                description="Add and organize your menu items"
              />
            </Link>

            <Link to="/dashboard/tables" className={styles.statLink}>
              <StatCard
                icon={Grid}
                label="Tables & QR Codes"
                value="Generate"
                description="Create and download QR codes"
              />
            </Link>

            <Link to="/dashboard/orders" className={styles.statLink}>
              <StatCard
                icon={Clock}
                label="Orders"
                value="Monitor"
                description="Track and manage incoming orders"
              />
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Getting Started</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoBadge}>1</div>
              <h3>Set Up Your Business</h3>
              <p>Add your restaurant name, logo, and location details in Business Settings.</p>
              <Link to="/dashboard/business" className={styles.infoLink}>
                Go to Settings →
              </Link>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoBadge}>2</div>
              <h3>Create Menu Items</h3>
              <p>Organize your products into categories and set pricing and descriptions.</p>
              <Link to="/dashboard/products" className={styles.infoLink}>
                Manage Products →
              </Link>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoBadge}>3</div>
              <h3>Generate QR Codes</h3>
              <p>Create and print QR codes for each table in your restaurant.</p>
              <Link to="/dashboard/tables" className={styles.infoLink}>
                Generate QR Codes →
              </Link>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoBadge}>4</div>
              <h3>Monitor Orders</h3>
              <p>Track customer orders in real-time and manage their status.</p>
              <Link to="/dashboard/orders" className={styles.infoLink}>
                View Orders →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;