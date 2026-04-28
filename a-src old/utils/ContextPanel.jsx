import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);
  const userAdminType = localStorage.getItem("admin-type");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/panel-check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);

      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPaths = [
          "/home",
          "/user-profile",
          "/about",
          "/mission-vision",
          "/portfolio",
          "/enquiry",
          "/new-user",
          "/user-view",
          "/active-user",
          "/inactive-user",
          "/mobile-user",
          "/feedback",
          "/contact",
          "/share-user",
          "/share-view",
          "/download",
          "/change-password",
          "/active-meeting",
          "/inactive-meeting",
          "/lead-list",
        ];
        if (allowedPaths.includes(currentPath)) {
          navigate(currentPath);
        } else {
          navigate("/home");
        }
      } else {
        const publicPaths = ["/login", "/register", "/forget-password"];
        if (publicPaths.includes(currentPath)) {
          navigate(currentPath);
        } else {
          navigate("/login");
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp, userAdminType }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
