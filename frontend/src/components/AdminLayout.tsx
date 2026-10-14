import {
  BarChart3,
  Box,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Users,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Box,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ClipboardList,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    label: "Sales",
    path: "/admin/sales",
    icon: BarChart3,
  },
];

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon">
            <ShoppingBag size={22} />
          </div>

          <div>
            <strong>MEGATRONICS</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="admin-section-title">
          MANAGEMENT
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-item ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />

                <span>{item.label}</span>

                <ChevronRight
                  size={16}
                  className="nav-arrow"
                />
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <NavLink
            to="/admin/settings"
            className="admin-nav-item"
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>

          <NavLink
            to="/"
            className="admin-nav-item"
          >
            <Store size={19} />
            <span>View Store</span>
          </NavLink>

          <button className="admin-nav-item logout-button">
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="topbar-label">
              ADMINISTRATION
            </span>
          </div>

          <div className="admin-user">
            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Store Manager</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;