import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import About from "@/features/about/About";
import Login from "../features/auth/Login";
import Register from "@/features/auth/Register";
import ForgotPassword from "@/features/auth/ForgotPassword";
import ForgotPasswordConfirm from "@/features/auth/ForgotPasswordConfirm";
import Layout from "@/shared/layouts/Layout";
import AuthLayout from "@/shared/layouts/AuthLayout";
import DocumentList from "@/features/document/DocumentList";
import CourseList from "@/features/course/CourseList";
import ModalProvider from "@/shared/providers/ModalProvider";
import { DashboardRouter } from "@/features/dashboard/router";
import DocumentDetail from "@/features/document/DocumentDetail";
import ProtectedPopupRoute from "./ProtectedPopupRoute";
import ProtectedRoute from "./ProtectedRoute";
import SchemePage from "@/features/scheme/SchemePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <ModalProvider>
            <Layout />
          </ModalProvider>
        }
      >
        <Route path="/" element={<About />} />
       <Route path="scheme" element={<SchemePage />} />
        <Route path="courses">
          <Route path="" element={<CourseList />}></Route>
        </Route>
         <Route path="documents">
          <Route
            path=""
            element={
              <ProtectedPopupRoute>
                <DocumentList />
              </ProtectedPopupRoute>
            }
          ></Route>
          <Route
            path=":id/view"
            element={
              <ProtectedPopupRoute>
                <DocumentDetail />
              </ProtectedPopupRoute>
            }
          ></Route>
        </Route>
      </Route>
      <Route path="/" element={<AuthLayout />}>
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot_password" element={<ForgotPassword />} />
          <Route
            path="password_reset/confirm"
            element={<ForgotPasswordConfirm />}
          />
        </Route>
      </Route>
      {DashboardRouter}
    </>
  )
);

export default router;
