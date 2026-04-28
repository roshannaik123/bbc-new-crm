import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Checkbox,
  Input,
} from "@material-tailwind/react";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { MdSearch } from "react-icons/md";

const AttendanceModal = ({ isOpen, handleClose, meetingId, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setSearchTerm("");
    }
  }, [isOpen]);

  const fetchMembers = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");

      // Fetch both members and meeting details (to get existing attendance)
      const [membersRes, meetingRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/panel-fetch-active-member`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/panel-fetch-meeting-by-id/${meetingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const memberList = membersRes.data.data || membersRes.data || [];
      const meetingData = meetingRes.data.data || meetingRes.data || {};

      setMembers(memberList);

      // Pre-selection logic
      const existingAttendanceStr = meetingData.meeting_attendance || "";
      const existingIds = new Set(
        existingAttendanceStr
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id),
      );

      const preSelected = memberList.filter((m) =>
        existingIds.has(m.id.toString()),
      );

      setSelectedMembers(preSelected);
    } catch (error) {
      console.error("Error fetching members", error);
      toast.error("Failed to load member list");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleToggleMember = (member) => {
    const isSelected = selectedMembers.some((m) => m.id === member.id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(members);
    } else {
      setSelectedMembers([]);
    }
  };

  const filteredMembers = members.filter((m) =>
    (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Format as comma-separated string "1,76"
      const memberIdsStr = selectedMembers.map((m) => m.id).join(",");

      const response = await axios.put(
        `${BASE_URL}/api/panel-update-meeting-attendance/${meetingId}`,
        { meeting_attendance: memberIdsStr },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 || response.data.success) {
        toast.success(response.data.msg || "Attendance updated successfully");
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response.data.msg || "Failed to update attendance");
      }
    } catch (error) {
      console.error("Error updating attendance", error);
      toast.error(
        error.response?.data?.msg ||
          "Error updating attendance. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isAllSelected =
    members.length > 0 && selectedMembers.length === members.length;

  return (
    <Dialog
      open={isOpen}
      handler={handleClose}
      size="sm"
      className="overflow-hidden"
    >
      <DialogHeader className="flex flex-col items-start border-b border-gray-200 pb-4">
        <Typography variant="h4" color="blue-gray">
          Mark Attendance
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          Select members who attended this meeting
        </Typography>
      </DialogHeader>

      <DialogBody className="py-4">
        {fetchLoading ? (
          <div className="flex justify-center p-10">
            <CircularProgress size={40} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <Input
                  label="Search Member"
                  icon={<MdSearch className="h-5 w-5" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
              <Checkbox
                id="select-all"
                label={
                  <Typography color="blue-gray" className="font-bold">
                    Select All ({members.length})
                  </Typography>
                }
                checked={isAllSelected}
                onChange={handleSelectAll}
                containerProps={{ className: "-ml-3" }}
              />
              <Typography variant="small" color="gray" className="font-medium">
                {selectedMembers.length} selected
              </Typography>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto custom-scroll divide-y divide-gray-100">
                {filteredMembers.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 italic">
                    No members found matching "{searchTerm}"
                  </div>
                ) : (
                  filteredMembers.map((member) => {
                    const isChecked = selectedMembers.some(
                      (m) => m.id === member.id,
                    );
                    return (
                      <div
                        key={member.id}
                        className="flex items-center px-2 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={isChecked}
                          onChange={() => handleToggleMember(member)}
                          label={
                            <div className="flex flex-col">
                              <Typography
                                color="blue-gray"
                                className="font-medium text-sm"
                              >
                                {member.name}
                              </Typography>
                              <Typography
                                variant="small"
                                color="gray"
                                className="text-[10px]"
                              >
                                Mobile : {member.mobile}
                              </Typography>
                            </div>
                          }
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="space-x-2 border-t border-gray-200 mt-4">
        <Button
          variant="text"
          color="red"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="gray"
          onClick={handleSubmit}
          disabled={loading || fetchLoading || selectedMembers.length === 0}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              <span>Saving...</span>
            </>
          ) : (
            "Save Attendance"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AttendanceModal;
