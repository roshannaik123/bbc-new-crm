import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
// import ChangePassword from "./pages/profile/ChangePassword";
// import UserProfile from "./pages/dashboard/UserProfile";
// import About from "./pages/website/About";
// import Enquiry from "./pages/website/Enquiry";
import NewUser from "./pages/users/NewUser";
// import ActiveUser from "./pages/users/ActiveUser";
// import InactiveUser from "./pages/users/InactiveUser";
// import MobileUser from "./pages/users/MobileUser";
// import ShareUser from "./pages/users/ShareUser";
// import Download from "./pages/users/Download";
// import Portfolio from "./pages/website/Portfolio";
// import ShareUserById from "./pages/users/ShareUserById";
import NewUserView from "./pages/users/NewUserView";
// import Feedback from "./pages/users/Feedback";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import DisabledRightClick from "./components/DisabledRightClick";
// import MissionVission from "./pages/website/MissionVission";
// import Contact from "./pages/users/Contact";
// const NewUserView = lazy(() => import("./pages/users/NewUserView"));
const ShareUserById = lazy(() => import("./pages/users/ShareUserById"));
const Portfolio = lazy(() => import("./pages/website/Portfolio"));
const Download = lazy(() => import("./pages/users/Download"));
const ShareUser = lazy(() => import("./pages/users/ShareUser"));
const MobileUser = lazy(() => import("./pages/users/MobileUser"));
const InactiveUser = lazy(() => import("./pages/users/InactiveUser"));
const ActiveUser = lazy(() => import("./pages/users/ActiveUser"));
// const NewUser = lazy(() => import("./pages/users/NewUser"));
const Enquiry = lazy(() => import("./pages/website/Enquiry"));
const About = lazy(() => import("./pages/website/About"));
const UserProfile = lazy(() => import("./pages/dashboard/UserProfile"));
const ChangePassword = lazy(() => import("./pages/profile/ChangePassword"));
// const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword"));

const Feedback = lazy(() => import("./pages/users/Feedback"));
const Contact = lazy(() => import("./pages/users/Contact"));
const MissionVission = lazy(() => import("./pages/website/MissionVission"));
const ActiveMeeting = lazy(() => import("./pages/meeting/ActiveMeeting"));
const InactiveMeeting = lazy(() => import("./pages/meeting/InactiveMeeting"));
const LeadList = lazy(() => import("./pages/lead/LeadList"));

const App = () => {
  return (
    <>
      <ToastContainer />
      <DisabledRightClick/>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <UserProfile />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <About />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/mission-vision"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <MissionVission />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <Portfolio />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/enquiry"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <Enquiry />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/new-user"
          element={<ProtectedRoute element={<NewUser />} />}
        />
        <Route
          path="/user-view"
          element={<ProtectedRoute element={<NewUserView />} />}
        />
        <Route
          path="/active-user"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <ActiveUser />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/inactive-user"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <InactiveUser />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/active-meeting"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <ActiveMeeting />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/inactive-meeting"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <InactiveMeeting />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/lead-list"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <LeadList />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/mobile-user"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <MobileUser />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <Feedback />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <Contact />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/share-user"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <ShareUser />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/share-view"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <ShareUserById />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/download"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <Download />
                </Suspense>
              }
            />
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              element={
                <Suspense fallback={<Loader />}>
                  <ChangePassword />
                </Suspense>
              }
            />
          }
        />

        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
