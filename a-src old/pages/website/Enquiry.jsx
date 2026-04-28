import React, { useContext, useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import {
  Card,
  CardBody,
  CardHeader,
 
  Typography,
 
} from "@material-tailwind/react";
import DataLoader from "../../components/DataLoader";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";

const Enquiry = () => {
  const [enquiryData, setEnquiryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const resposne = await axios.get(
          `${BASE_URL}/api/panel-fetch-enquiry`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEnquiryData(resposne?.data?.enquiry);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiry();
   
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
        name: "contact_name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "contact_email",
        label: "Email",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_mobile",
        label: "Mobile",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "contact_message",
        label: "Message",
        options: {
          filter: true,
          sort: false,
        },
      },
    ],
    [enquiryData]
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
    textLabels: {
      body: {
        noMatch: loading ? <>
        <div className="flex justify-center items-center h-64">
                <DataLoader/>
              </div></> : "No records found", 
      },
    },
    
  };

  const data = useMemo(() => (enquiryData ? enquiryData : []), [enquiryData]);
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
            Enquiry List
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
          <MUIDataTable
          // title={"Enquiry List"}
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

export default Enquiry;
