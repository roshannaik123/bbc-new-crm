import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";
import moment from "moment";
import { CircularProgress } from "@mui/material";

const LeadModal = ({ isOpen, handleClose, leadId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    lead_date: moment().format("YYYY-MM-DD"),
    lead_from_id: "",
    lead_to_id: "",
    lead_amount: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setErrors({});
      if (leadId) {
        fetchLeadDetails();
      } else {
        setFormData({
          lead_date: moment().format("YYYY-MM-DD"),
          lead_from_id: "",
          lead_to_id: "",
          lead_amount: "",
        });
      }
    }
  }, [isOpen, leadId]);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-active-member`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMembers(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching active members", error);
    }
  };

  const fetchLeadDetails = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-lead-by-id/${leadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = response.data.data || response.data || {};
      setFormData({
        lead_date: data.lead_date || "",
        lead_from_id: data.lead_from_id || "",
        lead_to_id: data.lead_to_id || "",
        lead_amount: data.lead_amount || "",
      });
    } catch (error) {
      console.error("Error fetching lead details", error);
      toast.error("Failed to fetch lead details");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.lead_date) newErrors.lead_date = "Lead date is required";
    if (!formData.lead_from_id)
      newErrors.lead_from_id = "Lead from member is required";
    if (!formData.lead_to_id)
      newErrors.lead_to_id = "Lead to member is required";
    if (!formData.lead_amount) newErrors.lead_amount = "Lead amount is required";

    if (
      formData.lead_from_id &&
      formData.lead_to_id &&
      formData.lead_from_id === formData.lead_to_id
    ) {
      newErrors.lead_to_id = "Lead From and To cannot be same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (formData.lead_from_id === formData.lead_to_id) {
      toast.error("Lead From and Lead To members cannot be the same");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        lead_amount: Number(formData.lead_amount),
      };

      if (leadId) {
        await axios.put(
          `${BASE_URL}/api/panel-update-lead/${leadId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("Lead updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/panel-create-lead`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Lead created successfully");
      }
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error submitting lead", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} handler={handleClose} size="sm">
      <DialogHeader className="bg-gray-900 flex flex-col items-start p-4 text-white">
        <Typography variant="h4">
          {leadId ? "Edit Lead" : "Add New Lead"}
        </Typography>
        <Typography variant="small" className="font-normal opacity-80">
          {leadId
            ? "Update the details of the existing lead."
            : "Fill in the details to create a new lead."}
        </Typography>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogBody className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {fetchLoading ? (
            <div className="flex justify-center p-10">
              <CircularProgress size={40} />
            </div>
          ) : (
            <>
              <div className="">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  Lead Date <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="date"
                  name="lead_date"
                  value={formData.lead_date}
                  onChange={handleChange}
                  className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errors.lead_date ? "border-red-500" : ""}`}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                {errors.lead_date && (
                  <Typography variant="small" color="red" className="mt-1 font-normal text-[11px]">
                    {errors.lead_date}
                  </Typography>
                )}
              </div>

              <div className="space-y-1">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  Lead From <span className="text-red-500">*</span>
                </Typography>
                <select
                  name="lead_from_id"
                  value={formData.lead_from_id}
                  onChange={handleChange}
                  className={`w-full border ${errors.lead_from_id ? "border-red-500" : "border-blue-gray-200"} rounded-md p-2 focus:border-gray-900 outline-none bg-transparent`}
                >
                  <option value="">Select Member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {errors.lead_from_id && (
                  <Typography variant="small" color="red" className="mt-1 font-normal text-[11px]">
                    {errors.lead_from_id}
                  </Typography>
                )}
              </div>

              <div className="space-y-1">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  Lead To <span className="text-red-500">*</span>
                </Typography>
                <select
                  name="lead_to_id"
                  value={formData.lead_to_id}
                  onChange={handleChange}
                  className={`w-full border ${errors.lead_to_id ? "border-red-500" : "border-blue-gray-200"} rounded-md p-2 focus:border-gray-900 outline-none bg-transparent`}
                >
                  <option value="">Select Member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {errors.lead_to_id && (
                  <Typography variant="small" color="red" className="mt-1 font-normal text-[11px]">
                    {errors.lead_to_id}
                  </Typography>
                )}
              </div>

              <div className="space-y-1">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  Lead Amount <span className="text-red-500">*</span>
                </Typography>
                <Input
                  type="number"
                  name="lead_amount"
                  placeholder="Enter amount"
                  value={formData.lead_amount}
                  onChange={handleChange}
                  className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${errors.lead_amount ? "border-red-500" : ""}`}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                {errors.lead_amount && (
                  <Typography variant="small" color="red" className="mt-1 font-normal text-[11px]">
                    {errors.lead_amount}
                  </Typography>
                )}
              </div>
            </>
          )}
        </DialogBody>

        <DialogFooter className="space-x-2 border-t border-blue-gray-50 p-4">
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
            type="submit"
            disabled={loading || fetchLoading}
            className="flex items-center gap-2"
          >
            {loading && <CircularProgress size={16} color="inherit" />}
            {leadId ? "Update Lead" : "Create Lead"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default LeadModal;
