import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { modalIds, openModal } from "@/core/redux/store/reducers/modalSlice";

const ProtectedPopupRoute: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(
        openModal({
          id: modalIds.loginRequiredPopup,
        })
      );
    }
  }, [isAuthenticated]);
  return children;
};
export default ProtectedPopupRoute;
