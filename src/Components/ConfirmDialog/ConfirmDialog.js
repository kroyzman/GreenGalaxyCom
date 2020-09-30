import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ConfirmDialog = ({ handleSubmit, show, handleClose }) => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setShowDialog(show);
  }, [show]);

  const handleConfirm = () => {
    handleSubmit();
  };

  return (
    <>
      <Modal centered show={showDialog} onHide={handleClose}>
        <Modal.Body>
          Are You Sure?
          <p className="text-muted">(All Commissions will be deleted)</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmDialog;
