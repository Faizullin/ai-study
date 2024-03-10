import React from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const { userData, studentData, loading } = useAppSelector(
    (state) => state.user
  );
  // React.useEffect(() => {
  //   if (!userData && !loading.detail) {
  //     dispatch(fetchUserData());
  //   } else {
  //     if (!studentData && userData && userData.roles.includes("student")) {
  //       dispatch(fetchStudentData());
  //     }
  //   }
  // }, [userData]);
  return (
    <>
      <Header>{/* <Navbar /> */}</Header>
      <div className="flex-grow-1 d-flex flex-column ">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
