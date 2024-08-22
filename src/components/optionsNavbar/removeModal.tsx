import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default ({ serviceName, show, onRemove, onCancel }) => {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="modal-title">
                        <span className="fa fa-check-square-o"></span> Confirmation
                    </h4>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    Remove service <strong>{serviceName} ?</strong>
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button bsStyle="danger" onClick={onRemove}>
                    Remove
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};
