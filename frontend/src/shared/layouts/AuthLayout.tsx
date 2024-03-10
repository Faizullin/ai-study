import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="vh-100 bg-primary">
      <div className="container h-100 d-flex align-items-center justify-content-center">
        <Outlet />
      </div>
    </div>
  );
}
