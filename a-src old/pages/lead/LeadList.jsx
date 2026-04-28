import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";
import { MdAdd, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import LeadModal from "./LeadModal";
import { IconButton, Tooltip } from "@material-tailwind/react";
import moment from "moment";

const LeadList = () => {
  const [leadData, setLeadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchLeadList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-lead-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Initially, we just log the data to see the structure
      console.log("Lead API Response:", response.data);
      setLeadData(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching lead list", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadList();
  }, []);

  const handleEdit = (id) => {
    setEditId(id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditId(null);
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        name: "slNo",
        label: "SL No",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            return tableMeta.rowIndex + 1;
          },
        },
      },
      {
        name: "lead_date",
        label: "Date",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => moment(value).format("DD-MM-YYYY"),
        },
      },
      {
        name: "lead_from",
        label: "Lead From",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => value?.name || "N/A",
        },
      },
      {
        name: "lead_to",
        label: "Lead To",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => value?.name || "N/A",
        },
      },
      {
        name: "lead_amount",
        label: "Amount",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => value || "N/A",
        },
      },
      {
        name: "id",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (id) => {
            return (
              <Tooltip content="Edit Lead">
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={() => handleEdit(id)}
                >
                  <MdEdit className="h-5 w-5" />
                </IconButton>
              </Tooltip>
            );
          },
        },
      },
    ],
    [leadData],
  );

  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    filterType: "dropdown",
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Layout>
      <div className="container mx-auto mt-5">
        <Card
          className={`p-8 bg-white border ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}
        >
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 flex justify-between items-center p-6 mb-6">
            <Typography variant="h4" color="white" className="font-bold">
              Lead
            </Typography>
            <Button
              className="flex items-center gap-2 bg-white text-gray-900"
              size="sm"
              onClick={handleAdd}
            >
              <MdAdd className="h-4 w-4" /> Add Lead
            </Button>
          </CardHeader>
          <CardBody>
            <MUIDataTable data={leadData} columns={columns} options={options} />
          </CardBody>
        </Card>
      </div>

      <LeadModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        leadId={editId}
        onSuccess={fetchLeadList}
      />
    </Layout>
  );
};

export default LeadList;
