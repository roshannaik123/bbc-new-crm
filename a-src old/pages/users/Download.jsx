import React from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";

const Download = () => {
  // Function to handle file download
  const downloadReport = async (url, fileName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      console.log(`${fileName} downloaded successfully.`);
      toast.success(`${fileName} downloaded successfully.`);
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
      toast.error("Error downloading file.");
    }
  };

  // Handler for downloading member data
  const downloadMemberData = (e) => {
    e.preventDefault();
    downloadReport(`${BASE_URL}/api/download-member-report`, "member.csv");
  };

  // Handler for downloading mobile user data
  const downloadMobileUserData = (e) => {
    e.preventDefault();
    downloadReport(
      `${BASE_URL}/api/download-mobile-user-report`,
      "mobileuser.csv"
    );
  };

  return (
    <Layout>
      <div className="container mx-auto mt-5">
         <Card className={`p-8 bg-gradient-to-r  px-8 py-5 border  ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}>
                 <CardHeader className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6`}>
            <Typography variant="h4" color={ButtonConfig.typographyColor}  className="font-bold">
              Download Data
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Button
                className={`w-full ${ButtonConfig.downloadButtonBg} hover:${ButtonConfig.downloadButtonBgHover}    text-white font-semibold py-4 rounded-xl transition transform hover:-translate-y-1 hover:shadow-lg`}
                onClick={downloadMemberData}
              >
                Download Member Data
              </Button>
              <Button
                  className={`w-full ${ButtonConfig.downloadButtonBg} hover:${ButtonConfig.downloadButtonBgHover}    text-white font-semibold py-4 rounded-xl transition transform hover:-translate-y-1 hover:shadow-lg`}
                onClick={downloadMobileUserData}
              >
                Download Mobile User Data
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default Download;