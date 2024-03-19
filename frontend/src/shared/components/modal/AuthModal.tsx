import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import {
  closeModal,
  getModalDataById,
} from "@/core/redux/store/reducers/modalSlice";
import React from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";

export interface IAuthModalProps {
  id: string;
}

export default function AuthModal({ id }: IAuthModalProps) {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.modal);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { open } = getModalDataById(modals, id);
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const handleClose = () => {
    dispatch(
      closeModal({
        id,
      })
    );
  };
  const handleLoginRedirect = () => {
    handleClose();
    navigate({
      pathname: `/auth/login`,
      search: `redirect=${currentLocation.pathname}`,
    });
  };
  return (
    <Modal show={open}>
      <Modal.Header>
        <Modal.Title>Auth</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="primart">
          <Alert.Link onClick={handleLoginRedirect}>Login</Alert.Link> requried
        </Alert>
      </Modal.Body>
    </Modal>
  );
}
