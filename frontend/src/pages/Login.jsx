import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("rahul@example.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>QR WAY</div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>
          Sign in to access your business dashboard
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submitHandler}>
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
                placeholder="Enter your password"
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

          <button type="submit" style={styles.loginBtn}>
            Sign In
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create Account
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
    maxWidth: "430px",
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

  loginBtn: {
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
    transition: "0.3s",
    boxShadow: "0 4px 15px rgba(37,99,235,0.25)",
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

export default Login;