import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ContextPanel } from "../utils/ContextPanel";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const adminType = localStorage.getItem("admin-type");
  const detailsView = localStorage.getItem("details-view");
  const { isPanelUp } = useContext(ContextPanel);
  const location = useLocation();
  const path = location.pathname;

  if (!token || !isPanelUp?.success) {
    return <Navigate to="/" />;
  }

  const userRoutesType0 = ["/home", "/user-profile"];
  const userRoutesType1 = [
    "/home",
    "/user-profile",
    "/about",
    "/portfolio",
    "/enquiry",
    "/mission-vision",
  ];

  if (adminType === "admin" || adminType === "superadmin") {
    return element;
  } else if (
    adminType === "user" &&
    detailsView === "0" &&
    userRoutesType0.includes(path)
  ) {
    return element;
  } else if (
    adminType === "user" &&
    detailsView === "1" &&
    userRoutesType1.includes(path)
  ) {
    return element;
  } else {
    return <Navigate to="/home" />;
  }
};

export default ProtectedRoute;


