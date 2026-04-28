import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ContextPanel } from "../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import BASE_URL from "../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import Layout from "../../layout/Layout";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import PageLoader from "../../components/PageLoader";
import MeetingModal from "../../components/MeetingModal";
import AttendanceModal from "./AttendanceModal";
import ViewAttendanceModal from "./ViewAttendanceModal";
import {
  MdOutlineEdit,
  MdOutlineGroupAdd,
  MdOutlineFactCheck,
  MdOutlineVisibility,
} from "react-icons/md";

const ActiveMeeting = () => {
  const [activeMeetingData, setActiveMeetingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  // Attendance Modal state
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceMeetingId, setAttendanceMeetingId] = useState(null);

  // View Attendance Modal state
  const [isViewAttendanceModalOpen, setIsViewAttendanceModalOpen] =
    useState(false);
  const [viewAttendanceMeetingId, setViewAttendanceMeetingId] = useState(null);

  const fetchActiveMeeting = async () => {
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-active-meeting-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setActiveMeetingData(response.data.data);
    } catch (error) {
      console.error("Error fetching active meetings", error);
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveMeeting();
  }, []);

  const handleOpenModal = (id = null) => {
    setSelectedMeetingId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeetingId(null);
  };

  const handleOpenAttendanceModal = (id) => {
    setAttendanceMeetingId(id);
    setIsAttendanceModalOpen(true);
  };

  const handleCloseAttendanceModal = () => {
    setIsAttendanceModalOpen(false);
    setAttendanceMeetingId(null);
  };

  const handleOpenViewAttendanceModal = (id) => {
    setViewAttendanceMeetingId(id);
    setIsViewAttendanceModalOpen(true);
  };

  const handleCloseViewAttendanceModal = () => {
    setIsViewAttendanceModalOpen(false);
    setViewAttendanceMeetingId(null);
  };

  const columns = useMemo(
    () => [
      {
        name: "slNo",
        label: "SL No",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta) => {
            return tableMeta.rowIndex + 1;
          },
        },
      },
      {
        name: "meeting_date",
        label: "Date",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return moment(value).format("DD-MM-YYYY");
          },
        },
      },
      {
        name: "meeting_time",
        label: "Time",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "meeting_for",
        label: "Meeting For",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "id",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (userId, tableMeta) => {
            const meetingDate =
              activeMeetingData[tableMeta.rowIndex].meeting_date;
            const today = moment().format("YYYY-MM-DD");
            return (
              <div className="flex items-center">
                <Tooltip content="Edit Meeting">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => handleOpenModal(userId)}
                    className="hover:bg-blue-gray-50 transition-colors"
                  >
                    <MdOutlineEdit className="h-5 w-5" />
                  </IconButton>
                </Tooltip>

                {meetingDate <= today && (
                  <>
                    <Tooltip content="Attendance">
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => handleOpenAttendanceModal(userId)}
                        className="hover:bg-blue-gray-50 transition-colors"
                      >
                        <MdOutlineFactCheck className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip content="View Attendance">
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => handleOpenViewAttendanceModal(userId)}
                        className="hover:bg-blue-gray-50 transition-colors"
                      >
                        <MdOutlineVisibility className="h-5 w-5" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </div>
            );
          },
        },
      },
    ],
    [activeMeetingData],
  );

  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    customToolbar: () => (
      <Button
        size="sm"
        variant="gradient"
        color="gray"
        onClick={() => handleOpenModal()}
      >
        <span>+</span> Create Meeting
      </Button>
    ),
  };

  const data = useMemo(
    () => (activeMeetingData ? activeMeetingData : []),
    [activeMeetingData],
  );

  if (loading && !activeMeetingData) {
    return <PageLoader />;
  }

  return (
    <Layout>
      <div className="container mx-auto mt-5">
        <Card
          className={`p-8 bg-gradient-to-r px-8 py-5 border ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}
        >
          <CardHeader
            className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden`}
          >
            <div className="py-6 flex flex-col items-center justify-center relative">
              <Typography
                variant="h4"
                color="white"
                className="font-bold relative z-10"
              >
                Active Meeting List
              </Typography>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                {/* Subtle pattern or graphic if needed */}
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <MUIDataTable data={data} columns={columns} options={options} />
          </CardBody>
        </Card>
      </div>

      <MeetingModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        selectedId={selectedMeetingId}
        onSuccess={fetchActiveMeeting}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        handleClose={handleCloseAttendanceModal}
        meetingId={attendanceMeetingId}
        onSuccess={fetchActiveMeeting}
      />

      <ViewAttendanceModal
        isOpen={isViewAttendanceModalOpen}
        handleClose={handleCloseViewAttendanceModal}
        meetingId={viewAttendanceMeetingId}
      />
    </Layout>
  );
};

export default ActiveMeeting;
