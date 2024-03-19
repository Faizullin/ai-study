import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import {
  closeModal,
  getModalDataById,
} from "@/core/redux/store/reducers/modalSlice";
import React, { ReactNode } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { FormattedMessage } from "react-intl";

export interface IDetailModalProps {
  id: string;
}

const ErrorModalContent = ({
  payload,
}: {
  payload?: {
    code: number;
    detail: string;
  };
}) => {
  return <Alert variant="danger">{payload?.detail}</Alert>;
};

export default function DetailModal({ id }: IDetailModalProps) {
  const dispatch = useAppDispatch();
  const { modals } = useAppSelector((state) => state.modal);
  const [title, setTitle] = React.useState<string>("");
  const { props, open } = getModalDataById(modals, id);
  const handleClose = () => {
    dispatch(
      closeModal({
        id,
      })
    );
  };
  React.useEffect(() => {
    if (props.type === "error") {
      if (props.type && props.code) {
        setTitle(`Error ${props.code}`);
      }
    }
  }, [props]);

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.type === "error" ? <ErrorModalContent payload={props} /> : <></>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FormattedMessage id="close" defaultMessage="Close" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
