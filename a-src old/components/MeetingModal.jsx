import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import BASE_URL from "../base/BaseUrl";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const MeetingModal = ({ isOpen, handleClose, selectedId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [meetingData, setMeetingData] = useState({
    meeting_date: "",
    meeting_time: "",
    meeting_for: "",
    meeting_description: "",
    meeting_status: "Active",
  });

  // Get current date for min date validation
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen && selectedId) {
      fetchMeetingDetails();
    } else if (isOpen && !selectedId) {
      // Reset form for create mode
      setMeetingData({
        meeting_date: "",
        meeting_time: "",
        meeting_for: "",
        meeting_description: "",
        meeting_status: "Active",
      });
    }
  }, [isOpen, selectedId]);

  const fetchMeetingDetails = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-meeting-by-id/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data || response.data;
      setMeetingData({
        meeting_date: data.meeting_date || "",
        meeting_time: data.meeting_time || "",
        meeting_for: data.meeting_for || "",
        meeting_description: data.meeting_description || "",
        meeting_status: data.meeting_status || "Active",
      });
    } catch (error) {
      console.error("Error fetching meeting details", error);
      toast.error("Failed to load meeting details");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setMeetingData((prev) => ({
      ...prev,
      meeting_status: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingData.meeting_date || !meetingData.meeting_time || !meetingData.meeting_for) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const endpoint = selectedId 
        ? `${BASE_URL}/api/panel-update-meeting/${selectedId}`
        : `${BASE_URL}/api/panel-create-meeting`;
      
      const method = selectedId ? "put" : "post";

      const response = await axios({
        method: method,
        url: endpoint,
        data: meetingData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.data.success) {
        toast.success(response.data.msg || `Meeting ${selectedId ? "updated" : "created"} successfully`);
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response.data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving meeting", error);
      toast.error(error.response?.data?.msg || "Failed to save meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} handler={handleClose} size="md" className="overflow-hidden">
      <DialogHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white flex flex-col items-center py-4">
        <Typography variant="h4" color="white" className="font-bold">
          {selectedId ? "Edit Meeting" : "Schedule New Meeting"}
        </Typography>
        <Typography variant="small" color="white" className="font-normal opacity-70">
          {selectedId ? "Update existing meeting details" : "Fill in the details for a new participant gathering"}
        </Typography>
      </DialogHeader>
      
      <DialogBody className="p-6">
        {fetchLoading ? (
          <div className="flex justify-center p-10">
            <CircularProgress />
          </div>
        ) : (
          <form id="meeting-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  Meeting Date <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="date"
                  name="meeting_date"
                  min={currentDate}
                  value={meetingData.meeting_date}
                  onChange={handleInputChange}
                  className="!border-t-blue-gray-200 focus:!border-t-pink-500"
                  labelProps={{ className: "hidden" }}
                  required
                />
              </div>
              <div className="space-y-1">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  Meeting Time <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="time"
                  name="meeting_time"
                  value={meetingData.meeting_time}
                  onChange={handleInputChange}
                  className="!border-t-blue-gray-200 focus:!border-t-pink-500"
                  labelProps={{ className: "hidden" }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 flex-grow">
                <Typography variant="small" color="blue-gray" className="font-bold">
                  Meeting For <span className="text-red-500">*</span>
                </Typography>
                <Input
                  placeholder="e.g. Project Discussion"
                  name="meeting_for"
                  value={meetingData.meeting_for}
                  onChange={handleInputChange}
                  className="!border-t-blue-gray-200 focus:!border-t-pink-500"
                  labelProps={{ className: "hidden" }}
                  required
                />
              </div>
              {selectedId && (
                <div className="space-y-1">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    Status <span className="text-red-500">*</span>
                  </Typography>
                  <Select
                    label="Select Status"
                    value={meetingData.meeting_status}
                    onChange={(val) => handleStatusChange(val)}
                    className="!border-t-blue-gray-200 focus:!border-t-pink-500"
                    labelProps={{ className: "hidden" }}
                  >
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Typography variant="small" color="blue-gray" className="font-bold">
                Meeting Description
              </Typography>
              <Textarea
                rows={3}
                placeholder="Enter detailed description..."
                name="meeting_description"
                value={meetingData.meeting_description}
                onChange={handleInputChange}
                className="!border-t-blue-gray-200 focus:!border-t-pink-500"
                labelProps={{ className: "hidden" }}
              />
            </div>
          </form>
        )}
      </DialogBody>

      <DialogFooter className="space-x-2 border-t border-blue-gray-50 bg-blue-gray-50/20">
        <Button variant="text" color="red" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="meeting-form"
          disabled={loading || fetchLoading}
          className="bg-gradient-to-r from-gray-800 to-gray-900 flex items-center gap-2"
        >
          {loading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              <span>Saving...</span>
            </>
          ) : (
            selectedId ? "Update Meeting" : "Schedule Meeting"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default MeetingModal;
