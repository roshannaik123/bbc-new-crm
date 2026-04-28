import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";

const ShareUserById = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userId = new URLSearchParams(location.search).get("id");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-share-by-id/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.new_user);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const columns = useMemo(
    () => [
      {
        name: "slNo",
        label: "SL No",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => tableMeta.rowIndex + 1,
        },
      },
      {
        name: "name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        },
      },
    ],
    [userData]
  );

  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    print: false,
    download: false,
  };

  const data = useMemo(() => (userData ? userData : []), [userData]);
  if(loading){
    return (
      <PageLoader/>
  )
  }
  return (
    <Layout>
      <div className="container mx-auto mt-5">
         <Card className={`p-8 bg-gradient-to-r  px-8 py-5 border  ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}>
         
                <CardHeader className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6 flex justify-between items-center`}>
            <IoArrowBack
              onClick={() => navigate("/share-user")}
              className="cursor-pointer hover:text-red-600 w-6 h-6"
            />
            <Typography variant="h4"  color={ButtonConfig.typographyColor}className="font-bold">
              User Share Details
            </Typography>
            <div className="w-6 h-6" />
          </CardHeader>
          <CardBody className="p-0">
            <MUIDataTable data={data} columns={columns} options={options} />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default ShareUserById;
