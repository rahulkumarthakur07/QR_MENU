import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("Rahul");
  const [email, setEmail] = useState("rahul@example.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>QR WAY</div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>
          Register your business owner account
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submitHandler}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.registerBtn}>
            Create Account
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  logo: {
    fontSize: "55px",
    textAlign: "center",
    marginBottom: "10px",
  },

  title: {
    textAlign: "center",
    color: "#111827",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "30px",
    fontSize: "15px",
  },

  error: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#374151",
    fontWeight: "600",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    background: "#f9fafb",
    color: "#111827",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "18px",
  },

  registerBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 4px 15px rgba(37,99,235,0.25)",
    transition: "all 0.3s ease",
  },

  footer: {
    marginTop: "24px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Register;