import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useApiMutation } from "@/hooks/useApiMutation";
import { ACTIVITY_API } from "@/constants/apiConstants";
import Loader from "@/components/loader/loader";

import {
  User,
  Phone,
  Users,
  Tag,
  Calendar,
  Award,
  Star,
  Mail,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Colour palette – same two colours as the original component          */
/* ------------------------------------------------------------------ */
const COLORS = ["#4F46E5", "#22C55E"];

/* ------------------------------------------------------------------ */
/*  Helper – renders a pie‑chart for a single group entry               */
/* ------------------------------------------------------------------ */
const GroupPie = ({ groupName, totalMeetings, attendanceCount }) => {
  const attendancePerc =
    totalMeetings > 0 ? Math.round((attendanceCount / totalMeetings) * 100) : 0;

  const data = [
    { name: "Attendance", value: attendancePerc },
    { name: "Remaining", value: 100 - attendancePerc },
  ];

  return (
    <div className="flex flex-col items-center gap-2 p-2 min-w-[120px]">
      <h4 className="text-sm font-medium text-gray-700">{groupName}</h4>
      <div className="w-28 h-28 sm:w-32 sm:h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={38}
              outerRadius={55}
              dataKey="value"
              paddingAngle={4}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-600">
        {attendanceCount}/{totalMeetings}
      </p>
      <p className="text-xs font-medium text-indigo-600">{attendancePerc}%</p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Activity component                                           */
/* ------------------------------------------------------------------ */
const Activity = () => {
  const { trigger: fetchActivity } = useApiMutation();

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizeData = (res) => {
    if (Array.isArray(res)) return res;
    if (res?.attendance) return [res];
    return [];
  };

  const loadActivity = async () => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetchActivity({
        url: ACTIVITY_API.list,
        method: "get",
      });

      setActivities(normalizeData(res));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load activity data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <Card className="max-w-8xl mx-auto shadow-lg border-t-4 border-t-primary bg-white">
        <CardContent>
          {/* -------- Header -------- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b py-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-primary uppercase">
                Activity Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Complete attendance & performance analytics
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </div>

          {/* -------- Error -------- */}
          {error ? (
            <div className="flex items-center justify-center py-16 sm:py-20">
              <div className="text-center p-6 sm:p-8 max-w-sm w-full border shadow-xl rounded-2xl">
                <div className="text-red-500 text-5xl mb-3">⚠️</div>
                <h2 className="text-lg sm:text-xl font-bold mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-500 mb-5 text-sm sm:text-base">
                  {error}
                </p>

                <Button className="w-full" onClick={loadActivity}>
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            /* -------- Activity Cards -------- */
            <div className="space-y-6 sm:space-y-8 mt-6">
              {activities.map((item, index) => {
                const a = item?.attendance || item;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-lg sm:shadow-xl border p-4 sm:p-8"
                  >
                    {/* ---- Main Layout ---- */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                      {/* ---- Left: User Info ---- */}
                      <div className="flex-1">
                        {/* User section */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                          <img
                            src={
                              a?.image
                                ? `https://businessboosters.club/public/images/user_images/${a.image}`
                                : "https://via.placeholder.com/200"
                            }
                            alt="user"
                            className="w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-2xl object-contain bg-white border-2 sm:border-1 border-indigo-100 shadow"
                          />

                          <div>
                            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                              <User size={20} />
                              {a?.name}
                            </h2>

                            <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                              <p className="flex items-center gap-2">
                                <Phone size={16} />
                                {a?.mobile}
                              </p>

                              <p className="flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs">
                                <Mail size={16} />
                                {a?.email || "No Email"}
                              </p>

                              <p className="flex items-center gap-2">
                                <Calendar size={16} />
                                {a?.user_new_joining_date || "No Joining Date"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6">
                          <div className="px-3 sm:px-5 py-1 sm:py-2 rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-2 text-xs sm:text-sm font-medium">
                            <Tag size={14} />
                            {a?.category}
                          </div>

                          <div className="px-3 sm:px-5 py-1 sm:py-2 rounded-full bg-green-100 text-green-700 flex items-center gap-2 text-xs sm:text-sm font-medium">
                            <Users size={14} />
                            {a?.user_group || "No Group"}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                          <Stat
                            label="One to One"
                            value={a?.onetoone_count}
                            color="bg-indigo-500"
                          />
                          <Stat
                            label="Team"
                            value={a?.team_points}
                            color="bg-pink-500"
                          />
                          <Stat
                            label="Visitor"
                            value={a?.visitor_count}
                            color="bg-cyan-500"
                          />
                          <Stat
                            label="Ref Given"
                            value={a?.ref_given}
                            color="bg-green-500"
                          />
                          <Stat
                            label="Ref Received"
                            value={a?.ref_received}
                            color="bg-red-500"
                          />
                        </div>
                      </div>

                      {/* ---- Right: Group‑wise pies on a single line ---- */}
                      <div className="w-full lg:w-96 flex flex-col items-center justify-start mt-6 lg:mt-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Group‑wise Attendance
                        </h3>

                        {/* Horizontal scroll container – pies stay on one line */}
                        <div className="flex flex-nowrap overflow-x-auto gap-4">
                          {a?.group_wise?.map((g) => (
                            <GroupPie
                              key={g.group_name}
                              groupName={g.group_name}
                              totalMeetings={g.total_meetings}
                              attendanceCount={g.attendance_count}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Re‑usable Stat component (unchanged)                              */
/* ------------------------------------------------------------------ */
const Stat = ({ label, value, color }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-gray-50 border shadow-sm"
    >
      <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${color} mb-2`} />
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
        {value ?? 0}
      </h3>
    </motion.div>
  );
};

export default Activity;
