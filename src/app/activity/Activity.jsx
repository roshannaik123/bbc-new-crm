import React, { useEffect, useState } from "react";
import { useApiMutation } from "@/hooks/useApiMutation";
import { ACTIVITY_API } from "@/constants/apiConstants";
import Loader from "@/components/loader/loader";
import { User, Phone, Users, Tag, Calendar } from "lucide-react";

const Activity = () => {
  const { trigger: fetchActivity } = useApiMutation();

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Normalize API response safely
  const normalizeData = (res) => {
    if (Array.isArray(res)) return res;
    if (res?.attendance) return [res];
    return [];
  };

  const loadActivity = async () => {
    try {
      setIsLoading(true);

      const res = await fetchActivity({
        url: ACTIVITY_API.list,
        method: "get",
      });

      const formatted = normalizeData(res);
      setActivities(formatted);
    } catch (err) {
      console.log("Activity error:", err);
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Activity</h1>
        <p className="text-gray-500 text-sm">Complete user attendance report</p>
      </div>

      {/* CARDS */}
      <div className="space-y-6">
        {activities.map((item, index) => {
          const a = item?.attendance || item;

          return (
            <div
              key={index}
              className="relative w-full bg-white rounded-2xl shadow-md border p-6"
            >
              {/* IMAGE TOP RIGHT (SQUARE + FULL IMAGE) */}
              <div className="absolute top-4 right-4">
                <img
                  src={
                    a?.image
                      ? `https://businessboosters.club/public/images/user_images/${a.image}`
                      : "https://via.placeholder.com/120"
                  }
                  alt="user"
                  className="w-28 h-28 object-contain rounded-lg border shadow bg-white"
                />
              </div>

              {/* LEFT CONTENT */}
              <div className="pr-32 space-y-3">
                {/* NAME */}
                <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <User size={18} />
                  {a?.name}
                </div>

                {/* MOBILE */}
                <div className="text-gray-600 flex items-center gap-2">
                  <Phone size={16} />
                  {a?.mobile}
                </div>

                {/* CATEGORY */}
                <div className="text-gray-600 flex items-center gap-2">
                  <Tag size={16} />
                  {a?.category}
                </div>

                {/* GROUP */}
                <div className="text-gray-600 flex items-center gap-2">
                  <Users size={16} />
                  {a?.user_group || "No Group"}
                </div>

                {/* JOINING DATE */}
                <div className="text-gray-600 flex items-center gap-2">
                  <Calendar size={16} />
                  {a?.user_new_joining_date || "No Joining Date"}
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <Stat label="Attendance" value={a?.attendance_count} />
                  <Stat label="Bonus" value={a?.bonus_point} />
                  <Stat label="One to One" value={a?.onetoone_count} />
                  <Stat label="Team" value={a?.team_points} />
                  <Stat label="Ref Given" value={a?.ref_given} />
                  <Stat label="Ref Received" value={a?.ref_received} />
                  <Stat label="Visitor" value={a?.visitor_count} />
                  <Stat label="Chief Guest" value={a?.chief_guest_count} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* SMALL STAT BOX */
const Stat = ({ label, value }) => (
  <div className="bg-gray-100 rounded-lg p-2 text-center">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-bold text-gray-800">{value ?? 0}</p>
  </div>
);

export default Activity;
