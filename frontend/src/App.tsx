import { BrowserRouter, Route, Routes } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import CustomersAdmin from "./pages/admin/CustomersAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import Products from "./pages/store/Products";
import ProductDetails from "./pages/store/ProductDetails";
import Cart from "./pages/store/Cart";
import Checkout from "./pages/store/Checkout";
import PaymentSuccess from "./pages/store/PaymentSuccess";
import PaymentCancelled from "./pages/store/PaymentCancelled";

import StoreLayout from "./layouts/StoreLayout";
import Home from "./pages/store/Home";

function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ padding: "40px", color: "#111" }}>
      <h1>{title}</h1>
      <p>This section is coming next.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER STORE */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route 
            path="/products" 
            element={<Products />} 
          />

          <Route path="/products" element={<Products />} />

          <Route
            path="/products/:slug"
            element={<ProductDetails />}
          />

          <Route path="/cart" element={<Cart />} />
          
          <Route
            path="/cart"
            element={<Cart/>}
          />

          <Route
            path="/payment/success"
            element={<PaymentSuccess />}
          />

          <Route
            path="/payment/cancelled"
            element={<PaymentCancelled />}
          />
          <Route
            path="/account"
            element={<Placeholder title="My Account" />}
          />
          <Route
            path="/orders"
            element={<Placeholder title="My Orders" />}
          />
          <Route
            path="/contact"
            element={<Placeholder title="Contact Us" />}
          />
          <Route
            path="/faq"
            element={<Placeholder title="FAQs" />}
          />
          <Route
            path="/deals"
            element={<Placeholder title="Deals" />}
          />
          <Route
            path="/privacy"
            element={<Placeholder title="Privacy Policy" />}
          />
          <Route
            path="/terms"
            element={<Placeholder title="Terms & Conditions" />}
          />
          <Route 
            path="/checkout" 
            element={<Checkout />} 
          />
        </Route>

        {/* ADMIN PANEL */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="customers" element={<CustomersAdmin />} />
          <Route
            path="sales"
            element={<Placeholder title="Sales" />}
          />
          <Route
            path="settings"
            element={<Placeholder title="Settings" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;