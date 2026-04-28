import React, {
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
import Layout from "../../layout/Layout";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { ButtonConfig } from "../../config/ButtonConfig";
import {
  MdOutlineFactCheck,
  MdOutlineVisibility,
} from "react-icons/md";
import AttendanceModal from "./AttendanceModal";
import ViewAttendanceModal from "./ViewAttendanceModal";
import PageLoader from "../../components/PageLoader";

const InactiveMeeting = () => {
  const [inActiveUserData, setInActiveUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  // Attendance Modal state
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceMeetingId, setAttendanceMeetingId] = useState(null);

  // View Attendance Modal state
  const [isViewAttendanceModalOpen, setIsViewAttendanceModalOpen] =
    useState(false);
  const [viewAttendanceMeetingId, setViewAttendanceMeetingId] = useState(null);

  const fetchInActiveUser = async () => {
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-inactive-meeting-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setInActiveUserData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching inactive data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInActiveUser();
  }, []);

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
              inActiveUserData[tableMeta.rowIndex].meeting_date;
            const today = moment().format("YYYY-MM-DD");
            return (
              <div className="flex items-center space-x-2">
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
    [inActiveUserData],
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
  };

  const data = useMemo(
    () => (inActiveUserData ? inActiveUserData : []),
    [inActiveUserData],
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Layout>
      <div className="container mx-auto mt-5">
        <Card
          className={`p-8 bg-gradient-to-r px-8 py-5 border ${ButtonConfig.borderCard} hover:shadow-2xl transition-shadow duration-300`}
        >
          <CardHeader
            className={`text-center border ${ButtonConfig.borderCard} rounded-lg shadow-lg p-0 mb-6`}
          >
            <Typography
              variant="h4"
              color={ButtonConfig.typographyColor}
              className="font-bold"
            >
              InActive Meeting List
            </Typography>
          </CardHeader>
          <CardBody className="p-0">
            <MUIDataTable data={data} columns={columns} options={options} />
          </CardBody>
        </Card>
      </div>

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        handleClose={handleCloseAttendanceModal}
        meetingId={attendanceMeetingId}
        onSuccess={fetchInActiveUser}
      />

      <ViewAttendanceModal
        isOpen={isViewAttendanceModalOpen}
        handleClose={handleCloseViewAttendanceModal}
        meetingId={viewAttendanceMeetingId}
      />
    </Layout>
  );
};

export default InactiveMeeting;
