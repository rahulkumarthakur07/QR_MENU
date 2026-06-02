import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, ClipboardList, LogOut, UserCircle2 } from "lucide-react";
import styles from "./ModernDashboardLayout.module.css";

const navItems = [
  {
    name: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    to: "/orders",
    icon: ClipboardList,
  },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <div className={styles.logoMark}>QM</div>
          <div>
            <p className={styles.appName}>QR Menu</p>
            <p className={styles.brandCaption}>Control center</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className={styles.profileArea}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <UserCircle2 size={20} />
          </div>
          <div>
            <p className={styles.userName}>Jessica Smith</p>
            <p className={styles.userRole}>Operations Lead</p>
          </div>
        </div>
        <button type="button" className={styles.logoutButton}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function Header({ title, description }) {
  if (!title) {
    return null;
  }

  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children, pageTitle, pageDescription }) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.pageShell}>
          <Header title={pageTitle} description={pageDescription} />
          <div className={styles.content}>{children}</div>
        </div>
      </main>
    </div>
  );
}
