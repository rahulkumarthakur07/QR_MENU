import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BusinessSettings from "./pages/BusinessSettings";
import Products from "./pages/Products";
import Tables from "./pages/Tables";
import Orders from "./pages/Orders";
import PublicMenu from "./pages/PublicMenu";
import Cart from "./pages/Cart";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/business"
        element={
          <PrivateRoute>
            <BusinessSettings />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/products"
        element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/tables"
        element={
          <PrivateRoute>
            <Tables />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />

      <Route path="/menu/:businessId/table/:tableNumber/:token?" element={<PublicMenu />} />
      <Route path="/cart/:businessId/table/:tableNumber/:token?" element={<Cart />} />
    </Routes>
  );
}

export default App;