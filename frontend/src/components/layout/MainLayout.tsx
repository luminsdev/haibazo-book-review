import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex bg-paper text-ink font-sans">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div
          key={location.pathname}
          className="max-w-5xl px-12 py-16 animate-rise"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
