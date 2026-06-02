// Cart page placeholder
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";

function Cart() {
  const { businessId, tableNumber, token } = useParams();

  const { cartItems, removeFromCart, clearCart, totalAmount } = useCart();

  const buildMenuPath = () =>
    token
      ? `/menu/${businessId}/table/${tableNumber}/${token}`
      : `/menu/${businessId}/table/${tableNumber}`;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          reject("Location permission denied");
        }
      );
    });
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (cartItems.length === 0) {
        setMessage("Cart is empty");
        setLoading(false);
        return;
      }

      const location = await getCurrentLocation();

      const res = await API.post("/api/orders", {
        businessId,
        tableNumber: Number(tableNumber),
        items: cartItems,
        totalAmount,
        customerLat: location.lat,
        customerLng: location.lng
      });

      setMessage(res.data.message);
      clearCart();

      setTimeout(() => {
        navigate(buildMenuPath());
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error ||
          "Order failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      padding: 20,
      maxWidth: 960,
      margin: "0 auto",
      minHeight: "calc(100vh - 80px)",
      display: "flex",
      flexDirection: "column",
      gap: 20
    },
    header: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12
    },
    title: {
      margin: 0,
      fontSize: 28,
      letterSpacing: "0.02em"
    },
    summary: {
      color: "#333",
      fontSize: 16,
      minWidth: 180,
      textAlign: "right"
    },
    message: {
      padding: "14px 16px",
      borderRadius: 12,
      background: "#f0f5ff",
      color: "#0f2d72",
      border: "1px solid #d6e4ff"
    },
    empty: {
      borderRadius: 18,
      border: "1px dashed #ccc",
      padding: 32,
      textAlign: "center",
      color: "#555",
      background: "#fafafa"
    },
    list: {
      display: "grid",
      gap: 16
    },
    card: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 14,
      padding: 18,
      borderRadius: 18,
      border: "1px solid #e2e8f0",
      background: "#ffffff",
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)"
    },
    itemInfo: {
      display: "grid",
      gap: 8
    },
    itemTitle: {
      margin: 0,
      fontSize: 18,
      fontWeight: 600
    },
    itemMeta: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      alignItems: "center",
      color: "#555",
      fontSize: 14
    },
    badge: {
      padding: "4px 10px",
      borderRadius: 999,
      background: "#eef2ff",
      color: "#4338ca",
      fontSize: 12,
      fontWeight: 600
    },
    itemActions: {
      display: "grid",
      gap: 10,
      justifyContent: "end",
      alignItems: "start"
    },
    remove: {
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #e2e8f0",
      background: "#fff",
      color: "#1f2937",
      cursor: "pointer"
    },
    footer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: 18,
      borderRadius: 18,
      background: "#f8fafc",
      border: "1px solid #e2e8f0"
    },
    total: {
      margin: 0,
      fontSize: 20,
      fontWeight: 700
    },
    actions: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10
    },
    primaryBtn: {
      padding: "14px 22px",
      borderRadius: 14,
      border: "none",
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 700,
      minWidth: 150
    },
    secondaryBtn: {
      padding: "14px 22px",
      borderRadius: 14,
      border: "1px solid #cbd5e1",
      background: "#fff",
      color: "#111827",
      cursor: "pointer",
      minWidth: 150
    }
  };

  const confirmRemove = (productId) => {
    const item = cartItems.find((entry) => entry.productId === productId);
    if (!item) return;
    if (window.confirm(`Remove ${item.name} from your cart?`)) {
      removeFromCart(productId);
    }
  };

  const confirmClear = () => {
    if (cartItems.length === 0) return;
    if (window.confirm("Clear all items from your cart?")) {
      clearCart();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Your Cart</h2>
          <p style={{ margin: "8px 0 0", color: "#4b5563" }}>
            Review your order, change quantities, and place it when ready.
          </p>
        </div>

        <div style={styles.summary}>
          <div>Items: {cartItems.length}</div>
          <div style={{ marginTop: 6, fontWeight: 600 }}>
            Total: Rs. {totalAmount}
          </div>
        </div>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {cartItems.length === 0 ? (
        <div style={styles.empty}>
          <h3 style={{ margin: 0 }}>No items in cart yet</h3>
          <p style={{ margin: "12px 0 0", color: "#6b7280" }}>
            Browse the menu and add dishes to your cart. Then come back here to place your order.
          </p>
          <button
            style={{
              ...styles.primaryBtn,
              marginTop: 18,
              width: "100%",
              maxWidth: 240
            }}
            onClick={() => navigate(buildMenuPath())}
          >
            Back to menu
          </button>
        </div>
      ) : (
        <>
          <div style={styles.list}>
            {cartItems.map((item) => (
              <div key={item.productId} style={styles.card}>
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemTitle}>{item.name}</h3>
                  <div style={styles.itemMeta}>
                    <div>Qty: {item.quantity}</div>
                    <div style={styles.badge}>Rs. {item.price}</div>
                    <div style={styles.badge}>
                      Subtotal: Rs. {item.price * item.quantity}
                    </div>
                  </div>
                </div>
                <div style={styles.itemActions}>
                  <button
                    style={styles.remove}
                    onClick={() => confirmRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <p style={styles.total}>Grand Total: Rs. {totalAmount}</p>
            <div style={styles.actions}>
              <button
                style={styles.secondaryBtn}
                onClick={() => navigate(buildMenuPath())}
              >
                Back to Menu
              </button>
              <button style={styles.secondaryBtn} onClick={confirmClear}>
                Clear Cart
              </button>
              <button style={styles.primaryBtn} onClick={placeOrder} disabled={loading}>
                {loading ? "Finding location..." : "Place Order"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;