import React from "react";
import ProtectedRoute from "@/router/ProtectedRoute";
import { Route } from "react-router-dom";
import TitleHelment from "@/shared/components/title/TitleHelmet";
import DashboardLayout from "@/shared/layouts/DashboardLayout";

const Profile = React.lazy(() => import("./profile/Profile"));
// const StudentProtectedRoute = React.lazy(
//   () => import("@/router/StudentProtectedRoute")
// );
// const DashboardResultIndex = React.lazy(() => import("./result"));
// const DashboardExamIndex = React.lazy(() => import("./exam"));
// const CertificateIndex = React.lazy(() => import("./certificate"));
// const DashboardProjectList = React.lazy(() => import("./project"));
// const DashboardProjectEdit = React.lazy(
//   () => import("./project/project-edit/ProjectEdit")
// );
// const ConferenceList = React.lazy(() => import("./conference"));

export const DashboardRouter = (
  <Route path="">
    <Route
      path="dashboard"
      element={
        <ProtectedRoute>
          <>
            <TitleHelment title={"Dashboard"} />
            <DashboardLayout />
          </>
        </ProtectedRoute>
      }
    >
      {/* <Route path="" element={<DashboardIndex />} /> */}
      <Route
        path="profile"
        element={<Profile />}
        handle={{
          crumb: [
            {
              label: "Profile",
              active: true,
            },
          ],
        }}
      />
      {/* <Route
        path="results"
        element={
          <StudentProtectedRoute>
            <DashboardResultIndex />
          </StudentProtectedRoute>
        }
        handle={{
          crumb: [
            {
              label: "Results",
              active: true,
            },
          ],
        }}
      />
      <Route
        path="exams"
        element={
          <StudentProtectedRoute>
            <DashboardExamIndex />
          </StudentProtectedRoute>
        }
        handle={{
          crumb: [
            {
              label: "Exams",
              active: true,
            },
          ],
        }}
      />
      <Route
        path="conferences"
        element={<ConferenceList />}
        handle={{
          crumb: [
            {
              label: "Conferences",
              active: true,
            },
          ],
        }}
      /> */}
      {/* <Route
        path="certificates"
        element={
          <StudentProtectedRoute>
            <CertificateIndex />
          </StudentProtectedRoute>
        }
        handle={{
          crumb: [
            {
              label: "Certificates",
              active: true,
            },
          ],
        }}
      /> */}
    </Route>
  </Route>
);
