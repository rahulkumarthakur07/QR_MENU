import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import { Search, ShoppingCart } from "lucide-react";

function PublicMenu() {
  const { businessId, tableNumber, token } = useParams();

  const [business, setBusiness] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [validLink, setValidLink] = useState(true);

  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const businessRes = await API.get(`/api/public/business/${businessId}`);
        const menuRes = await API.get(`/api/public/menu/${businessId}`);

        const tableUrl = token
          ? `/api/public/table/${businessId}/${tableNumber}/${token}`
          : `/api/public/table/${businessId}/${tableNumber}`;

        await API.get(tableUrl);

        setBusiness(businessRes.data);
        setCategories(menuRes.data.categories);
        setProducts(menuRes.data.products);
      } catch (err) {
        setValidLink(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [businessId, tableNumber, token]);

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? p.categoryId?._id === selectedCategory
      : true;

    return matchSearch && matchCategory;
  });

  /* LOADING */
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <h2 style={{ marginTop: 16 }}>{business?.businessName || "Restaurant"}</h2>
        <p style={{ color: "#6b7280" }}>Loading menu...</p>
      </div>
    );
  }

  /* INVALID LINK */
  if (!validLink) {
    return (
      <div style={styles.center}>
        <h2>QR Code Expired</h2>
        <p style={{ color: "#6b7280" }}>
          Please request a new QR code from the restaurant.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>{business?.businessName}</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
            Table {tableNumber}
          </p>
        </div>

        {/* SEARCH */}
        <div style={styles.searchBox}>
          <Search size={16} color="#9ca3af" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food..."
            style={styles.input}
          />
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={styles.categoryRow}>
        <button
          onClick={() => setSelectedCategory("")}
          style={chip(selectedCategory === "")}
        >
          All
        </button>

        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setSelectedCategory(c._id)}
            style={chip(selectedCategory === c._id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div style={styles.grid}>
        {filteredProducts.map((p) => (
          <div
            key={p._id}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 18px 40px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.06)";
            }}
          >
            {/* IMAGE */}
            {p.imageUrl && (
              <div style={styles.imgWrap}>
                <img src={p.imageUrl} alt={p.name} style={styles.img} />
              </div>
            )}

            {/* CONTENT */}
            <div style={{ padding: 12 }}>
              <h4 style={{ margin: "0 0 6px 0" }}>{p.name}</h4>

              <p style={styles.desc}>{p.description}</p>

              <div style={styles.bottom}>
                <div>
                  <div style={styles.priceLabel}>Price</div>
                  <strong style={styles.price}>Rs. {p.price}</strong>
                </div>

                <button onClick={() => addToCart(p)} style={styles.addBtn}>
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CART FLOAT BUTTON */}
      <button
        onClick={() =>
          navigate(
            `/cart/${businessId}/table/${tableNumber}${
              token ? `/${token}` : ""
            }`
          )
        }
        style={styles.cartBtn}
      >
        <ShoppingCart size={16} />
        <span>{cartItems.length}</span>
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#f7f7fb",
    minHeight: "100vh",
    padding: 16,
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "Inter, sans-serif",
  },

  /* LOADING */
  loading: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: 45,
    height: 45,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #111827",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
  header: {
    background: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    border: "1px solid #e5e7eb",
  },

  searchBox: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },

  input: {
    border: "none",
    outline: "none",
    width: "100%",
    background: "transparent",
  },

  /* CATEGORY */
  categoryRow: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    marginBottom: 14,
  },

  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid #eee",
    transition: "0.25s",
    boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
  },

  imgWrap: {
    width: "100%",
    aspectRatio: "4 / 3",
    overflow: "hidden",
    background: "#eee",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  desc: {
    fontSize: 12,
    color: "#6b7280",
    minHeight: 30,
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  priceLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },

  price: {
    fontSize: 14,
  },

  addBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 13,
  },

  /* CART */
  cartBtn: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "14px 16px",
    display: "flex",
    gap: 8,
    alignItems: "center",
    boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
    cursor: "pointer",
  },
};

/* CHIP */
const chip = (active) => ({
  padding: "10px 14px",
  borderRadius: 999,
  border: active ? "1px solid #111827" : "1px solid #e5e7eb",
  background: active ? "#111827" : "#fff",
  color: active ? "#fff" : "#111827",
  whiteSpace: "nowrap",
  cursor: "pointer",
  fontSize: 13,
});

/* spinner animation */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }`,
  styleSheet.cssRules.length
);

export default PublicMenu;