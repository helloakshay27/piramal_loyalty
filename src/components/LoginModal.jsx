import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import TypeHeader from './TypeHeader';

const LoginModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header >
        <Modal.Title>Welcome</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Select an Type:</h5>
        <TypeHeader />
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleClose}>
          Close
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
