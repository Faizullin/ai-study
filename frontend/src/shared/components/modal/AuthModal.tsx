import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { closeModal } from "@/core/redux/store/reducers/modalSlice";
import React from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

export interface IAuthModalProps {
  show?: boolean;
  setShow?: (a: boolean) => void;
  payload?: any;
}

export default function AuthModal(props: IAuthModalProps) {
  const navigate = useNavigate();
  const handleClose = () => {
    if (props.setShow !== undefined) {
      props.setShow(false);
    }
  };
  const handleLoginRedirect = () => {
    props.setShow(false);
    navigate("/auth/login");
  };
  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Auth</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="primart">
          <Alert.Link onClick={handleLoginRedirect}>Login</Alert.Link> requried
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FormattedMessage id="close" defaultMessage="Close" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
