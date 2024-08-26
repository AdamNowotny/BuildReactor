import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

export default ({
    serviceName,
    show,
    onRename,
    onCancel,
}: {
    serviceName?: string;
    show?: boolean;
    onRename: (newName: string) => void;
    onCancel?: () => void;
}) => {
    const [newServiceName, setNewServiceName] = useState(serviceName);

    const handleRename = () => {
        onRename(newServiceName ?? '');
    };
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="modal-title">
                        <span className="fa fa-pencil"></span> Rename
                    </h4>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group controlId="newServiceName">
                        <Form.Label>New name:</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            defaultValue={serviceName}
                            onChange={e => {
                                setNewServiceName(e.target.value);
                            }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={handleRename}>
                    OK
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};
