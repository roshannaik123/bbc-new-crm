import React, { useEffect, useState } from "react";
import { useApiMutation } from "@/hooks/useApiMutation";
import { DASHBOARD_API } from "@/constants/apiConstants";
import Loader from "@/components/loader/loader";
import {
  Users,
  UserX,
  IndianRupee,
  TrendingUp,
  Calendar,
  Handshake,
  Eye,
} from "lucide-react";

/* ---------------- CARD ---------------- */
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="p-5 rounded-2xl shadow-sm border bg-white hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value ?? 0}</h2>
        </div>

        <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- PAGE ---------------- */
function Home() {
  const { trigger: fetchDashboard } = useApiMutation();

  const [dashboard, setDashboard] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setIsFetching(true);
      setError(null);

      const res = await fetchDashboard({
        url: DASHBOARD_API.list,
        method: "get",
      });

      setDashboard(res);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data",
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ---------------- LOADER ---------------- */
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  /* ---------------- ERROR UI ---------------- */
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h2 className="text-xl font-bold text-red-500">
          Failed to load dashboard
        </h2>

        <p className="text-gray-600 mt-2">{error}</p>

        <button
          onClick={loadDashboard}
          className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">
          Welcome back 👋 Here’s your business summary
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Members"
          value={dashboard?.total_active}
          icon={Users}
          color="bg-green-500"
        />

        <StatCard
          title="Inactive Members"
          value={dashboard?.total_inactive}
          icon={UserX}
          color="bg-red-500"
        />

        <StatCard
          title="Total Amount"
          value={dashboard?.total_amount}
          icon={IndianRupee}
          color="bg-purple-500"
        />

        <StatCard
          title="Total Leads"
          value={dashboard?.total_leads}
          icon={TrendingUp}
          color="bg-blue-500"
        />

        <StatCard
          title="Meetings"
          value={dashboard?.total_meeting}
          icon={Calendar}
          color="bg-yellow-500"
        />

        <StatCard
          title="One to One"
          value={dashboard?.total_onetoone}
          icon={Handshake}
          color="bg-indigo-500"
        />

        <StatCard
          title="Visitors"
          value={dashboard?.total_visitor}
          icon={Eye}
          color="bg-pink-500"
        />
      </div>
    </div>
  );
}

export default Home;
