import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import { HiOutlineSave } from "react-icons/hi";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";

const About = () => {
  const [about, setAbout] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [id, setId] = useState(null);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-about-us`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAbout(response.data.aboutUs);
        setId(response.data.aboutUs.id);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleUpdateAbout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/panel-update-about-us/${id}`,
        { product_about_us: about.product_about_us },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("About Us updated successfully");
      setIsUpdated(false);
    } catch (error) {
      console.error("Error updating data", error);
      toast.error("Failed to update About Us");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setAbout({ ...about, product_about_us: e.target.value });
    setIsUpdated(true);
  };
  if(loading){
    return (
      <PageLoader/>
  )
  }
  return (
    <Layout>


      <div className="container mx-auto mt-5">
        <Card className={`p-8 bg-gradient-to-r  px-8 py-5 border  ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6`}>
            <Typography variant="h4" color={ButtonConfig.typographyColor} className="font-bold">
              About Us
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            <form className="space-y-6">
              <div>
                <Textarea
                  variant="static"
                  label="About Us  *"
                  color={ButtonConfig.inputColor}
                  labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                  placeholder="Enter information about your company"
                  value={about?.product_about_us || ""}
                  onChange={handleInputChange}
                  className="bg-gray-100 text-gray-700 placeholder-gray-400 min-h-64 w-full"
                  rows={12}
                />
              </div>

              <div className="flex justify-center mt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleUpdateAbout}
                    disabled={!isUpdated || loading}
                    className={`w-full sm:w-auto px-8 py-3 ${ButtonConfig.sumbitButtonBg} hover:${ButtonConfig.sumbitButtonBgHover}    transition-colors duration-300 flex items-center justify-center gap-2 ${!isUpdated ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                  
                    <span>{loading ? "Updating..." : "Update About"}</span>
                  </Button>
                  <Button
                    type="button"
                     color={ButtonConfig.cancelButtonColor}
                    className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2"
                    onClick={() => navigate("/home")}
                  >
                    
                    <span>Cancel</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default About;