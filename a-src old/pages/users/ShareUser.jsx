import React, { useContext, useEffect, useMemo, useState } from "react";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import MUIDataTable from "mui-datatables";
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import {
  Card,
  CardBody,
  CardHeader,

  Typography,

} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";


const ShareUser = () => {
  const [shareData, setShareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShareUser = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const resposne = await axios.get(
          `${BASE_URL}/api/panel-fetch-share-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setShareData(resposne?.data?.new_user);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShareUser();
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "slNo",
        label: "SL No",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return tableMeta.rowIndex + 1;
          },
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
      {
        name: "no_of_counts",
        label: "Views",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "share_from_id",
        label: "Action",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (userId) => {
            return (
              <div onClick={() => navigate(`/share-view?id=${userId}`)}>
                <HiOutlineArrowCircleRight title="Go to user detail" className="h-5 w-5 cursor-pointer" />
              </div>
            );
          },
        },
      },
    ],
    [shareData]
  );

  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
  };

  const data = useMemo(() => (shareData ? shareData : []), [shareData]);
  if(loading){
    return (
      <PageLoader/>
  )
  }
  return (
    <Layout>
       <div className="container mx-auto mt-5 ">
           <Card className={`p-8 bg-gradient-to-r  px-8 py-5 border  ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}>
                   <CardHeader className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6`}>
                  <Typography variant="h4" color={ButtonConfig.typographyColor} className="font-bold">
                  Share User List
                  </Typography>
                </CardHeader>
                <CardBody className="p-0 ">
                <MUIDataTable
          // title={"Share User List"}
          data={data}
          columns={columns}
          options={options}
        />
                </CardBody>
              </Card>
            </div>
    
    </Layout>
  );
};

export default ShareUser;
