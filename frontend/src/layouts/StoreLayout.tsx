import { Outlet } from "react-router-dom";
import StoreFooter from "../components/store/StoreFooter";
import StoreHeader from "../components/store/StoreHeader";

function StoreLayout() {
  return (
    <div className="store-layout">
      <StoreHeader />

      <main>
        <Outlet />
      </main>

      <StoreFooter />
    </div>
  );
}

export default StoreLayout;