// Orders page placeholder
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import styles from "./PageStyles.module.css";

function Orders() {
  const [business, setBusiness] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const businessRes = await API.get("/api/business/my-business");

    setBusiness(businessRes.data);

    if (businessRes.data) {
      const orderRes = await API.get(`/api/orders/business/${businessRes.data._id}`);
      setOrders(orderRes.data);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, status) => {
    await API.patch(`/api/orders/${orderId}/status`, {
      status
    });

    fetchOrders();
  };

  return (
    <DashboardLayout>
      <div className={styles.pageBody}>
        <Link className={styles.backLink} to="/dashboard">
          Back to dashboard
        </Link>

        <Header
          title="Orders"
          subtitle="Monitor order status and update fulfillment in real time."
        />

        {!business && <p className={styles.helperText}>Please create business first.</p>}

        <div className={styles.cardGrid}>
          {orders.map((order) => {
            const statusClass =
              order.status === "accepted"
                ? styles.badgeAccepted
                : order.status === "preparing"
                ? styles.badgePreparing
                : order.status === "completed"
                ? styles.badgeCompleted
                : styles.badgeRejected;

            return (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.formRow}>
                  <div>
                    <h3>Table {order.tableNumber}</h3>
                    <p className={styles.sectionHint}>Total: Rs. {order.totalAmount}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${statusClass}`}>
                    {order.status}
                  </span>
                </div>

                <div>
                  <h4 style={{ margin: 0, fontSize: 15, color: "#374151" }}>
                    Items
                  </h4>
                  {order.items.map((item, index) => (
                    <p key={index} style={{ margin: 0, color: "#4b5563" }}>
                      {item.quantity} x {item.name} - Rs. {item.price}
                    </p>
                  ))}
                </div>

                <div className={styles.orderActions}>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => updateStatus(order._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => updateStatus(order._id, "preparing")}
                  >
                    Preparing
                  </button>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => updateStatus(order._id, "completed")}
                  >
                    Completed
                  </button>
                  <button
                    className={styles.secondaryButton}
                    type="button"
                    onClick={() => updateStatus(order._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Orders;