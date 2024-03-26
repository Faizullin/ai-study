import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Layout() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <Header>{/* <Navbar /> */}</Header>
      <div className="flex-grow-1 d-flex  flex-column ">
        <Outlet />
      </div>
      <Footer />
      {/* <div id="preloader"></div>
      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a> */}
    </>
  );
}
