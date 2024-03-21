import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function AuthLayout() {
  return (
    <>
      <Header></Header>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-primary py-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
