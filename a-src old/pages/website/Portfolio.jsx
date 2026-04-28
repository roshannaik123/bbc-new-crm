import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { HiOutlineSave } from "react-icons/hi";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Typography,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";

const Portfolio = () => {
  const [sliderImages, setSliderImages] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [selectedFile4, setSelectedFile4] = useState(null);
  const [selectedFile5, setSelectedFile5] = useState(null);
  const [ids, setIds] = useState(null);

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-slider`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSliderImages(response?.data?.slider || {});
        setIds(response.data.slider.id || {});
      } catch (error) {
        console.error("Error fetching slider images", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const data = new FormData();

      if (selectedFile1) data.append("product_image1", selectedFile1);
      if (selectedFile2) data.append("product_image2", selectedFile2);
      if (selectedFile3) data.append("product_image3", selectedFile3);
      if (selectedFile4) data.append("product_image4", selectedFile4);
      if (selectedFile5) data.append("product_image5", selectedFile5);

      const response = await axios({
        url: BASE_URL + "/api/panel-update-slider/" + ids + "?_method=PUT",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.data.code == "200") {
        toast.success("Portfolio updated successfully");
      } else {
        toast.error("Failed to update portfolio images. Please try again.");
      }
    } catch (error) {
      console.error("Error updating slider images:", error);
      toast.error("Error while updating");
    } finally {
      setLoading(false);
    }
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
              Portfolio
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            <form className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Portfolio Image 1 */}
                <div className={`flex flex-col items-center border ${ButtonConfig.portfolioBorder} rounded-lg p-4 hover:shadow-md transition-shadow duration-300`}>
                  <label className={`block ${ButtonConfig.inputLabelProps} font-medium mb-2`}>
                    Portfolio 1
                    <input
                      name="product_image1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile1(e.target.files[0])}
                      className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 p-2 rounded-lg hover:border-pink-400 cursor-pointer bg-gray-50"
                    />
                  </label>
                  {sliderImages.product_image1 && (
                    <img
                      src={`https://businessboosters.club/public/images/product_images/${sliderImages.product_image1}`}
                      alt="product_image1"
                      className="w-full h-48 sm:h-56 md:h-72 md:w-72 lg:h-72 rounded-lg shadow-md object-cover mt-4"
                    />
                  )}
                </div>
                
                {/* Portfolio Image 2 */}
                <div className={`flex flex-col items-center border ${ButtonConfig.portfolioBorder} rounded-lg p-4 hover:shadow-md transition-shadow duration-300`}>
                <label className={`block ${ButtonConfig.inputLabelProps} font-medium mb-2`}>
                    Portfolio 2
                    <input
                      name="product_image2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile2(e.target.files[0])}
                      className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 p-2 rounded-lg hover:border-pink-400 cursor-pointer bg-gray-50"
                    />
                  </label>
                  {sliderImages.product_image2 && (
                    <img
                      src={`https://businessboosters.club/public/images/product_images/${sliderImages.product_image2}`}
                      alt="product_image2"
                      className="w-full h-48 sm:h-56 md:h-72 md:w-72 lg:h-72 rounded-lg shadow-md object-cover mt-4"
                    />
                  )}
                </div>
                
                {/* Portfolio Image 3 */}
                <div className={`flex flex-col items-center border ${ButtonConfig.portfolioBorder} rounded-lg p-4 hover:shadow-md transition-shadow duration-300`}>
                <label className={`block ${ButtonConfig.inputLabelProps} font-medium mb-2`}>
                    Portfolio 3
                    <input
                      name="product_image3"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile3(e.target.files[0])}
                      className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 p-2 rounded-lg hover:border-pink-400 cursor-pointer bg-gray-50"
                    />
                  </label>
                  {sliderImages.product_image3 && (
                    <img
                      src={`https://businessboosters.club/public/images/product_images/${sliderImages.product_image3}`}
                      alt="product_image3"
                      className="w-full h-48 sm:h-56 md:h-72 md:w-72 lg:h-72 rounded-lg shadow-md object-cover mt-4"
                    />
                  )}
                </div>
                
                {/* Portfolio Image 4 */}
                <div className={`flex flex-col items-center border ${ButtonConfig.portfolioBorder} rounded-lg p-4 hover:shadow-md transition-shadow duration-300`}>
                <label className={`block ${ButtonConfig.inputLabelProps} font-medium mb-2`}>
                    Portfolio 4
                    <input
                      name="product_image4"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile4(e.target.files[0])}
                      className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 p-2 rounded-lg hover:border-pink-400 cursor-pointer bg-gray-50"
                    />
                  </label>
                  {sliderImages.product_image4 && (
                    <img
                      src={`https://businessboosters.club/public/images/product_images/${sliderImages.product_image4}`}
                      alt="product_image4"
                      className="w-full h-48 sm:h-56 md:h-72 md:w-72 lg:h-72 rounded-lg shadow-md object-cover mt-4"
                    />
                  )}
                </div>
                
                {/* Portfolio Image 5 */}
                <div className={`flex flex-col items-center border ${ButtonConfig.portfolioBorder} rounded-lg p-4 hover:shadow-md transition-shadow duration-300`}>
                <label className={`block ${ButtonConfig.inputLabelProps} font-medium mb-2`}>
                    Portfolio 5
                    <input
                      name="product_image5"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile5(e.target.files[0])}
                      className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 p-2 rounded-lg hover:border-pink-400 cursor-pointer bg-gray-50"
                    />
                  </label>
                  {sliderImages.product_image5 && (
                    <img
                      src={`https://businessboosters.club/public/images/product_images/${sliderImages.product_image5}`}
                      alt="product_image5"
                      className="w-full h-48 sm:h-56 md:h-72 md:w-72 lg:h-72 rounded-lg shadow-md object-cover mt-4"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full sm:w-auto px-8 py-3 ${ButtonConfig.sumbitButtonBg} hover:${ButtonConfig.sumbitButtonBgHover}  transition-colors duration-300 flex items-center justify-center gap-2 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
          
                    <span>{loading ? "Updating..." : "Update Portfolio"}</span>
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

export default Portfolio;