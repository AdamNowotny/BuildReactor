import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import IconCheck from '~icons/fa/check-square-o';

export default ({
    serviceName,
    show,
    onRemove,
    onCancel,
}: {
    serviceName?: string;
    show: boolean;
    onRemove?: () => void;
    onCancel?: () => void;
}) => {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="modal-title">
                        <IconCheck />
                        &nbsp; Confirmation
                    </h4>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    Remove service <strong>{serviceName} ?</strong>
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="danger" onClick={onRemove}>
                    Remove
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};
