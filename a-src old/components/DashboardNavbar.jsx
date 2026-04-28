import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import Logout from "./Logout";

const DashboardNavbar = ({ openSideNav, setOpenSideNav }) => {
  const { pathname } = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleOpenLogout = () => setOpenModal(!openModal);
  const pathSegments = pathname.split("/").filter((el) => el !== "");

  return (
    <Navbar
      className="sticky top-4 z-40 py-2 bg-gradient-to-br from-gray-800 to-gray-700 text-white shadow-lg shadow-blue-900 rounded-xl"
      fullWidth
      blurred
    >
      <div className="flex justify-between items-center">
        <Typography
          variant="small"
          color="white"
          className="font-normal transition-all hover:text-blue-500 hover:opacity-100"
        >
          Home
        </Typography>

        <div className="flex items-center gap-1">
          <IconButton
            variant="text"
            color="white"
            className="grid xl:hidden p-1"
            onClick={() => setOpenSideNav(!openSideNav)}
          >
            <Bars3Icon className="h-5 w-5 text-white" />
          </IconButton>
          
          <Menu
            open={profileMenuOpen}
            handler={setProfileMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <IconButton variant="text" color="white" className="p-1">
                <UserCircleIcon className="h-5 w-5 text-white" />
              </IconButton>
            </MenuHandler>
            <MenuList className="bg-gray-700">
              <Link to="/change-password" className="text-black">
                <MenuItem className="bg-white text-black">
                  Change Password
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
          
          <IconButton variant="text" color="white" onClick={handleOpenLogout} className="p-1">
            <HiArrowRightStartOnRectangle className="h-5 w-5 text-white" />
          </IconButton>
        </div>
      </div>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
    </Navbar>
  );
};

export default DashboardNavbar;