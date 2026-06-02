import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Settings,
  ShoppingCart,
  Grid,
  Clock,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.module.css";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo Section */}
      <div className={styles.logoSection}>
        <Link to="/dashboard" className={styles.logo}>
          <BarChart3 size={24} />
          <span>QR Menu</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className={styles.nav}>
        <Link
          to="/dashboard"
          className={`${styles.navLink} ${isActive("/dashboard") && !location.pathname.includes("/dashboard/") ? styles.active : ""}`}
        >
          <BarChart3 size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/dashboard/business"
          className={`${styles.navLink} ${isActive("/dashboard/business") ? styles.active : ""}`}
        >
          <Settings size={20} />
          <span>Business</span>
        </Link>

        <Link
          to="/dashboard/products"
          className={`${styles.navLink} ${isActive("/dashboard/products") ? styles.active : ""}`}
        >
          <ShoppingCart size={20} />
          <span>Products</span>
        </Link>

        <Link
          to="/dashboard/tables"
          className={`${styles.navLink} ${isActive("/dashboard/tables") ? styles.active : ""}`}
        >
          <Grid size={20} />
          <span>Tables & QR</span>
        </Link>

        <Link
          to="/dashboard/orders"
          className={`${styles.navLink} ${isActive("/dashboard/orders") ? styles.active : ""}`}
        >
          <Clock size={20} />
          <span>Orders</span>
        </Link>
      </nav>

      {/* User Section */}
      <div className={styles.userSection}>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name || "User"}</p>
            <p className={styles.userEmail}>{user?.email || "No email"}</p>
          </div>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
