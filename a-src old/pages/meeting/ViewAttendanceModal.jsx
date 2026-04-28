import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Input,
  Card,
} from "@material-tailwind/react";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md";
import moment from "moment";

const ViewAttendanceModal = ({ isOpen, handleClose, meetingId }) => {
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState({});
  const [allMembers, setAllMembers] = useState([]);
  const [attendedMembers, setAttendedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && meetingId) {
      fetchData();
    }
  }, [isOpen, meetingId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch All Members and Meeting Details in parallel
      const [allRes, meetingRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/panel-fetch-members`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/panel-fetch-meeting-by-id/${meetingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const all = allRes.data.data || allRes.data || [];
      const mData = meetingRes.data.data || meetingRes.data || {};

      setMeetingData(mData);

      // Parse comma-separated attendance string "1,76" -> ["1", "76"]
      const attendedStr = mData.meeting_attendance || "";
      const attendedIdsArray = attendedStr
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id);
      const attendedIdsSet = new Set(attendedIdsArray);

      // Separate members into Attended and Not Attended
      const attended = [];
      const notAttended = [];

      all.forEach((member) => {
        if (attendedIdsSet.has(member.id.toString())) {
          attended.push(member);
        } else {
          notAttended.push(member);
        }
      });

      setAllMembers(all);
      setAttendedMembers(attended);
    } catch (error) {
      console.error("Error fetching attendance data", error);
      toast.error("Failed to load attendance lists");
    } finally {
      setLoading(false);
    }
  };

  // Calculate Not Attended list for filtering
  const attendedIds = new Set(attendedMembers.map((m) => m.id.toString()));
  const notAttendedMembers = allMembers.filter(
    (m) => !attendedIds.has(m.id.toString()),
  );

  // Filter based on search term
  const filteredAttended = attendedMembers.filter((m) =>
    (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredNotAttended = notAttendedMembers.filter((m) =>
    (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const MemberList = ({ title, members, icon: Icon, color }) => (
    <div className="flex-1 min-w-[280px] h-full flex flex-col">
      <div
        className={`p-3 rounded-t-lg bg-${color}-50 border border-${color}-100 flex items-center justify-between`}
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 text-${color}-500`} />
          <Typography variant="h6" className={`text-${color}-900 font-bold`}>
            {title}
          </Typography>
        </div>
        <Typography
          variant="small"
          className={`bg-${color}-100 text-${color}-800 px-2 py-0.5 rounded-full font-bold`}
        >
          {members.length}
        </Typography>
      </div>
      <div className="border border-t-0 border-gray-200 rounded-b-lg overflow-hidden flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto max-h-[300px] custom-scroll p-2 space-y-1 bg-white">
          {members.length === 0 ? (
            <div className="py-10 text-center opacity-40 italic text-sm">
              No members found
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="p-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 flex items-center gap-3 transition-colors rounded"
              >
                <div className={`w-2 h-2 rounded-full bg-${color}-400`} />
                <Typography
                  variant="small"
                  className="text-gray-800 flex-grow font-medium"
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="small"
                  className="text-gray-400 text-[10px]"
                >
                  {member.mobile}
                </Typography>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      size="lg"
      className="overflow-hidden"
    >
      <DialogHeader className="bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col items-center py-4 border-b border-gray-700">
        <Typography variant="h4" color="white" className="font-bold">
          View Attendance Details
        </Typography>
        <Typography
          variant="small"
          color="white"
          className="font-normal opacity-70"
        >
          Comparing attended and not attended member lists
        </Typography>
      </DialogHeader>

      <DialogBody className="p-6">
        <div>
          <div className="grid grid-cols-2 gap-2 mb-6">
            <span className="text-gray-800">
              <span className="font-medium">Date :</span>{" "}
              {moment(meetingData.meeting_date).format("DD-MM-YYYY")}
            </span>
            <span className="text-gray-800">
              <span className="font-medium">Time :</span>{" "}
              {meetingData.meeting_time}
            </span>
            <span className="text-gray-800">
              <span className="font-medium">Meeting For :</span>{" "}
              {meetingData.meeting_for}
            </span>
            <span className="text-gray-800">
              <span className="font-medium">Description : </span>
              {meetingData.meeting_description}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <Input
            label="Search by Name"
            icon={<i className="fas fa-search" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg"
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <CircularProgress size={50} thickness={4} color="inherit" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 h-full max-h-[400px]">
            <MemberList
              title="Attended"
              members={filteredAttended}
              icon={MdOutlineCheckCircle}
              color="green"
            />
            <MemberList
              title="Not Attended"
              members={filteredNotAttended}
              icon={MdOutlineCancel}
              color="red"
            />
          </div>
        )}
      </DialogBody>

      <DialogFooter className="border-t border-gray-100 mt-2 bg-gray-50/50">
        <Button
          variant="gradient"
          color="gray"
          onClick={handleClose}
          className="px-10"
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ViewAttendanceModal;
