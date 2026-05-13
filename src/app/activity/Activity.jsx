import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useApiMutation } from "@/hooks/useApiMutation";
import { ACTIVITY_API } from "@/constants/apiConstants";
import Loader from "@/components/loader/loader";

import { User, Phone, Users, Tag, Calendar, Award, Star } from "lucide-react";

const COLORS = ["#4F46E5", "#22C55E"];

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
          {/* HEADER */}
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

          {/* ERROR */}
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
            /* CARDS */
            <div className="space-y-6 sm:space-y-8 mt-6">
              {activities.map((item, index) => {
                const a = item?.attendance || item;
                console.log(item);

                const pieData = [
                  {
                    name: "Attendance",
                    value: a?.attendance_count || 0,
                  },
                  {
                    name: "Remaining",
                    value: 100 - (a?.attendance_count || 0),
                  },
                ];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-lg sm:shadow-xl border p-4 sm:p-8"
                  >
                    {/* MAIN LAYOUT */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                      {/* LEFT */}
                      <div className="flex-1">
                        {/* USER SECTION */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                          <img
                            src={
                              a?.image
                                ? `https://businessboosters.club/public/images/user_images/${a.image}`
                                : "https://via.placeholder.com/200"
                            }
                            alt="user"
                            className="w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-2xl object-contain bg-white border-2 sm:border-4 border-indigo-100 shadow"
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

                              <p className="flex items-center gap-2">
                                <Calendar size={16} />
                                {a?.user_new_joining_date || "No Joining Date"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* TAGS */}
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

                        {/* STATS GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
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
                            label="Ref Given"
                            value={a?.ref_given}
                            color="bg-green-500"
                          />
                          <Stat
                            label="Ref Received"
                            value={a?.ref_received}
                            color="bg-red-500"
                          />
                          <Stat
                            label="Visitor"
                            value={a?.visitor_count}
                            color="bg-cyan-500"
                          />
                          <Stat
                            label="Bonus"
                            value={a?.bonus_point}
                            color="bg-yellow-500"
                          />
                          <Stat
                            label="Chief Guest"
                            value={a?.chief_guest_count}
                            color="bg-orange-500"
                          />
                        </div>
                      </div>

                      {/* RIGHT - CHART */}
                      <div className="w-full lg:w-72 flex flex-col items-center justify-center mt-6 lg:mt-0">
                        <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                                paddingAngle={4}
                              >
                                {pieData.map((_, idx) => (
                                  <Cell
                                    key={idx}
                                    fill={COLORS[idx % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 mt-2">
                          {a?.attendance_count || 0}%
                        </h3>

                        <p className="text-gray-500 text-sm">
                          Attendance Score
                        </p>

                        {/* BONUS */}
                        <div className="mt-4 sm:mt-6 flex gap-3 sm:gap-4">
                          <div className="bg-yellow-100 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl text-center shadow">
                            <Award
                              className="mx-auto text-yellow-600 mb-1"
                              size={18}
                            />
                            <p className="text-xs sm:text-sm text-gray-500">
                              Bonus
                            </p>
                            <h4 className="font-bold text-base sm:text-lg">
                              {a?.bonus_point || 0}
                            </h4>
                          </div>

                          <div className="bg-orange-100 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl text-center shadow">
                            <Star
                              className="mx-auto text-orange-600 mb-1"
                              size={18}
                            />
                            <p className="text-xs sm:text-sm text-gray-500">
                              Chief Guest
                            </p>
                            <h4 className="font-bold text-base sm:text-lg">
                              {a?.chief_guest_count || 0}
                            </h4>
                          </div>
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

/* ---------------- STAT ---------------- */

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
