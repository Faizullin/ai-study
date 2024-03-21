import React, { FC } from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import {
  closeModal,
  getModalDataById,
} from "@/core/redux/store/reducers/modalSlice";
import PrimaryButton from "../buttons/primary-button/PrimaryButton";
import { Img } from "@/core/constants/img";
import { IDocument } from "@/core/models/IDocument";

import "./document_item_detail_popup.scss";
import { FormattedMessage } from "react-intl";

interface IDocumentItemDetailPopupProps {
  id: string;
}

const DocumentItemDetailPopup: FC<IDocumentItemDetailPopupProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { document_payload, loading } = useAppSelector(
    (state) => state.document
  );
  const { isHeaderSearchBarOpen } = useAppSelector(
    (state) => state.searchSidebar
  );
  const { modals } = useAppSelector((state) => state.modal);
  const { props, open } = getModalDataById(modals, id);
  const { item } = props as { item: IDocument };

  const handleOpen = (event?: any) => {
    event?.preventDefault();
    if (props.item) {
      handleClose();
      navigate(`/documents/${props.item.id}/view`);
    }
  };
  const handleClose = () => {
    dispatch(
      closeModal({
        id,
      })
    );
  };

  return (
    <Modal
      show={open}
      onHide={handleClose}
      onBackdropClick={(e: any) => {
        handleClose();
      }}
      size="xl"
    >
      {/* <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header> */}
      {/* <Modal.Body> */}
      <div className="document-item-detail-popup m-0 p-0 row">
        {/* d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-self-stretch */}
        <a
          href="#"
          className="document-item-detail-popup__thumbnail col-12 col-md-6 p-0"
          onClick={handleOpen}
        >
          <img
            src={item?.featured_image?.url || Img.not_found}
            alt={item?.featured_image?.url}
            className="w-100 h-100 object-fit-cover bg-not-found-img"
          />
        </a>
        <div className="d-flex flex-column col-12 col-md-6 px-4 ps-md-5 pb-4 mb-5 mb-md-1">
          <p className="document-item-detail-popup__title text-wrap">
            {item?.title}
          </p>
          <p className="document-item-detail-popup__description text-wrap">
            {item?.description}
          </p>
          <PrimaryButton onClick={handleOpen}><FormattedMessage id="more" defaultMessage="More"/></PrimaryButton>
          <p className="document-item-detail-popup__description mt-4">
            Rating: {item?.rating_avg?.toPrecision(2)}
          </p>
        </div>
        {/* <div className="document-item-popup__subjects-list">
        <div>
          {item.subjects.map((subject_item) => (
            <a href="#" onClick={(e) => handleOpenSubject(e, subject_item)}></a>
          ))}
        </div>
      </div> */}
      </div>
      {/* </Modal.Body> */}
    </Modal>
  );
};

export default DocumentItemDetailPopup;
