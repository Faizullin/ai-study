import React, { FC, ReactNode } from "react";
import SearchSidebar from "../components/search-sidebar/SearchSidebar";
import DetailModal from "../components/modal/DetailModal";
import DocumentItemDetailPopup from "@/shared/components/modal/DocumentItemDetailPopup";
import { useAppSelector } from "@/core/hooks/redux";
import { modalIds } from "@/core/redux/store/reducers/modalSlice";
import AuthModal from "../components/modal/AuthModal";

interface IModalProviderProps {
  children: ReactNode;
}

const ModalProvider: FC<IModalProviderProps> = ({ children }) => {
  const { modals } = useAppSelector((state) => state.modal);
  return (
    <>
      {children}
      <SearchSidebar />
      <DetailModal id={modalIds.detailModal} />
      <DocumentItemDetailPopup id={modalIds.documentItemDetailPopup} />
      <AuthModal id={modalIds.loginRequiredPopup} />
    </>
  );
};

export default ModalProvider;
