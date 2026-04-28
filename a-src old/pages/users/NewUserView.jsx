import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Option,
  Select,
} from "@material-tailwind/react";
import {
  UserIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { FaEdit } from "react-icons/fa";
import { HiOutlineSave } from "react-icons/hi";
import { toast } from "react-toastify";
// Import MUI Dialog components
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";

const NewUserView = () => {
  const [newUserData, setNewUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSumbit, setLoadingSumbit] = useState(false);
  const [selectedPType, setSelectedPType] = useState("BBC Main");
  const [id, setId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const userId = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    const fetchNewUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-profile-by-id/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNewUserData(response.data.new_user);
        setId(response.data.new_user.id);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNewUserData();
    }
  }, [userId]);

  const handleOpenImageDialog = () => setOpenImageDialog(true);
  const handleCloseImageDialog = () => setOpenImageDialog(false);

  const handleActivate = async () => {
    if (!id) {
      console.error("No user data available for activation");
      return;
    }
    try {
      setLoadingSumbit(true);
      const token = localStorage.getItem("token");
      const data = { p_type: selectedPType };
      await axios.put(`${BASE_URL}/api/panel-update-new-profile/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("New user created");
      navigate("/active-user");
    } catch (error) {
      console.error("Error activating Profile", error);
      toast.error("Err while creating new user");
    } finally {
      setLoadingSumbit(false);
    }
  };

  const handleCancel = () => {
    navigate("/new-user");
  };

  const InfoItem = ({ label, value }) => (
    <div className="flex items-center border-b border-pink-100 py-1.5">
      <span className={`text-xs font-medium ${ButtonConfig.newUserLabel} w-24`}>{label}</span>
      <span className="text-sm text-gray-800 flex-1 ">{value || "N/A"}</span>
    </div>
  );
  if(loading){
    return (
      <PageLoader/>
  )
  }
  return (
    <Layout>
      <div className="container mx-auto px-2 py-4">
        <Card className="overflow-hidden shadow-md border-t-4 border-pink-500">
          {/* Header with name and profile image */}
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div 
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 ${ButtonConfig.borderCard} mr-4 cursor-pointer`}
                onClick={handleOpenImageDialog}
              >
                <img 
                  src={newUserData?.image
                    ? `https://businessboosters.club/public/images/user_images/${newUserData?.image}`
                    : "/placeholder-avatar.png"} 
                  alt="profile" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <div>
                <Typography variant="h4" color="pink-gray" className="font-bold">
                  {newUserData?.name || "User Profile"}
                </Typography>
                <Typography variant="small" color={ButtonConfig.typographyColor} className="font-medium">
                  {newUserData?.company || "Company Name"}
                </Typography>
              </div>
            </div>
          </div>
          
          <CardBody className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-pink-100">
              {/* Personal Info */}
              <div className="border-r border-pink-100 p-4">
                <div className="flex items-center mb-3">
                  <UserIcon className={`h-5 w-5 ${ButtonConfig.newUserLabelIcon} mr-2`} />
                  <Typography variant="h6" color={ButtonConfig.typographyColor}  className="font-medium">
                    Personal Details
                  </Typography>
                </div>
                <div className="space-y-0">
                  <InfoItem label="Full Name" value={newUserData?.name} />
                  <InfoItem label="Gender" value={newUserData?.gender} />
                  <InfoItem label="Birth Date" value={newUserData?.dob} />
                  <InfoItem label="Spouse" value={newUserData?.spouse_name} />
                  <InfoItem label="Anniversary" value={newUserData?.anniversary} />
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="border-r border-pink-100 p-4">
                <div className="flex items-center mb-3">
                  <EnvelopeIcon className={`h-5 w-5 ${ButtonConfig.newUserLabelIcon} mr-2`} />
                  <Typography variant="h6" color={ButtonConfig.typographyColor}  className="font-medium">
                    Contact Details
                  </Typography>
                </div>
                <div className="space-y-0">
                  <InfoItem label="Email" value={newUserData?.email} />
                  <InfoItem label="Mobile" value={newUserData?.mobile} />
                  <InfoItem label="WhatsApp" value={newUserData?.whatsapp_number} />
                  <InfoItem label="Landline" value={newUserData?.landline} />
                  <InfoItem label="Area" value={newUserData?.area} />
                  <InfoItem label="Address" value={newUserData?.address} />
                </div>
              </div>
              
              {/* Business Info */}
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <BriefcaseIcon className={`h-5 w-5 ${ButtonConfig.newUserLabelIcon} mr-2`} />
                  <Typography variant="h6" color={ButtonConfig.typographyColor}  className="font-medium">
                    Business Details
                  </Typography>
                </div>
                <div className="space-y-0">
                  <InfoItem label="Company" value={newUserData?.company} />
                  <InfoItem label="Short Name" value={newUserData?.company_short} />
                  <InfoItem label="Category" value={newUserData?.category} />
                  <InfoItem label="Website" value={newUserData?.website} />
                  <InfoItem label="Experience" value={newUserData?.experience} />
                  <InfoItem label="Products" value={newUserData?.product} />
                </div>
              </div>
            </div>
            
            {/* Action Controls - Always at the bottom */}
            <div className="p-4 bg-gray-50 border-t border-pink-100">
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                <div className="w-full sm:w-64">
                  <Select
                    label="Select Group"
                    value={selectedPType}
                    onChange={(value) => setSelectedPType(value)}
                    className="w-full bg-white"
                    size="sm"
                  >
                    <Option value="BBC Main">BBC Main</Option>
                    <Option value="BBC Udayan">BBC Udayan</Option>
                    <Option value="ALL">ALL</Option>
                  </Select>
                </div>
                <div className="flex gap-3 w-full sm:w-auto mt-3 sm:mt-0">
                  <Button
                    onClick={handleActivate}
                    disabled={loadingSumbit || !id}
                    size="sm"
                    className={`${ButtonConfig.sumbitButtonBg} hover:${ButtonConfig.sumbitButtonBgHover} flex items-center gap-1 py-2.5 px-4 ${
                      loadingSumbit || !id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                 
                    <span>{loadingSumbit ? "Processing..." : "Activate"}</span>
                  </Button>
                  <Button
                    type="button"
                    color={ButtonConfig.cancelButtonColor}
                    size="sm"
                    className="flex items-center gap-1 py-2.5 px-4"
                    onClick={handleCancel}
                  >
             
                    <span>Go Back</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* MUI Profile Image Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography className="text-lg font-medium">
            {newUserData?.name || "User Profile"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center', p: 2 }}>
          <img
            src={
              newUserData?.image
                ? `https://businessboosters.club/public/images/user_images/${newUserData?.image}`
                : "/placeholder-avatar.png"
            }
            alt="profile"
            style={{ 
              maxWidth: '100%', 
              maxHeight: 'calc(80vh - 64px)', 
              objectFit: 'contain'
            }}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NewUserView;