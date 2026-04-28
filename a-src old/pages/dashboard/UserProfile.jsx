import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";

import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
  Select,
  Option,
  CardHeader,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  CameraIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { FaTag, FaWhatsapp } from "react-icons/fa";
import { BiMaleFemale } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { PiMapPinAreaFill } from "react-icons/pi";
import { CiLocationOn, CiShoppingTag } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "react-toastify";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";

const UserProfile = () => {
  const [userProfileData, setUserProfileData] = useState({
    name: "",
    gender: "",
    dob: "",
    image: null,
    email: "",
    mobile: "",
    whatsapp_number: "",
    spouse_name: "",
    doa: "",
    company: "",
    company_short: "",
    category: "",
    website: "",
    experience: "",
    landline: "",
    area: "",
    address: "",
    product: "",
    profile_tag: "",
  });
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [errors, setErrors] = useState({});
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserProfileData(response.data.profile);
        setId(response.data.profile.id);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfileData({ ...userProfileData, [name]: value });
  };

  const handleValidation = () => {
    let newErrors = {};

    if (!userProfileData.name) newErrors.name = "Full name is required";
    if (!userProfileData.gender) newErrors.gender = "Gender is required";
    if (!userProfileData.email) {
      newErrors.email = "Email is required";
    } else if (!userProfileData.email.endsWith(".com")) {
      newErrors.email = "Email must end with .com";
    }
    if (!userProfileData.mobile) newErrors.mobile = "Mobile is required";
    if (!userProfileData.whatsapp_number) newErrors.whatsapp_number = "WhatsApp number is required";
    if (!userProfileData.dob) newErrors.dob = "Date of Birth is required";
    if (!userProfileData.category) newErrors.category = "Business category is required";
    if (!userProfileData.company) newErrors.company = "Company name is required";
    if (!userProfileData.area) newErrors.area = "Area is required";
    if (!userProfileData.address) newErrors.address = "Address is required";
    if (!userProfileData.product) newErrors.product = "Products/Services details are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // update handle
  const handleSumbit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/panel-update-profile/${id}`,
        userProfileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile Updated");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigate("/home");
  };
  if(loading){
    return (
      <PageLoader/>
  )
  }
  return (
    <Layout>
     

      <div className=" container mx-auto   mt-5">
        <Card className={`p-8 bg-gradient-to-r  px-8 py-5 border  ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6`}>
            <Typography variant="h4" color={ButtonConfig.typographyColor} className="font-bold">
              Update Your Profile
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            <form
              onSubmit={handleSumbit}
              id="updateProfile"
              autoComplete="off"
              className="space-y-6"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {userProfileData?.image ? (
                    <img
                      src={`https://businessboosters.club/public/images/user_images/${userProfileData?.image}`}
                      alt="Profile"
                      className={`w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-2 ${ButtonConfig.borderCard}`}
                    />
                  ) : (
                    <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 flex items-center justify-center rounded-lg border-4 ${ButtonConfig.borderCard}`}>
                      <UserCircleIcon className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400" />
                    </div>
                  )}
                 
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                <div>
                  <Input
                    variant="static"
                    name="name"
                    label="Full Name *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your full name"
                    value={userProfileData.name}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    icon={<UserCircleIcon className="h-5 w-5" />}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <Select
                    variant="static"
                    label="Gender *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig?.inputLabelProps}` }}
                    value={userProfileData.gender}
                    onChange={(value) => setUserProfileData({ ...userProfileData, gender: value })}
                    className={`bg-white text-gray-700 ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>

                <div>
                  <Input
                    variant="static"
                    type="email"
                    name="email"
                        
                    label="Email *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your email"
                    value={userProfileData.email}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    icon={<MdEmail className="h-4 w-4" />}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <Input
                    variant="static"
                    name="mobile"
                    label="Mobile Number *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your mobile number"
                    value={userProfileData.mobile}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.mobile ? "border-red-500" : ""
                    }`}
                    icon={<PhoneIcon className="h-5 w-5" />}
                    maxLength={10}
                  />
                  {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                </div>

                <div>
                  <Input
                    variant="static"
                    name="whatsapp_number"
                    label="WhatsApp Number *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your WhatsApp number"
                    value={userProfileData.whatsapp_number}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.whatsapp_number ? "border-red-500" : ""
                    }`}
                    icon={<FaWhatsapp className="h-5 w-5" />}
                    maxLength={10}
                  />
                  {errors.whatsapp_number && <p className="text-sm text-red-500">{errors.whatsapp_number}</p>}
                </div>

                <div>
                  <Input
                    variant="static"
                    type="date"
                    name="dob"
                
                    label="Date of Birth *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    value={userProfileData.dob}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 ${
                      errors.dob ? "border-red-500" : ""
                    }`}
                  />
                  {errors.dob && <p className="text-sm text-red-500">{errors.dob}</p>}
                </div>

                <div>
                  <Input
                    variant="static"
                    name="spouse_name"
                    label="Spouse Name"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your spouse name"
                    value={userProfileData.spouse_name}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-700 placeholder-gray-400"
                    icon={<UserCircleIcon className="h-5 w-5" />}
                  />
                </div>

                <div>
                  <Input
                    variant="static"
                    type="date"
                    name="doa"
                     
                    label="Anniversary Date"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    value={userProfileData.doa}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-700"
                  />
                </div>

                <div>
                  <Input
                    variant="static"
                    name="company"
                    label="Company Name *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your company name"
                    value={userProfileData.company}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.company ? "border-red-500" : ""
                    }`}
                    icon={<BriefcaseIcon className="h-4 w-4" />}
                  />
                  {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
                </div>

                <div>
                  <Input
                    variant="static"
                    name="company_short"
                    label="Company Short Name"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your company short name"
                    value={userProfileData.company_short}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-700 placeholder-gray-400"
                    icon={<BriefcaseIcon className="h-4 w-4" />}
                  />
                </div>

                <div>
                  <Input
                    variant="static"
                    name="category"
                    label="Business Category *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your business category"
                    value={userProfileData.category}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.category ? "border-red-500" : ""
                    }`}
                    icon={<BriefcaseIcon className="h-4 w-4" />}
                  />
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
                <div>
                  <Input
                    variant="static"
                    name="website"
                    label="Website"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your website"
                    value={userProfileData.website}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-700 placeholder-gray-400"
                    icon={<GlobeAltIcon className="h-5 w-5" />}
                  />
                </div>

                <div>
                  <Input
                    variant="static"
                    name="experience"
                    label="Experience"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your experience"
                    value={userProfileData.experience}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-700 placeholder-gray-400"
                    icon={<BriefcaseIcon className="h-4 w-4" />}
                    onBeforeInput={(event) => {
                      const value = event.currentTarget.value;
                      if (!/^\d*\.?\d*$/.test(value + event.data)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>

                <div>
                  <Input
                    variant="static"
                    name="landline"
                    label="Landline Number"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your landline number"
                    value={userProfileData.landline}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-700 placeholder-gray-400"
                    icon={<PhoneIcon className="h-5 w-5" />}
                    maxLength={11}
                    onBeforeInput={(event) => {
                      const value = event.currentTarget.value;
                      if (!/^\d*\.?\d*$/.test(value + event.data)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </div>

                <div>
                  <Input
                    variant="static"
                    name="area"
                    label="Area *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your area"
                    value={userProfileData.area}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.area ? "border-red-500" : ""
                    }`}
                    icon={<PiMapPinAreaFill className="h-5 w-5" />}
                  />
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-10">
                <div>
                  <Input
                    variant="static"
                    name="address"
                    label="Address *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your address"
                    value={userProfileData.address}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    icon={<FaLocationDot className="h-4 w-4" />}
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <Textarea
                    variant="static"
                    name="product"
                    label="Products / Services *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Type all products or services separated by comma"
                    value={userProfileData.product}
                    onChange={handleInputChange}
                    className={`bg-gray-100 text-gray-700 placeholder-gray-400 ${
                      errors.product ? "border-red-500" : ""
                    }`}
                  />
                  {errors.product && <p className="text-sm text-red-500">{errors.product}</p>}
                </div>

                <div>
                  <Textarea
                    variant="static"
                    name="profile_tag"
                    label="Profile Tag"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Type all products or services related tags separated by comma (e.g., CCTV - Security System, Camera, Surveillance)"
                    value={userProfileData.profile_tag}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <CardFooter className="flex justify-center mt-8 p-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto px-8 py-3  ${ButtonConfig.sumbitButtonBg} hover:${ButtonConfig.sumbitButtonBgHover}  transition-colors duration-300`}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button
                    type="button"
                    color={ButtonConfig.cancelButtonColor}
                    className="w-full sm:w-auto px-8 py-3"
                    onClick={handleHome}
                  >
                    Cancel
                  </Button>
                </div>
              </CardFooter>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default UserProfile;