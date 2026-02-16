import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { CLIENT_ROUTES } from "../../constants/routeConfig";
import Sidebar from "../Sidebar";

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarWidth, _] = useState(240);

  // Client routes - no permission filtering, show all routes
  const allowedRoutes = CLIENT_ROUTES;

  const handleNavigate = async (path: string, _: string) => {
    navigate(path);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar routes={allowedRoutes} onNavigate={handleNavigate} />
      <main
        className="flex-1 p-6 transition-all duration-300"
        style={{
          marginLeft: sidebarWidth === 60 ? "60px" : "240px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
