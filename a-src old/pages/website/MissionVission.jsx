import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import { HiOutlineSave } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";

const MissionVission = () => {
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  // Mission & Vision states
  const [openDialog, setOpenDialog] = useState(false);
  const [missionVision, setMissionVision] = useState({
    product_mission: "",
    product_vision: "",
  });
  const [missionVisionId, setMissionVisionId] = useState(null);
  const [hasMissionVision, setHasMissionVision] = useState(false);

  useEffect(() => {
    const fetchMissionVision = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-mission-vision`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Updated to match the actual API response structure
        if (response.data && response.data.mission_vision) {
          setMissionVision({
            product_mission: response.data.mission_vision.product_mission || "",
            product_vision: response.data.mission_vision.product_vision || "",
          });
          setMissionVisionId(response.data.mission_vision.id);
          setHasMissionVision(true);
        }
      } catch (error) {
        console.error("Error fetching mission & vision data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionVision();
  }, [isPanelUp, navigate]);

  // Mission & Vision functions for dialog creation
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogInputChange = (e) => {
    setMissionVision({
      ...missionVision,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateMissionVision = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Create new mission & vision
      await axios.post(
        `${BASE_URL}/api/panel-create-mission-vision`,
        missionVision,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Mission & Vision Created Successfully");

      handleCloseDialog();

      // Refresh the data
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-mission-vision`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.mission_vision) {
        setMissionVision({
          product_mission: response.data.mission_vision.product_mission || "",
          product_vision: response.data.mission_vision.product_vision || "",
        });
        setMissionVisionId(response.data.mission_vision.id);
        setHasMissionVision(true);
      }
    } catch (error) {
      console.error("Error creating mission & vision", error);
      toast.error("Error creating Mission & Vision");
    } finally {
      setLoading(false);
    }
  };

  // Direct page update functions (like in About component)
  const handleInputChange = (e) => {
    setMissionVision({
      ...missionVision,
      [e.target.name]: e.target.value,
    });
    setIsUpdated(true);
  };

  const handleUpdateMissionVision = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/api/panel-update-mission-vision/${missionVisionId}`,
        missionVision,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Mission & Vision Updated");
      setIsUpdated(false);
    } catch (error) {
      console.error("Error updating mission & vision", error);
      toast.error("Error updating Mission & Vision");
    } finally {
      setLoading(false);
    }
  };
  if(loading){
    return (
      <PageLoader/>
  )
  }
  return (
    <Layout>
      <div className="container mx-auto mt-5">
        <Card className={`p-8 bg-gradient-to-r  px-8 py-5 border  ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}>
          <CardHeader className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6`}>
            <Typography variant="h4" olor={ButtonConfig.typographyColor} className="font-bold">
              Mission & Vision
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            {!hasMissionVision && (
              <div className="flex justify-center">
                <Button
                  onClick={handleOpenDialog}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  disabled={loading}
                >
                  <FaTasks className="inline mr-2" />
                  Create Mission & Vision
                </Button>
              </div>
            )}

            {hasMissionVision && (
              <form className="space-y-6">
                <div>
                  <Textarea
                    variant="static"
                    label="Mission *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your company's mission"
                    value={missionVision.product_mission || ""}
                    onChange={handleInputChange}
                    name="product_mission"
                    className="bg-gray-100 text-gray-700 placeholder-gray-400 min-h-64 w-full"
                    rows={12}
                  />
                </div>

                <div>
                  <Textarea
                    variant="static"
                    label="Vision *"
                    color={ButtonConfig.inputColor}
                    labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
                    placeholder="Enter your company's vision"
                    value={missionVision.product_vision || ""}
                    onChange={handleInputChange}
                    name="product_vision"
                    className="bg-gray-100 text-gray-700 placeholder-gray-400 min-h-64 w-full"
                    rows={12}
                  />
                </div>

                <div className="flex justify-center mt-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleUpdateMissionVision}
                      disabled={!isUpdated || loading}
                      className={`w-full sm:w-auto px-8 py-3 ${ButtonConfig.sumbitButtonBg} hover:${ButtonConfig.sumbitButtonBgHover} transition-colors duration-300 flex items-center justify-center gap-2 ${!isUpdated ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                    
                      <span>{loading ? "Updating..." : "Update "}</span>
                    </Button>
                    <Button
                      type="button"
                      color={ButtonConfig.cancelButtonColor}
                      className="w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2"
                      onClick={() => navigate("/home")}
                    >
                   
                      <span>Cancel</span>
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Dialog for creating mission & vision */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader>Create Mission & Vision</DialogHeader>
        <DialogBody>
          <div className="space-y-6">
            <Textarea
              variant="static"
              label="Mission *"
              color={ButtonConfig.inputColor}
              labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
              placeholder="Enter your company's mission"
              value={missionVision.product_mission || ""}
              onChange={handleDialogInputChange}
              name="product_mission"
              className="bg-gray-100 text-gray-700 placeholder-gray-400 min-h-64 w-full"
              rows={6}
            />
            <Textarea
              variant="static"
              label="Vision *"
              color={ButtonConfig.inputColor}
              labelProps={{ className: `${ButtonConfig.inputLabelProps}` }}
              placeholder="Enter your company's vision"
              value={missionVision.product_vision || ""}
              onChange={handleDialogInputChange}
              name="product_vision"
              className="bg-gray-100 text-gray-700 placeholder-gray-400 min-h-64 w-full"
              rows={6}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseDialog}
            className="mr-4"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleCreateMissionVision}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default MissionVission;