import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowDownTrayIcon,
  BriefcaseIcon,
  ChatBubbleLeftIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  InformationCircleIcon,
  ShareIcon,
  UserCircleIcon,
  UserIcon,
  UserMinusIcon,
  UserPlusIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import {
  MdOutlineContactPage,
  MdOutlineFeedback,
  MdOutlineGroupAdd,
  MdOutlineGroupRemove,
  MdOutlineGroups,
  MdOutlineMoney,
} from "react-icons/md";
import { ButtonConfig } from "../config/ButtonConfig";

const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  const adminType = localStorage.getItem("admin-type");
  const detailsView = localStorage.getItem("details-view");
  const [openUsersMenu, setOpenUsersMenu] = useState(false);
  const [openMeetingsMenu, setOpenMeetingsMenu] = useState(false);

  // Check if the current path is in the users submenu to auto-expand
  useEffect(() => {
    const userPaths = [
      "/new-user",
      "/active-user",
      "/inactive-user",
      "/mobile-user",
    ];
    if (userPaths.some((path) => pathname.includes(path))) {
      setOpenUsersMenu(true);
    }

    const meetingPaths = [
      "/new-meeting",
      "/active-meeting",
      "/inactive-meeting",
    ];
    if (meetingPaths.some((path) => pathname.includes(path))) {
      setOpenMeetingsMenu(true);
    }
  }, [pathname]);

  const handleMeetingsButtonClick = () => {
    setOpenMeetingsMenu(!openMeetingsMenu);
  };

  const handleUsersButtonClick = () => {
    setOpenUsersMenu(!openUsersMenu);
  };

  // Enhanced sidebar styles
  const sidebarStyle =
    "bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg shadow-pink-900/20 backdrop-blur-sm";

  // Close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenSideNav]);

  // Close sidebar on route change
  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  // Menu items definitions
  const menuItems = [
    {
      to: "/home",
      icon: <HomeIcon className="w-5 h-5 text-inherit" />,
      text: "Dashboard",
      roles: ["admin", "superadmin", "user", "userType1"],
    },
    {
      to: "/user-profile",
      icon: <UserCircleIcon className="w-5 h-5 text-inherit" />,
      text: "Profile",
      roles: ["admin", "superadmin", "user", "userType1"],
    },
    {
      to: "/about",
      icon: <InformationCircleIcon className="w-5 h-5 text-inherit" />,
      text: "About Us",
      roles: ["admin", "superadmin", "userType1"],
    },
    {
      to: "/mission-vision",
      icon: <InformationCircleIcon className="w-5 h-5 text-inherit" />,
      text: "Mission & Vision",
      roles: ["admin", "superadmin", "userType1"],
    },
    {
      to: "/portfolio",
      icon: <BriefcaseIcon className="w-5 h-5 text-inherit" />,
      text: "Portfolio",
      roles: ["admin", "superadmin", "userType1"],
    },
    {
      to: "/enquiry",
      icon: <ChatBubbleLeftIcon className="w-5 h-5 text-inherit" />,
      text: "Enquiry",
      roles: ["admin", "superadmin", "userType1"],
    },
  ];

  // User submenu items
  const menuItems1 = [
    {
      to: "/new-user",
      icon: <UserPlusIcon className="w-5 h-5 text-inherit" />,
      text: "New User",
      roles: ["admin", "superadmin"],
    },
    {
      to: "/active-user",
      icon: <UserIcon className="w-5 h-5 text-inherit" />,
      text: "Active User",
      roles: ["admin", "superadmin"],
    },
    {
      to: "/inactive-user",
      icon: <UserMinusIcon className="w-5 h-5 text-inherit" />,
      text: "Inactive User",
      roles: ["admin", "superadmin"],
    },
    {
      to: "/mobile-user",
      icon: <DevicePhoneMobileIcon className="w-5 h-5 text-inherit" />,
      text: "Mobile User",
      roles: ["admin", "superadmin"],
    },
  ];

  const menuItems2 = [
    {
      to: "/active-meeting",
      icon: <MdOutlineGroups className="w-5 h-5 text-inherit" />,
      text: "Active",
      roles: ["admin", "superadmin"],
    },
    {
      to: "/inactive-meeting",
      icon: <MdOutlineGroupRemove className="w-5 h-5 text-inherit" />,
      text: "Inactive",
      roles: ["admin", "superadmin"],
    },
  ];
  // Bottom menu items
  const menuItems3 = [
    {
      to: "/lead-list",
      icon: <MdOutlineMoney className="w-5 h-5 text-inherit" />,
      text: "Lead",
      roles: ["superadmin"],
    },
    {
      to: "/feedback",
      icon: <MdOutlineFeedback className="w-5 h-5 text-inherit" />,
      text: "Feedback",
      roles: ["superadmin"],
    },
    {
      to: "/contact",
      icon: <MdOutlineContactPage className="w-5 h-5 text-inherit" />,
      text: "Contact",
      roles: ["superadmin"],
    },
    {
      to: "/share-user",
      icon: <ShareIcon className="w-5 h-5 text-inherit" />,
      text: "Share User",
      roles: ["admin", "superadmin"],
    },
    {
      to: "/download",
      icon: <ArrowDownTrayIcon className="w-5 h-5 text-inherit" />,
      text: "Download",
      roles: ["admin", "superadmin"],
    },
  ];

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    if (adminType === "superadmin") {
      return menuItems;
    }
    if (adminType === "admin") {
      return menuItems.filter((item) => item.roles.includes("admin"));
    }
    if (adminType === "user") {
      return detailsView === "0"
        ? menuItems.filter((item) => item.roles.includes("user"))
        : menuItems.filter((item) => item.roles.includes("userType1"));
    }
    return [];
  };

  const getFilteredMenuItems1 = () => {
    if (adminType === "superadmin") {
      return menuItems1;
    }
    if (adminType === "admin") {
      return menuItems1.filter((item) => item.roles.includes("admin"));
    }
    if (adminType === "user") {
      return detailsView === "0"
        ? menuItems1.filter((item) => item.roles.includes("user"))
        : menuItems1.filter((item) => item.roles.includes("userType1"));
    }
    return [];
  };
  const getFilteredMenuItems2 = () => {
    if (adminType === "superadmin") {
      return menuItems2;
    }
    if (adminType === "admin") {
      return menuItems2.filter((item) => item.roles.includes("admin"));
    }
    if (adminType === "user") {
      return detailsView === "0"
        ? menuItems2.filter((item) => item.roles.includes("user"))
        : menuItems2.filter((item) => item.roles.includes("userType1"));
    }
    return [];
  };

  const getFilteredMenuItems3 = () => {
    if (adminType === "superadmin") {
      return menuItems3;
    }
    if (adminType === "admin") {
      return menuItems3.filter((item) => item.roles.includes("admin"));
    }
    if (adminType === "user") {
      return detailsView === "0"
        ? menuItems3.filter((item) => item.roles.includes("user"))
        : menuItems3.filter((item) => item.roles.includes("userType1"));
    }
    return [];
  };

  // Check if current path is active
  const isActiveLink = (path) => pathname === path;

  return (
    <aside
      ref={sidenavRef}
      className={`${sidebarStyle} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-all duration-300 ease-in-out xl:translate-x-0 border border-blue-gray-100/30 backdrop-blur-sm`}
      style={{
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="relative bg-white rounded-t-xl overflow-hidden shadow-md">
        <div className="flex items-center justify-center p-4 hover:bg-pink-50 transition-colors duration-300">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 w-auto transition-transform duration-300 hover:scale-105"
          />
        </div>
        {/* <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={true}
          className=""
         
        > */}
        <XMarkIcon
          onClick={() => setOpenSideNav(false)}
          strokeWidth={2.5}
          className=" absolute right-0 top-0 grid rounded-br-lg rounded-tl-lg xl:hidden hover:bg-red-600/10 transition-colors duration-300 h-6 w-6 text-black"
        />
        {/* </IconButton> */}
      </div>
      <div className="m-4 overflow-y-auto lg:h-[calc(100vh-150px)] md:h-[calc(100vh-200px)] h-[calc(100vh-200px)] custom-scroll">
        <ul className="mb-4 flex flex-col gap-1">
          {getFilteredMenuItems().map((item) => (
            <li
              key={item.to}
              className="transform transition-transform duration-200 hover:translate-x-1"
            >
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color={isActive ? `${ButtonConfig.sidebarColor}` : "white"}
                    className={`flex items-center gap-4 px-4 py-2.5 text-sm md:text-base capitalize ${
                      isActive ? "shadow-md" : ""
                    } transition-all duration-300 hover:bg-pink-500/20`}
                    fullWidth
                  >
                    <span className={`${isActive ? "text-white" : ""}`}>
                      {item.icon}
                    </span>
                    <Typography
                      color="inherit"
                      className={`font-medium capitalize ${
                        isActive ? "text-white" : "text-gray-300"
                      } transition-colors duration-300`}
                    >
                      {item.text}
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
          ))}

          {/* Users Dropdown */}
          {getFilteredMenuItems1().length > 0 && (
            <li className="transform transition-transform duration-200 hover:translate-x-1">
              <div>
                <Button
                  variant={openUsersMenu ? "gradient" : "text"}
                  color={
                    openUsersMenu ? `${ButtonConfig.sidebarColor}` : "white"
                  }
                  className={`flex items-center justify-between px-4 py-2.5 capitalize transition-all duration-300 hover:bg-pink-500/20 ${
                    openUsersMenu ? "shadow-md" : ""
                  }`}
                  fullWidth
                  onClick={handleUsersButtonClick}
                >
                  <div className="flex items-center gap-4">
                    <UserPlusIcon className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className={`font-medium capitalize ${
                        openUsersMenu ? "text-white" : "text-gray-300"
                      } transition-colors duration-300`}
                    >
                      Users
                    </Typography>
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openUsersMenu ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Submenu with smooth animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openUsersMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="ml-6 mt-1 border-l border-gray-700/50 pl-2">
                    {getFilteredMenuItems1().map((item) => (
                      <li
                        key={item.to}
                        className="transform transition-transform duration-200 hover:translate-x-1 my-1"
                      >
                        <NavLink to={item.to}>
                          {({ isActive }) => (
                            <Button
                              variant={isActive ? "gradient" : "text"}
                              color={
                                isActive
                                  ? `${ButtonConfig.sidebarColor}`
                                  : "white"
                              }
                              className={`flex items-center gap-4 px-4 py-2 text-sm capitalize ${
                                isActive ? "shadow-md" : ""
                              } transition-all duration-300 hover:bg-pink-500/20`}
                              fullWidth
                            >
                              <span
                                className={`${isActive ? "text-white" : ""}`}
                              >
                                {item.icon}
                              </span>
                              <Typography
                                color="inherit"
                                className={`font-medium capitalize ${
                                  isActive ? "text-white" : "text-gray-300"
                                } transition-colors duration-300`}
                              >
                                {item.text}
                              </Typography>
                            </Button>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          )}

          {/* meeting Dropdown */}
          {getFilteredMenuItems2().length > 0 && (
            <li className="transform transition-transform duration-200 hover:translate-x-1">
              <div>
                <Button
                  variant={openMeetingsMenu ? "gradient" : "text"}
                  color={
                    openMeetingsMenu ? `${ButtonConfig.sidebarColor}` : "white"
                  }
                  className={`flex items-center justify-between px-4 py-2.5 capitalize transition-all duration-300 hover:bg-pink-500/20 ${
                    openMeetingsMenu ? "shadow-md" : ""
                  }`}
                  fullWidth
                  onClick={handleMeetingsButtonClick}
                >
                  <div className="flex items-center gap-4">
                    <MdOutlineGroups className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className={`font-medium capitalize ${
                        openMeetingsMenu ? "text-white" : "text-gray-300"
                      } transition-colors duration-300`}
                    >
                      Meetings
                    </Typography>
                  </div>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openMeetingsMenu ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Submenu with smooth animation */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openMeetingsMenu
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="ml-6 mt-1 border-l border-gray-700/50 pl-2">
                    {getFilteredMenuItems2().map((item) => (
                      <li
                        key={item.to}
                        className="transform transition-transform duration-200 hover:translate-x-1 my-1"
                      >
                        <NavLink to={item.to}>
                          {({ isActive }) => (
                            <Button
                              variant={isActive ? "gradient" : "text"}
                              color={
                                isActive
                                  ? `${ButtonConfig.sidebarColor}`
                                  : "white"
                              }
                              className={`flex items-center gap-4 px-4 py-2 text-sm capitalize ${
                                isActive ? "shadow-md" : ""
                              } transition-all duration-300 hover:bg-pink-500/20`}
                              fullWidth
                            >
                              <span
                                className={`${isActive ? "text-white" : ""}`}
                              >
                                {item.icon}
                              </span>
                              <Typography
                                color="inherit"
                                className={`font-medium capitalize ${
                                  isActive ? "text-white" : "text-gray-300"
                                } transition-colors duration-300`}
                              >
                                {item.text}
                              </Typography>
                            </Button>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          )}

          {/* Bottom menu items */}
          {getFilteredMenuItems3().map((item) => (
            <li
              key={item.to}
              className="transform transition-transform duration-200 hover:translate-x-1"
            >
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color={isActive ? `${ButtonConfig.sidebarColor}` : "white"}
                    className={`flex items-center gap-4 px-4 py-2.5 text-sm md:text-base capitalize ${
                      isActive ? "shadow-md" : ""
                    } transition-all duration-300 hover:bg-pink-500/20`}
                    fullWidth
                  >
                    <span className={`${isActive ? "text-white" : ""}`}>
                      {item.icon}
                    </span>
                    <Typography
                      color="inherit"
                      className={`font-medium capitalize ${
                        isActive ? "text-white" : "text-gray-300"
                      } transition-colors duration-300`}
                    >
                      {item.text}
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 w-full border-t rounded-b-lg border-gray-700 py-4 px-4 bg-gradient-to-t from-gray-900 to-gray-900">
        <div className="w-full text-center text-sm text-gray-400">
          <p className="animate-pulse">Updated On : March 30 2026 </p>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
