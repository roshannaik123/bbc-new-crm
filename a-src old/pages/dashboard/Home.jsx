import React, { useEffect, useState, useContext, useMemo } from "react";
import Layout from "../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { UserIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/panel-dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [isPanelUp, navigate]);

  const data = useMemo(() => dashboardData || {}, [dashboardData]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Users */}
        <Card className="shadow-md border-t-4 border-blue-500">
          <CardBody className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserIcon className="w-12 h-12 text-blue-500" />
              <div>
                <Typography variant="h6" color="blue" className="uppercase font-medium">
                  Active Users
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {loading ? "Loading..." : data?.total_active || 0}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Inactive Users */}
        <Card className="shadow-md border-t-4 border-red-500">
          <CardBody className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserMinusIcon className="w-12 h-12 text-red-500" />
              <div>
                <Typography variant="h6" color="red" className="uppercase font-medium">
                  Inactive Users
                </Typography>
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {loading ? "Loading..." : data?.total_inactive || 0}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
